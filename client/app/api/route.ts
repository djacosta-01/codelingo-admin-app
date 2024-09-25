import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
// import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = createClient()

  // THIS IS TEMPORARY AND FOR TESTING PURPOSES ONLY
  // signing in dummy student user to return fake data

  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.NEXT_PUBLIC_TEST_EMAIL_STUDENT!,
    password: process.env.NEXT_PUBLIC_TEST_PASSWORD_STUDENT!,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // fetching the class IDs of the classes the student is enrolled in
  const { data: enrolledClassIDs, error: enrolledClassesIDsError } = await supabase
    .from('enrollments')
    .select('class_id')

  if (enrolledClassesIDsError) {
    return NextResponse.json({ error: enrolledClassesIDsError.message }, { status: 500 })
  }

  // fetching the details of the classes the student is enrolled in
  const enrolledClassesIDsArray = enrolledClassIDs.map(enrollment => enrollment.class_id)
  const { data: enrolledClassDetails, error: enrolledClassDetailsError } = await supabase
    .from('classes')
    .select('name, section_number, description')
    .in('class_id', enrolledClassesIDsArray)

  if (enrolledClassDetailsError) {
    console.log('error fetching enrolled class details')
    return NextResponse.json({ error: enrolledClassDetailsError.message }, { status: 500 })
  }

  // signing out dummy student user
  await supabase.auth.signOut()

  return { enrolledClassDetails }
}
