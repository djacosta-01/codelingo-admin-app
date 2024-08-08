import { supabase } from '../../../../../supabaseClient/supabaseClient'

const ReviewLesson = ({ lessonTitle, questions }) => {
  const saveLessonToDatabase = async () => {
    const { error } = await supabase.from('lessons').insert({ lesson_name: lessonTitle, questions })
    if (error) alert('Error saving lesson')
    else alert('Lesson saved')
    console.log('saving lesson')
  }

  return (
    <>
      <h1>Review Lesson Under Construction...</h1>
      <h2>{lessonTitle}</h2>
    </>
  )
}

export default ReviewLesson
