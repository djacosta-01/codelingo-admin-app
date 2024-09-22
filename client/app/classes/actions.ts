'use server'

import { createClient } from '@/utils/supabase/server'

export const getClassData = async (): Promise<any> => {
  // returning any for now
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data?.user

  //   console.log('userResponse')
  //   console.log(userResponse)
  //   console.log('user')
  //   console.log(user)

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from('professor_courses').select('class_id')
  if (error) {
    console.error('Error fetching class IDs: ', error)
    return null
  }

  console.log(data)
  const classIDs = data.map(classData => classData.class_id)
  const { data: userClasses, error: classesError } = await supabase
    .from('classes')
    .select('name')
    .in('class_id', classIDs)
  if (classesError) {
    console.error('Error fetching classes: ', classesError)
    return null
  }
  //   console.log(classIDs)
  //   console.log(userClasses)
  return userClasses.map((className: { name: string | null }) => className.name)
}
