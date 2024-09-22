'use server'

import { createClient } from '@/utils/supabase/server'

export const getClassData = async (): Promise<(string | null)[]> => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  const { data, error } = await supabase.from('professor_courses').select('class_id')

  if (error) {
    console.error('Error fetching class IDs: ', error)
    return []
  }

  const classIDs = data.map(classData => classData.class_id)
  const { data: userClasses, error: classesError } = await supabase
    .from('classes')
    .select('name')
    .in('class_id', classIDs)

  if (classesError) {
    console.error('Error fetching classes: ', classesError)
    return []
  }

  return userClasses.map((className: { name: string | null }) => className.name)
}
