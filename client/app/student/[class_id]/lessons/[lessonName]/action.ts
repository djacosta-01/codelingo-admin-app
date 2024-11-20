'use server'
import { createClient } from '@/utils/supabase/server'

export const getLessonData = async (lesson_id: number) => {
  console.log('lesson_id', lesson_id)

  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user
  
  if (!user) {
    console.error('No user found')
    return []
  }

  const { data: lessonData, error: lessonDataError } = await supabase
    .from('lessons')
    .select('*')
    .eq('lesson_id', lesson_id)
    .single()

  if (lessonDataError) {
    console.error('Error fetching lesson data: ', lessonDataError)
    return []
  }

  const { data: questionIDs, error: questionIDsError } = await supabase
    .from('lesson_question_bank')
    .select('question_id')
    .eq('lesson_id', lesson_id)

  if (questionIDsError) {
    console.error('Error fetching question data: ', questionIDsError)
    return []
  }

  const { data: questionData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .in('question_id', questionIDs.map(question => question.question_id))


  if (questionsError) {
    console.error('Error fetching question data: ', questionsError)
    return []
  }

  console.log('questionData', questionData)
  return questionData
}