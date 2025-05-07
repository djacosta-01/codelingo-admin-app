'use client'

import { createContext, useContext, useState } from 'react'
import {
  createNewQuestion,
  updateQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { Question } from '@/types/content.types'
import { PostgrestError } from '@supabase/supabase-js'

interface QuestionContextType {
  questionID: number | null
  setQuestionID: React.Dispatch<React.SetStateAction<number | null>>
  questionType: string
  setQuestionType: React.Dispatch<React.SetStateAction<string>>
  questionPrompt: string
  setQuestionPrompt: React.Dispatch<React.SetStateAction<string>>
  questionSnippet: string
  setQuestionSnippet: React.Dispatch<React.SetStateAction<string>>
  questionOptions: any[]
  setQuestionOptions: React.Dispatch<React.SetStateAction<any[]>>
  correctAnswer: string
  setCorrectAnswer: React.Dispatch<React.SetStateAction<string>>
  topicsCovered: string[]
  setTopicsCovered: React.Dispatch<React.SetStateAction<string[]>>
  submitQuestion: ({
    lessonName,
    questionID,
  }: {
    className: string
    lessonName?: string
    questionID?: number
  }) => Promise<{ success: boolean; error?: string | PostgrestError }>
  resetStates: () => void
}

const initialContext: QuestionContextType = {
  questionID: null,
  setQuestionID: () => {},
  questionType: '',
  setQuestionType: () => {},
  questionPrompt: '',
  setQuestionPrompt: () => {},
  questionSnippet: '',
  setQuestionSnippet: () => {},
  questionOptions: [],
  setQuestionOptions: () => [],
  correctAnswer: '',
  setCorrectAnswer: () => {},
  topicsCovered: [],
  setTopicsCovered: () => {},
  submitQuestion: async () => ({ success: false, error: 'Not implemented' }),
  resetStates: () => {},
}

const QuestionContext = createContext<QuestionContextType>(initialContext)

export const useQuestionContext = () => useContext(QuestionContext)

export const QuestionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [questionID, setQuestionID] = useState<number | null>(null)
  const [questionType, setQuestionType] = useState('')
  const [questionPrompt, setQuestionPrompt] = useState('')
  const [questionSnippet, setQuestionSnippet] = useState('')
  const [questionOptions, setQuestionOptions] = useState<any>([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])

  const resetStates = () => {
    setQuestionID(null)
    setQuestionType('')
    setQuestionPrompt('')
    setQuestionSnippet('')
    setQuestionOptions([])
    setCorrectAnswer('')
    setTopicsCovered([])
  }

  const submitQuestion = async ({
    className, 
    lessonName,
    questionID,
  }: {
    className?: string
    lessonName?: string
    questionID?: number
  }) => {
    if (lessonName) {
      return await createNewQuestion(lessonName!, className, {
        questionType,
        prompt: questionPrompt,
        snippet: questionSnippet,
        topics: topicsCovered,
        answerOptions: questionOptions,
        answer: correctAnswer,
      })
    }

    alert('Update functionality is being reworked. It will be back soon!')
    return {
      success: false,
      error: 'Update functionality is being reworked. It will be back soon!',
    }
    // return await updateQuestion(questionID!, {
    //   questionType,
    //   prompt: questionPrompt,
    //   snippet: questionSnippet,
    //   topics: topicsCovered,
    //   answerOptions: questionOptions,
    //   answer: correctAnswer,
    // })
  }

  return (
    <QuestionContext.Provider
      value={{
        questionID,
        setQuestionID,
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
        resetStates,
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}
