import User from './User';

export default interface Post {
  id: number;
  title: string;
  content: string;
  parent_post: number;
  author_id?: number;
  author?: User;
  created_at: Date;
  last_modified: Date;
  url: string;
  votes: number;
}
