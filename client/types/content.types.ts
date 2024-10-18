export type Lesson = {
  lesson_id?: number
  is_draft: boolean | null
  name: string | null
  topics: string[] | null
}

export type Question = {
  questionId?: number
  questionType: string
  prompt: string
  snippet: string
  topics: string[]
  answerOptions: string[]
  answer: string
}
