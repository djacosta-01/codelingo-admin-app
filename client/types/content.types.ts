export type Lesson = {
  lesson_id?: number
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
