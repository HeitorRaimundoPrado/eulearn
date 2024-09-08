export default interface Answer {
  id: number,
  is_correct: boolean,
  content: string
}

export interface AnswerCreate {
  is_correct: boolean,
  content: string
}
