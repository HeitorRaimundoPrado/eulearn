import Question from './Question';

export default interface Test {
  id: number;
  title: string;
  author?: number;
  route?: string;
  created_at?: string;
  subject: number;
  questions: Question[];
}
