import Test from './Test'

export default interface Question {
  tests: Test[]
  statement?: string,
  statement_img_url?: string,
  author: number,
  explanation: string,
  community: number,
  created_at: Date
  subject: number,
  answered_by: number[],
  theme: string
}
