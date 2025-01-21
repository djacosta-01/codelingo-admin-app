'use client'

import { createContext, useContext, useState } from 'react'
import {
  createNewQuestion,
  updateQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { PostgrestError } from '@supabase/supabase-js'

interface QuestionContextType {
  questionType: string
  setQuestionType: React.Dispatch<React.SetStateAction<string>>
  questionPrompt: string
  setQuestionPrompt: React.Dispatch<React.SetStateAction<string>>
  questionSnippet: string
  setQuestionSnippet: React.Dispatch<React.SetStateAction<string>>
  questionOptions: { [key: string]: string } | string[]
  setQuestionOptions: React.Dispatch<React.SetStateAction<{ [key: string]: string } | string[]>>
  correctAnswer: string
  setCorrectAnswer: React.Dispatch<React.SetStateAction<string>>
  topicsCovered: string[]
  setTopicsCovered: React.Dispatch<React.SetStateAction<string[]>>
  submitQuestion: ({
    lessonName,
    questionId,
  }: {
    lessonName?: string
    questionId?: number
  }) => Promise<{ success: boolean; error?: string | PostgrestError }>
}

const initialContext: QuestionContextType = {
  questionType: '',
  setQuestionType: () => {},
  questionPrompt: '',
  setQuestionPrompt: () => {},
  questionSnippet: '',
  setQuestionSnippet: () => {},
  questionOptions: {},
  setQuestionOptions: () => {},
  correctAnswer: '',
  setCorrectAnswer: () => {},
  topicsCovered: [],
  setTopicsCovered: () => {},
  submitQuestion: async () => ({ success: false, error: 'Not implemented' }),
}

const QuestionContext = createContext<QuestionContextType>(initialContext)

export const useQuestionContext = () => useContext(QuestionContext)

export const QuestionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionType, setQuestionType] = useState('')
  const [questionPrompt, setQuestionPrompt] = useState('')
  const [questionSnippet, setQuestionSnippet] = useState('')
  const [questionOptions, setQuestionOptions] = useState<{ [key: string]: string } | string[]>({})
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])

  const submitQuestion = async ({
    lessonName,
    questionId,
  }: {
    lessonName?: string
    questionId?: number
  }) => {
    if (lessonName) {
      return await createNewQuestion(lessonName!, {
        // if we're adding a new question, guaranteed to have lessonName
        questionType,
        prompt: questionPrompt,
        snippet: questionSnippet,
        topics: topicsCovered,
        answerOptions: Object.values(questionOptions),
        answer: correctAnswer,
      })
    }

    return await updateQuestion(questionId!, {
      questionType,
      prompt: questionPrompt,
      snippet: questionSnippet,
      topics: topicsCovered,
      answerOptions: Object.values(questionOptions),
      answer: correctAnswer,
    })
  }

  return (
    <QuestionContext.Provider
      value={{
        questionType,
        setQuestionType,
        questionPrompt,
        setQuestionPrompt,
        questionSnippet,
        setQuestionSnippet,
        questionOptions,
        setQuestionOptions,
        correctAnswer,
        setCorrectAnswer,
        topicsCovered,
        setTopicsCovered,
        submitQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}
