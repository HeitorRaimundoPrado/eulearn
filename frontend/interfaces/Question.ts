export default interface Question {
  id: number;
  statement: string;
  statement_img_url: string;
  author: number;
  explanation?: string;
  community: number;
  created_at: Date;
  subject: number;
  answered_by: number[];
  theme: string;
}
