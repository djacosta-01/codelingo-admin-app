'use server'

import { Question } from '@/types/content.types'
import { createClient } from '@/utils/supabase/server'

export const getLessonQuestions = async (
  className: string,
  lessonName: string
): Promise<
  {
    question_id: number
    prompt: string | null
    snippet: string | null
    topics: string[] | null
    answer_options: string[] | null
    answer: string | null
  }[]
> => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  // TODO: like it was stated in other functions, make a class_slug column so we don't have to clean the class name
  // SAME goes for the lesson name
  const cleanedClassName = className.replace(/%20/g, ' ')
  const cleanedLessonName = lessonName.replace(/%20/g, ' ')

  const { data: lessonID, error: lessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', cleanedLessonName)
    .single()

  if (lessonIDError) {
    console.error('Error fetching lesson ID: ', lessonIDError)
    return []
  }

  const { data: questionIDs, error: questionIDsError } = await supabase
    .from('lesson_question_bank')
    .select('question_id')
    .eq('lesson_id', lessonID.lesson_id)

  if (questionIDsError) {
    console.error('Error fetching question IDs: ', questionIDsError)
    return []
  }

  const { data: questionData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .in(
      'question_id',
      questionIDs.map(question => question.question_id)
    )

  if (questionsError) {
    console.error('Error fetching questions: ', questionsError)
    return []
  }

  return questionData
}

export async function insertQuestion(
  lessonName: string,
  { questionType, prompt, snippet, topics, answerOptions, answer }: Question
) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  // adding to questions table for now
  const { error } = await supabase.from('questions').insert({
    question_type: questionType,
    prompt,
    snippet,
    topics,
    answer_options: answerOptions,
    answer,
  })

  if (error) {
    console.error('Error inserting question data: ', error)
    return { success: false, error }
  }

  // getting the question id of the question we just inserted
  const { data: questionIDs, error: questionIDError } = await supabase
    .from('questions')
    .select('question_id')

  if (questionIDError) {
    console.error('Error fetching question ID: ', questionIDError)
    return { success: false, error: questionIDError }
  }

  // theoretically, the largest question id should be the one we just inserted
  const questionID = questionIDs.map(id => id.question_id).sort((a, b) => b - a)[0]

  // getting the lesson id of the lesson we want to add the question to
  const cleanedLessonName = lessonName.replace(/%20/g, ' ')
  const { data: lessonID, error: lessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', cleanedLessonName)
    .single()

  if (lessonIDError) {
    console.error('Error fetching question or lesson ID: ', lessonIDError)
    return { success: false, error: lessonIDError }
  }

  // adding to lesson_question_bank table
  const { error: lessonQuestionBankError } = await supabase.from('lesson_question_bank').insert({
    lesson_id: lessonID.lesson_id,
    owner_id: user.id,
    question_id: questionID,
  })

  if (lessonQuestionBankError) {
    console.error('Error inserting into lesson_question_bank: ', lessonQuestionBankError)
    return { success: false, error: lessonQuestionBankError }
  }

  return { success: true }
}

export async function updateQuestion(
  id: number,
  { questionType, prompt, snippet, topics, answerOptions, answer }: Question
) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase
    .from('questions')
    .update({
      question_type: questionType,
      prompt,
      snippet,
      topics,
      answer_options: answerOptions,
      answer,
    })
    .eq('question_id', id)

  if (error) {
    console.error('Error updating question data: ', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function deleteQuestion(id: number) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase.from('questions').delete().eq('question_id', id)

  if (error) {
    console.error('Error deleting question: ', error)
    return { success: false, error }
  }

  return { success: true }
}
