'use server'

import { createClient } from '@/utils/supabase/server'

export const getLessonData = async (className: string): Promise<(string | null)[]> => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  // TODO: probably should make a class_slug column in the classes table and filter by that
  const cleanedClassName = className.replace(/%20/g, ' ')
  const { data: classID, error: classError } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)
    .single()

  if (classError) {
    console.error('Error fetching class ID: ', classError)
    return []
  }

  const { data: lessonIDs, error: lessonIDsError } = await supabase
    .from('class_lesson_bank')
    .select('lesson_id')
    .eq('class_id', classID.class_id)

  if (lessonIDsError) {
    console.error('Error fetching lesson IDs: ', lessonIDsError)
    return []
  }

  const { data: lessonData, error: lessonsError } = await supabase // chnage to select certain columns later
    .from('lessons')
    .select('*')
    .in(
      'lesson_id',
      lessonIDs.map(lesson => lesson.lesson_id)
    )

  if (lessonsError) {
    console.error('Error fetching lessons: ', lessonsError)
    return []
  }

  return lessonData.map((lesson: { name: string | null }) => lesson.name)
}
