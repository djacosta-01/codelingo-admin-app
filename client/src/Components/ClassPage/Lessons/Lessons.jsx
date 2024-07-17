import React from 'react'
import SideMenu from '../SideMenu/SideMenu'
import { Box, Paper, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient/supabaseClient'

const Lessons = () => {
  const location = useLocation()
  const queryParameters = new URLSearchParams(location.search)
  const className = queryParameters.get('class')
  // console.log(className)
  const navigate = useNavigate()
  const [lessons, setLessons] = useState(null)

  // fetching lessons from supabase
  useEffect(() => {
    const fetchLessons = async () => {
      const response = await supabase.from('lessons').select('lesson_name')
      const data = await response.data
      setLessons(data)
    }
    fetchLessons()
  }, [])

  const navigateToLessonPage = query => {
    // const lessonName = query.toLowerCase().replace(' ', '-')
    const lessonName = query.trim().toLowerCase().replace(/\s+/g, '-')
    navigate(`/lesson?class=${className}&lesson=${lessonName}`)
  }
  console.log(lessons)

  return (
    <>
      <SideMenu page="Lessons" />
      <Box
        id="lessons-container"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: '#EAECE9',
          height: '100vh',
          padding: 7,
        }}
      >
        {!lessons ? (
          <div>Loading...</div>
        ) : (
          lessons.map((lesson, index) => {
            return (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  width: '25ch',
                  height: '20ch',
                  margin: 5,
                  padding: 1,

                  '&:hover': {
                    backgroundColor: '#EAECE9',
                    cursor: 'pointer',
                    outline: '1px solid black',
                    transform: 'scale(1.05)',
                    transition: 'all',
                    transitionDuration: '0.3s',
                  },
                }}
                onClick={() => navigateToLessonPage(lesson.lesson_name)}
              >
                {lesson.lesson_name}
              </Paper>
            )
          })
        )}
      </Box>
    </>
  )
}

export default Lessons
