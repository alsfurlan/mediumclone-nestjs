import { Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}
  @Post()
  async create() {
    return this.articlesService.createArticle();
  }
}
