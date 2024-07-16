import React from 'react'
import SideMenu from '../SideMenu/SideMenu'
import { Box, Paper, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient/supabaseClient'

// using mock data for now
// TODO: fetch lessons from the server
const mockLessons = [
  {
    title: 'Lesson 1',
    description: 'This is the first lesson',
    id: 1,
  },
  {
    title: 'Lesson 2',
    description: 'This is the second lesson',
    id: 2,
  },
  {
    title: 'Lesson 3',
    description: 'This is the third lesson',
    id: 3,
  },
]

const Lessons = () => {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState(null)

  useEffect(() => {
    const fetchLessons = async () => {
      const response = await supabase.from('classes').select('lessons')
      const data = await response.data
      setLessons(data)
    }
    fetchLessons()
  }, [])

  // console.log(lessons)

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
                onClick={() => navigate('/lesson')}
              >
                {lesson.lessons[index].lesson_name}
              </Paper>
            )
          })
        )}
        {/* {mockLessons.map((lesson, index) => {
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
              onClick={() => navigate('/lesson')}
            >
              {lesson.title}
            </Paper>
          )
        })} */}
      </Box>
    </>
  )
}

export default Lessons
