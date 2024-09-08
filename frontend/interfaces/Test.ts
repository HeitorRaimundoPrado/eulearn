import Question from './Question';

export default interface Test {
  id: number;
  title: string;
  author?: number;
  created_at?: string;
  subject: number;
  questions: Question[];
}
