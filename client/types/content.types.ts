export type Lesson = {
  lesson_id?: number
  name: string
  topics: string[]
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
