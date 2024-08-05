import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'src/user/user.entity';
import { FollowEntity } from 'src/profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]),TypeOrmModule.forFeature([UserEntity]),TypeOrmModule.forFeature([FollowEntity]) ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule {}
