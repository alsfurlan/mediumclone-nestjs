import { UserEntity } from '@app/user/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      queryBuilder.andWhere('articles.author.id = :id', { id: author.id });
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();
    return { articles, articlesCount };
  }

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

  async findBySlug(slug: string, relations = []) {
    return await this.articleRepository.findOne({ where: { slug }, relations });
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

  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number,
  ) {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException("You aren't the author of this article");
    }
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async addArticlesToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex((favorite) => favorite.id === article.id) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoriteCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug, ['userFavorites']);
    const userIndex = article.userFavorites.findIndex(
      (user) => user.id === currentUserId,
    );

    if (userIndex >= 0) {
      article.userFavorites.splice(userIndex, 1);
      article.favoriteCount--;
      await this.articleRepository.save(article);
    }
    return article;
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
