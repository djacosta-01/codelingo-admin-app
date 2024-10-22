'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/classes')
}

export async function signup(formData: FormData) {
  /**
   * Currently only students can sign up. Need to add a way to differentiate between
   * professor and student sign ups
   */
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // using student email for now for testing purposes
  if (!data.email.includes('@lion.lmu.edu')) {
    return { error: 'Invalid email. Please use your LMU email.' }
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
      },
    },
  })

  if (error) {
    console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/classes')
}
