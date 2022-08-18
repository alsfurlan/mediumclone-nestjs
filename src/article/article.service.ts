import { UserEntity } from '@app/user/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currrentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    article.tagList = article.tagList ?? [];
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currrentUser;
    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string) {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException("You aren't the author of this article");
    }

    return await this.articleRepository.delete({
      slug,
    });
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return `${slugify(title, { lower: true })}-${(
      (Math.random() * Math.pow(36, 6)) |
      0
    ).toString(36)}`;
  }
}
