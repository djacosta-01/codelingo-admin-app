'use server'
import { createClient } from '@/utils/supabase/server'

export const getClassData = async () => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  const {data:enrollments, error: enrollmentError} = await supabase.from('enrollments').select('class_id').eq('student_id', user.id)

  if (enrollmentError) {
    console.error('Error fetching class IDs: ', enrollmentError)
    return []
  }

  const enrolledClassIds = enrollments.map(enrollment => enrollment.class_id)
  if (enrolledClassIds.length === 0){
    return []
  }

  const { data: userClasses, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .in('class_id', enrolledClassIds)

  if (classesError) {
    console.error('Error fetching classes: ', classesError)
    return []
  }

  return userClasses
}

