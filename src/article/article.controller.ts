import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/user/Guards/auth.guard';
import { User } from 'src/user/decoratores/user.decorator';
import { CreateArticleDTO } from './DTO/createarticle.dto';
import { ArticleResponseInterface } from './type/articleResponse.interface';
import { UpdateArticleDTO } from './DTO/updatearticle.dto';
import { ArticlesResponseInterface } from './type/articlesResponse.interface';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService){}

    @ApiBearerAuth()
    @Post()
    @ApiBody({
        type: CreateArticleDTO,
        description: 'Json structure for user object',
    })
    @UseGuards(AuthGuard)
    async createArticles(@User() currentUser, @Body() createArticlesDTO: CreateArticleDTO[]): Promise<ArticleResponseInterface[]> {
    const articles = await Promise.all(
        createArticlesDTO.map(createArticleDTO => 
            this.articleService.createArticle(currentUser, createArticleDTO)
        )
    );

    return articles.map(article => 
        this.articleService.createArticleResponse(article)
    );
}
    @Get(':slug')
    async FindArticeleBySlug(@Param('slug') slug: string): Promise<ArticleResponseInterface>{
        const article = await this.articleService.findArticleBySlug(slug);

        return this.articleService.createArticleResponse(article);
    }

    @ApiBearerAuth()
    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string){
        return await this.articleService.deleteArticle(currentUserId, slug);
    }

    @ApiBearerAuth()
    @Put(':slug')
    @ApiBody({
        type: UpdateArticleDTO,
        description: 'Json structure for user object',
    })
    @UseGuards(AuthGuard)
    async updateUser(@User('id')  currentUserId:number, @Param('slug') slug: string,  @Body() updateArticleDTO: UpdateArticleDTO): Promise<ArticleResponseInterface>{
        const article = await this.articleService.updateUser(currentUserId, slug, updateArticleDTO);

        return this.articleService.createArticleResponse(article);
    }

    @ApiBearerAuth()
    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async likingArticles(@User('id') currentUserId: number, @Param('slug') slug: string ): Promise<ArticleResponseInterface>{
        const article = await this.articleService.likeArticle(currentUserId, slug);
        return this.articleService.createArticleResponse(article);
    }

    @ApiBearerAuth()
    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async disLikingArticles(@User('id') currentUserId: number, @Param('slug') slug: string ): Promise<ArticleResponseInterface>{
        const article = await this.articleService.disLikeArticle(currentUserId, slug);
        return this.articleService.createArticleResponse(article);
    }

    @ApiBearerAuth()
    @Get('getfeed')
    @UseGuards(AuthGuard)
    async getFeed(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface>{
        console.log("hi");
        return this.articleService.getFeed(currentUserId, query)
    }

    @Get()
    async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface>{
        console.log("hi");
        return this.articleService.findAll(currentUserId, query);
    }

   
}
