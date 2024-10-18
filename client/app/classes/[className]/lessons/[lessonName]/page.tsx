'use client'

import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import { Box, IconButton, Tooltip, Typography, Alert, Fade } from '@mui/material'
import { AddCircleOutline, Close } from '@mui/icons-material'
import { useState } from 'react'
import { Question } from '@/types/content.types'
import QuestionDataGrid from '@/app/classes/[className]/lessons/[lessonName]/question-data-grid'
import AddQuestionDialog from '@/app/classes/[className]/lessons/[lessonName]/add-question-dialog'

const Lesson = ({
  params,
}: {
  params: {
    className: string
    lessonName: string
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [prevQuestionData, setPrevQuestionData] = useState<Question | null>(null)

  const handleDialogOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <NavbarWithSideMenu className={params.className} displaySideMenu currentPage="Lessons" />
      <Box
        id="lesson-details-container"
        sx={{
          marginTop: '64px',
          marginLeft: '65px',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          width: 'calc(100vw - 65px)',
        }}
      >
        <Box id="lesson-name" sx={{ paddingLeft: 3 }}>
          <h1>{params.lessonName.replace(/%20/g, ' ')}</h1>
        </Box>
        <Box
          sx={{
            paddingLeft: 5,
            paddingBottom: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="h5">Questions</Typography>
          <Tooltip title="Add Question">
            <IconButton onClick={handleDialogOpen}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>
        <Fade in={alertOpen}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false)
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            Question added successfully
          </Alert>
        </Fade>
        <QuestionDataGrid
          params={{ className: params.className, lessonName: params.lessonName }}
          setPrevQuestionData={setPrevQuestionData}
          setOpen={setOpen}
        />
        <AddQuestionDialog
          lessonName={params.lessonName}
          open={open}
          setOpen={setOpen}
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          prevQuestionData={prevQuestionData}
          resetPrevData={setPrevQuestionData}
        />
      </Box>
    </>
  )
}

export default Lesson
