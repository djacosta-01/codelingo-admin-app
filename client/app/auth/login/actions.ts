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

  // const isProfessor = data.email.trim().endsWith('@lmu.edu') || developmentAccount
  const isProfessor = data.email.trim().endsWith('@lmu.edu') || developmentAccount

  revalidatePath('/', 'layout')

  // if (isProfessor) redirect('/classes')
  if (developmentAccount) return { message: 'hi, you logged in from the api! 😊', error: false }
  // else return { message: 'hi, you logged in from the api! 😊', error: false }
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

  const isProfessorEmail = data.email.trim().endsWith('@lmu.edu')
  // const isStudentEmail = data.email.trim().endsWith('@lion.lmu.edu')

  if (!isProfessorEmail) {
    console.error('Invalid email')
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
    return { error: `Error signing up: ${error.message}` }
  }

  const { data: userData, error: userFetchError } = await supabase.auth.getUser()
  if (userFetchError) {
    console.error(userFetchError)
    return { error: `Error signing up: ${userFetchError.message}` }
  }

  const userID = userData.user.id

  console.log('------------> calling rpc function')
  const { data: profInsert, error: profInsertError } = await supabase.rpc(
    'insert_user_into_respective_table',
    { user_type: 'professor', user_id: userID }
  )

  if (profInsertError) {
    console.error(profInsertError)
    return { error: `Error signing up: ${profInsertError.message}` }
  }

  console.log('-----------------> should be a boolean:', profInsert)

  // const { data, error } = await supabase.rpc('echo', { say: '👋' })

  // const { data: userData, error: userFetchError } = await supabase.auth.getUser()

  // if (userFetchError) {
  //   console.error(userFetchError)
  //   return { error: `Error signing up: ${userFetchError.message}` }
  // }

  // const userID = userData.user.id

  // TODO: DONT FORGET TO DELETE THIS
  // add users to the appropriate table
  // const { error: insertError } = isProfessorEmail
  //   ? await supabase.from('professors').insert([{ professor_id: userID }])
  //   : await supabase.from('students').insert([{ student_id: userID }])

  // if (insertError) {
  //   console.error(insertError)
  //   return { error: `Error signing up: ${insertError.message}` }
  // }

  revalidatePath('/', 'layout')
  isProfessorEmail ? redirect('/classes') : redirect('/student')
}
