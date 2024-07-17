import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient/supabaseClient'

const Lesson = () => {
  const [lessonContent, setLessonContent] = useState(null)
  // can either have useEffect hook to fetch lessons or pass lessons as props
  const location = useLocation()
  const queryParameters = new URLSearchParams(location.search)
  const lessonName = queryParameters.get('lesson')
  // console.log(lessonName)

  useEffect(() => {
    // fetching lesson content from supabase
    const fetchLessonContent = async () => {
      const response = await supabase.from('lessons').select('questions')
      const data = await response.data
      // hardcoding for now
      setLessonContent(data[0].questions.lesson_questions)
    }
    fetchLessonContent()
  }, [])
  return (
    <Box id="lesson-container">
      {!lessonContent ? (
        <h1>Loading Lesson...</h1>
      ) : (
        lessonContent.map((question, index) => {
          return (
            <div key={index}>
              <h3>
                {question.questionType}: {question.prompt}
              </h3>
              <h3>{question.snippet}</h3>
              {question.options.map((option, index) => {
                return <div key={index}>{option}</div>
              })}
              <h3>{question.answer}</h3>
            </div>
          )
        })
      )}
    </Box>
  )
}

export default Lesson
