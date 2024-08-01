import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'

import { Box, Paper, Fab, Chip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient/supabaseClient'
import AddIcon from '@mui/icons-material/Add'
import DraftLessonIcon from '@mui/icons-material/EditNote'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

const LessonDivider = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}))

const Lessons = () => {
  const location = useLocation()
  const queryParameters = new URLSearchParams(location.search)
  const className = queryParameters.get('class')
  // console.log(className)
  const [loadingMessage, setLoadingMessage] = useState('Loading Lessons...')
  const [lessons, setLessons] = useState({
    completed: [],
    drafts: [],
  })
  const navigate = useNavigate()

  // fetching lessons from supabase
  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase.from('lessons').select('lesson_name, is_draft')
      if (error) {
        setLoadingMessage('No lessons found')
        return
      }
      if (data.length === 0) {
        console.log('No lessons found')
        return
      }
      data.map(lesson => {
        setLessons(prev => ({
          ...prev,
          completed: lesson.is_draft
            ? prev.completed
            : Array.from(new Set([...prev.completed, lesson.lesson_name])),
          drafts: lesson.is_draft
            ? Array.from(new Set([...prev.drafts, lesson.lesson_name]))
            : prev.drafts,
        }))
      })
    }
    fetchLessons()
  }, [])

  const navigateToLessonPage = query => {
    navigate(`/lesson?class=${className}&lesson=${query}`)
  }

  const CompletedLessons = () => {
    return (
      <Box id="completed-lessons" sx={{ display: 'flex', justifyContent: 'center' }}>
        {lessons.completed.map((lesson, index) => {
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
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                  transition: 'all',
                  transitionDuration: '0.3s',
                },
              }}
              onClick={() => navigateToLessonPage(lesson)}
            >
              {lesson}
            </Paper>
          )
        })}
      </Box>
    )
  }

  const DraftLessons = () => {
    return (
      <Box
        id="draft-lessons"
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {lessons.drafts.map((lesson, index) => {
          return (
            <Paper
              key={index}
              elevation={4}
              sx={{
                backgroundColor: '#EAECE9',
                width: '25ch',
                height: '20ch',
                margin: 5,
                padding: 1,
                outline: '1px solid black',
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                  transition: 'all',
                  transitionDuration: '0.3s',
                },
              }}
              onClick={() => navigateToLessonPage(lesson)}
            >
              {lesson}
            </Paper>
          )
        })}
      </Box>
    )
  }
  return (
    <>
      <NavbarWithSideMenu displaySideMenu={true} className={className} />
      {lessons.completed.length === 0 ? (
        <h1>{loadingMessage}</h1>
      ) : (
        <Box
          sx={{
            marginTop: '64px',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <CompletedLessons />
          <Divider>
            <Chip icon={<DraftLessonIcon />} label="Drafts" />
          </Divider>
          <DraftLessons />
        </Box>
      )}
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
