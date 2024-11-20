'use server'
import { createClient } from '@/utils/supabase/server'
import { getClassData } from '@/app/student/actions'

export interface Lesson {
  is_draft: boolean | null
  lesson_id: number
  name: string | null
  topics: string[] | null
}

// const classes = await getClassData()
// console.log('WHAT IS THIS', classes[0].class_id)

export const getLessonData = async (class_id: number): Promise<Lesson[]> => {
  console.log('Getting lesson data for class:', class_id)
  console.log('class_id', typeof class_id)
  // if(!className) {
  //   console.error('No class ID found')
  //   return []
  // }
  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user
  
  if (!user) {
    console.error('No user found')
    return []
  }
  // console.log('user', user)

  const { data: enrollments, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', user.id)
    .eq('class_id', class_id)
    .single()

  if (enrollmentError) {
    console.error('Error verifying enrollment:', enrollmentError)
    return []
  }

  // This return no data :(
  const {data: classLessons, error: lessonsIdError} = await supabase
    .from('class_lesson_bank')
    .select('lesson_id')
    .eq('class_id', class_id)

  // console.log('classLessons', classLessons)
  if (lessonsIdError) {
    console.error('Error fetching lesson IDs:', lessonsIdError)
    return []
  }

  if (!classLessons || classLessons.length === 0) {
    return []
  }

  const { data: lessonData, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .in(
      'lesson_id',
      classLessons.map((lesson) => lesson.lesson_id)
    )

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
    return []
  }

  // console.log("What is", lessonData)

return lessonData
}

