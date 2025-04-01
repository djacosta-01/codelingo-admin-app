'use server'

import { createClient } from '@/utils/supabase/server'

export const deleteClass = async (className: string) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase.from('classes').delete().eq('name', className)

  if (error) {
    console.error('Error deleting class: ', error)
    return { success: false, error }
  }

  return { success: true }
}
