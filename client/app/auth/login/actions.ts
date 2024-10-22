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

  // using student email for now for testing
  const validEmail = data.email.includes('@lion.lmu.edu') // || data.email.includes('@lmu.edu')

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/classes')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  console.log('signup')
  console.log(formData)
  const data = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log(data)
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
