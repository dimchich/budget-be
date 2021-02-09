import { User } from './users.interface';

export interface Group {
  id: number;
  name: string;
  author: User;
  authorId: number;
}
