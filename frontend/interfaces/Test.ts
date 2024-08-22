import Question from './Question';

export default interface Test {
  title: string,
  author: number?,
  route: string?,
  created_at: string?,
  subject: number,
  questions: Question[]
}
