import React from 'react'
import { Box, Paper, Fab } from '@mui/material'
import { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient/supabaseClient'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

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
      const data = response.data
      setLessons(data)
    }
    fetchLessons()
  }, [])

  const navigateToLessonPage = query => {
    navigate(`/lesson?class=${className}&lesson=${query}`)
  }

  // console.log('lessons')
  // console.log(lessons)

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={true} className={className} />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          // backgroundColor: '#EAECE9',
          alignItems: 'flex-start',
          padding: 7,
        }}
      >
        {!lessons ? (
          <h1>Loading Lessons...</h1>
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
                  outline: '1px solid black',
                  '&:hover': {
                    backgroundColor: '#EAECE9',
                    cursor: 'pointer',

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
      <Box
        id="add-lesson-button"
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 20,
        }}
      >
        <Fab
          color="white"
          onClick={() => navigate('/add-lessons')}
          sx={{
            backgroundColor: 'white',

            color: '#2688FF',
            '&:hover': {
              outline: '1px solid black',
              backgroundColor: '#EAECE9',
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </>
  )
}

export default Lessons
