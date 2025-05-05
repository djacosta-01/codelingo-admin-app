'use server'

import { createClient } from '@/utils/supabase/server'

export const createClassCode = async (className: string) => {
  // TODO: check if class code for this class already exists
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { data, error } = await supabase.from('classes').select('class_id').eq('name', className)

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error }
  }

  const { data: classCodeData, error: classCodeError } = await supabase
    .from('class_codes')
    .select('class_code')
    .eq('class_id', data[0].class_id)
    .single()

  if (!classCodeError && classCodeData) {
    // class code already exists
    return { success: true, code: classCodeData.class_code }
  }
  // create a 6 character code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  console.log('Code: ', code)

  const { error: insertError } = await supabase.from('class_codes').insert({
    class_id: data[0].class_id,
    class_code: code,
    // expire in 1 hour
    expires_at: expiresAt,
  })

  if (insertError) {
    console.error('Error inserting class code: ', insertError)
    return { success: false, error: insertError }
  }

  return { success: true, code, expiresAt }
}

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
