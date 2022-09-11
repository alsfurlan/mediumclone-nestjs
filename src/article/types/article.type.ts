import { ArticleEntity } from '../article.entity';

export type ArticleType = Omit<
  ArticleEntity,
  'updateTimestamp' | 'userFavorites'
> & { favorited: boolean };
