import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateArticleDTO } from './DTO/createarticle.dto';
import { ArticleResponseInterface } from './type/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDTO } from './DTO/updatearticle.dto';
import { ArticlesResponseInterface } from './type/articlesResponse.interface';
import { FollowEntity } from 'src/profile/profile.entity';

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity> ,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>, private dataSourse:DataSource,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>){}

    async createArticle(currentUser: UserEntity, createArticleDTO: CreateArticleDTO): Promise<ArticleEntity>{
        const article = new ArticleEntity;
        Object.assign(article, createArticleDTO);

        if(!article.tagList){
            article.tagList = [];
        }

        article.slug = this.getSlug(createArticleDTO.title);
        
        article.author = currentUser;

        return await this.articleRepository.save(article);
    }

    createArticleResponse(article: ArticleEntity): ArticleResponseInterface{
        return {article};
    }

    private getSlug(title :string): string{
        return (slugify(title , { lower : true}) + '-' + ((Math.random() * Math.pow(36 , 6)) | 0).toString(36));
    }

async findArticleBySlug(slug: string): Promise<ArticleEntity>{
    return this.articleRepository.findOne({where:{slug}})
}

async deleteArticle(userId: number, slug: string):Promise<DeleteResult>{

    if(!this.findArticleBySlug(slug)){
        throw new HttpException("article does not exist", HttpStatus.NOT_FOUND)
    }
    const article = await this.findArticleBySlug(slug);
    
    if(article.author.id !== userId){
        throw new HttpException("you are not this articles' author!", HttpStatus.FORBIDDEN)
    }

    return this.articleRepository.delete({slug})
}

async updateUser(userId: number, slug: string, updateArticleDTO:UpdateArticleDTO): Promise<ArticleEntity>{    
    if(!this.findArticleBySlug(slug)){
        throw new HttpException("article does not exist", HttpStatus.NOT_FOUND)
    }
    const article = await this.findArticleBySlug(slug);
    
    if(article.author.id !== userId){
        throw new HttpException("you are not this articles' author!", HttpStatus.FORBIDDEN)
    }

    Object.assign(article, updateArticleDTO);

    return this.articleRepository.save(article);    
}

async likeArticle(userId: number, slug: string):Promise<ArticleEntity>{
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['favorites']});

    const isNotFavorite = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id)     === -1;

    if(isNotFavorite){
        user.favorites.push(article);
        article.favoritesCount++;

        await this.articleRepository.save(article);
        await this.userRepository.save(user)
    }   

    return article;
}

async disLikeArticle(userId: number, slug: string):Promise<ArticleEntity>{
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['favorites']});

    const articleIndex = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id);

    if(articleIndex >= 0){
        user.favorites.splice(articleIndex, 1);
        article.favoritesCount--;

        await this.articleRepository.save(article);
        await this.userRepository.save(user)
    }   

    return article;
}

async findAll(currentUserId: number, query: any):Promise<ArticlesResponseInterface>{
    const queryBuilder = this.dataSourse.getRepository(ArticleEntity).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC')
    
    if(query.tag){
        queryBuilder.andWhere("articles.tagList LIKE :tag", {
            tag: `%${query.tag}%`,
        })
    }

    if(query.author){
        const author = await this.userRepository.findOne({where:{id : query.id}})
        queryBuilder.andWhere("articles.author = :author", {
            author: author.id,
        })
    }

    const articlesCount = await queryBuilder.getCount();

    if(query.offset){
        queryBuilder.offset(query.offset)
    }
    
    if(query.limit){
        queryBuilder.limit(query.limit)
    }

    const articles = await queryBuilder.getMany();

    return {articles, articlesCount};
}

async getFeed(currentUserId: number, query: any):Promise<ArticlesResponseInterface>{
    console.log("hi")
    const follows = await this.followRepository.find({where:{followerId: currentUserId}});
    if(!follows){
        console.log(follows)
        return {articles: [], articlesCount: 0}
    }
    const followings = follows.map(follow => follow.followingId);
    const queryBuilder = this.dataSourse.getRepository(ArticleEntity).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author').where('articles.author in (:...ids)', {ids: followings});
    
    queryBuilder.orderBy('articles.createdAt', 'DESC')
    
    if(query.tag){
        queryBuilder.andWhere("articles.tagList LIKE :tag", {
            tag: `%${query.tag}%`,
        })
    }

    if(query.author){
        const author = await this.userRepository.findOne({where:{id : query.id}})
        queryBuilder.andWhere("articles.author = :author", {
            author: author.id,
        })
    }

    const articlesCount = await queryBuilder.getCount();

    if(query.offset){
        queryBuilder.offset(query.offset)
    }
    
    if(query.limit){
        queryBuilder.limit(query.limit)
    }

    const articles = await queryBuilder.getMany();

    console.table(articles);

    return {articles, articlesCount};
}
}
