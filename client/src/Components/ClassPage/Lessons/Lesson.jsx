import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { supabase } from '../../../supabaseClient/supabaseClient'

const Lesson = () => {
  const [lessonContent, setLessonContent] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('Loading Content...')
  // can either have useEffect hook to fetch lessons or pass lessons as props
  const location = useLocation()
  const queryParameters = new URLSearchParams(location.search)
  const lessonName = queryParameters.get('lesson')
  // console.log(lessonName)

  useEffect(() => {
    // fetching lesson content from supabase
    const fetchLessonContent = async () => {
      const response = await supabase
        .from('lessons')
        .select('questions')
        .eq('lesson_name', lessonName)
      const data = await response.data
      if (data.length === 0) {
        setLoadingMessage('Lesson Not Found')
        return
      }
      setLessonContent(data[0].questions)
    }
    fetchLessonContent()
  }, [lessonName])

  // console.log('lesson content')
  // console.log(lessonContent)
  return (
    <>
      <NavbarWithSideMenu displaySideMenu={true} />
      <Box
        id="lesson-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          // backgroundColor: '#EAECE9',
          height: '100vh',
          padding: 7,
        }}
      >
        {!lessonContent ? (
          <h1>{loadingMessage}</h1>
        ) : (
          <>
            <h1>{lessonName}</h1>
            {lessonContent.map((question, index) => {
              return (
                <div key={index}>
                  <h3>
                    {question.questionType}: {question.prompt}
                  </h3>
                  <h3>{question.snippet}</h3>
                  {question.options.map((option, index) => {
                    return <div key={index}>{option}</div>
                  })}
                  <h3>Answer: ({question.answer})</h3>
                </div>
              )
            })}
          </>
        )}
      </Box>
    </>
  )
}

export default Lesson
