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
      {/* {questions.map((question, index) => {
        return (
          <div key={index}>
            <h1>{lessonTitle}</h1>
            <h2>{question.questionType}</h2>
            <p>{question.prompt}</p>
            <p>{question.snippet}</p>
            <div>
              {question.options.map((option, index) => {
                return <p key={index}>{option}</p>
              })}
            </div>
            <p>{question.answer}</p>
          </div>
        )
      })} */}
      {/* <button onClick={() => saveLessonToDatabase()}>Add Lesson</button> */}
    </>
  )
}

export default ReviewLesson
