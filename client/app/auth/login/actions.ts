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
    return { error: 'Invalid email or password' }
  }

  // TODO: DONT FORGET TO REMOVE THIS ONCE THE APP IS READY FOR PRODUCTION
  const developmentAccount = data.email.trim() === process.env.NEXT_DEVELOPMENT_ACCOUNT!

  const isProfessor = data.email.trim().endsWith('@lmu.edu') || developmentAccount

  revalidatePath('/', 'layout')

  isProfessor ? redirect('/classes') : redirect('/student')
  // redirect('/classes')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // using student email for now for testing purposes
  if (!data.email.trim().endsWith('@lion.lmu.edu')) {
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
