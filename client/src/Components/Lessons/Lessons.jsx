import { useState, useEffect } from 'react'
import { Box, Paper, Fab, Divider, Chip } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient/supabaseClient'
import AddIcon from '@mui/icons-material/Add'
import DraftLessonIcon from '@mui/icons-material/EditNote'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

const CompletedLessons = ({ className, completed, navigateTo }) => {
  const baseUrl = `/classes/${className}/lessons/lesson`
  return (
    <Box
      id="completed-lessons"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {completed.length === 0 ? (
        <h1>Loading Lessons...</h1>
      ) : (
        completed.map((lesson, index) => (
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
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
            onClick={() => navigateTo(`${baseUrl}/${lesson}`)}
          >
            {lesson}
          </Paper>
        ))
      )}
    </Box>
  )
}

const DraftLessons = ({ className, drafts, navigateTo }) => {
  return (
    <Box
      id="draft-lessons"
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {drafts.map((lesson, index) => (
        <Paper
          key={index}
          elevation={4}
          sx={{
            backgroundColor: '#EAECE9',
            width: '25ch',
            height: '20ch',
            margin: 5,
            padding: 1,
            outline: '2px dashed red',
            '&:hover': {
              cursor: 'pointer',
              transform: 'scale(1.05)',
              transition: 'all',
              transitionDuration: '0.3s',
              fontWeight: 'bold',
              textDecoration: 'underline',
            },
          }}
          onClick={() => navigateTo(`/classes/${className}/add-lessons/${lesson}`)}
        >
          {lesson}
        </Paper>
      ))}
    </Box>
  )
}

const Lessons = () => {
  const navigate = useNavigate()
  const { className } = useParams()
  const [lessons, setLessons] = useState({
    completed: [],
    drafts: [],
  })

  // fetching lessons from supabase
  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase.from('lessons').select('lesson_name, is_draft')
      if (error) {
        console.error('Error fetching lessons: ', error)
        return
      }
      if (data.length === 0) {
        return
      }
      data.map(lesson =>
        setLessons(prev => ({
          ...prev,
          completed: lesson.is_draft
            ? prev.completed
            : Array.from(new Set([...prev.completed, lesson.lesson_name])),
          drafts: lesson.is_draft
            ? Array.from(new Set([...prev.drafts, lesson.lesson_name]))
            : prev.drafts,
        }))
      )
    }
    fetchLessons()
  }, [])

  return (
    <>
      <NavbarWithSideMenu className={className} displaySideMenu={true} currentPage={'Lessons'} />
      <Box
        sx={{
          marginTop: '64px',
          marginLeft: '65px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          minHeight: '90vh',
        }}
      >
        <CompletedLessons
          className={className}
          completed={lessons.completed}
          navigateTo={navigate}
        />
        {lessons.drafts.length === 0 ? (
          // To keep the number of children constant
          // sorry for the hacky solution :/
          <Box sx={{ display: 'flex', flex: 1 }} />
        ) : (
          <>
            <Divider>
              <Chip icon={<DraftLessonIcon />} label="Drafts" />
            </Divider>
            <DraftLessons className={className} drafts={lessons.drafts} navigateTo={navigate} />
          </>
        )}
      </Box>
      <Box
        id="add-lesson-button"
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
        }}
      >
        <Fab
          color="white"
          onClick={() => navigate(`/classes/${className}/add-lessons`)}
          sx={{
            backgroundColor: 'white',
            color: '#2688FF',
            '&:hover': {
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
