'use client'
import { Box, Paper, Typography } from '@mui/material'
import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import { getLessonData } from '@/app/classes/[className]/lessons/actions'
import { useState, useEffect } from 'react'

const Lessons = ({ params }: { params: { className: string } }) => {
  const [lessons, setLessons] = useState<(string | null)[]>([]) // only getting lesson names for now

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessonData(params.className)
      setLessons(data)
    }
    fetchLessons()
  }, [])

  return (
    <>
      <NavbarWithSideMenu
        className={params.className}
        displaySideMenu={true}
        currentPage="Lessons"
      />
      <Box
        id="lesson-container"
        sx={{
          marginTop: '64px',
          marginLeft: '65px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexGrow: 1,
          minHeight: '90vh',
          flexWrap: 'wrap',
        }}
      >
        {/* Only displaying lesson names for now. In future, will display lesson data through a table */}
        {lessons.map((lessonName, index) => (
          <Paper
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '15em',
              height: '10em',
              margin: 5,
              padding: 1,
              outline: '1px solid black',
              transition: 'ease-in-out 0.2s',
              '&:hover': {
                cursor: 'pointer',
                transform: 'scale(1.05)',
                textDecoration: 'underline',
              },
            }}
          >
            <Typography>{lessonName}</Typography>
          </Paper>
        ))}
      </Box>
    </>
  )
}

export default Lessons
