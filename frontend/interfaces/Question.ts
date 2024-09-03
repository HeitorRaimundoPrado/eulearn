import Test from './Test'
import Answer from './Answer'

export default interface Question {
  id: number;
  tests: Test[];
  statement?: string;
  statement_img_url?: string;
  author: number;
  explanation: string;
  community: number;
  created_at: Date
  subject: number;
  answered_by: number[];
  answers: Answer[];
  theme: string;
}
