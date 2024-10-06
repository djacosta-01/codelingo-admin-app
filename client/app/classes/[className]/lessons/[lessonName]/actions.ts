'use server'

import { createClient } from '@/utils/supabase/server'

export const getLessonQuestions = async (
  className: string,
  lessonName: string
): Promise<
  {
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
    .select('prompt, snippet, topics, answer_options, answer')
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

export async function insertQuestion({
  questionType,
  prompt,
  snippet,
  topics,
  answer_options,
  answer,
}: {
  questionType: string
  prompt: string
  snippet: string
  topics: string[]
  answer_options: string[]
  answer: string
}) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase.from('questions').insert({
    question_type: questionType,
    prompt,
    snippet,
    topics,
    answer_options,
    answer,
  })

  if (error) {
    console.error('Error inserting question data: ', error)
    return { success: false, error }
  }

  return { success: true }
}
