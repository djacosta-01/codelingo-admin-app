'use client'

import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'
// import { getLessonQuestionData } from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { useState } from 'react'

// TEST
import QuestionDataGrid from '@/app/classes/[className]/lessons/[lessonName]/question-data-grid'

// const columns: GridColDef[] = [
//   { field: 'col1', headerName: 'Question', width: 200 },
//   { field: 'col2', headerName: 'Snippet', width: 200 },
//   { field: 'col3', headerName: 'Units Covered', width: 200 },
//   { field: 'col4', headerName: 'Options', width: 200 },
//   { field: 'col5', headerName: 'Answer', width: 200 },
//   {
//     field: 'col6',
//     headerName: 'Question Actions',
//     width: 200,
//     renderCell: () => (
//       <>
//         <IconButton
//           onClick={() => alert('edit question button clicked')}
//           sx={{ ':hover': { color: '#1ABBFF' } }}
//         >
//           <Edit />
//         </IconButton>
//         <IconButton
//           onClick={() => alert('delete question button clicked')}
//           sx={{ ':hover': { color: '#E4080A' } }}
//         >
//           <Delete />
//         </IconButton>
//       </>
//     ),
//   },
// ]

const Lesson = ({
  params,
}: {
  params: {
    className: string
    lessonName: string
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  // const [rows, setRows] = useState<GridRowsProp>([])

  // useEffect(() => {
  //   const fetchLessonQuestions = async () => {
  //     const lessonQuestions = await getLessonQuestionData(params.className, params.lessonName)
  //     const tableRows = lessonQuestions.map(
  //       ({ prompt, snippet, topics, answer_options, answer }, index) => ({
  //         id: index,
  //         col1: prompt,
  //         col2: snippet,
  //         col3: topics?.join(', '),
  //         col4: answer_options?.join(', '),
  //         col5: answer,
  //       })
  //     )
  //     setRows(tableRows)
  //   }
  //   fetchLessonQuestions()
  // }, [])

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
        <Box sx={{ paddingLeft: 3 }}>
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
            <IconButton onClick={() => setOpen(prev => !prev)}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>
        <QuestionDataGrid params={{ className: params.className, lessonName: params.lessonName }} />
        <Dialog open={open}>
          <DialogContent>
            <DialogTitle>Add Question</DialogTitle>
            <DialogActions>
              <button onClick={() => setOpen(false)}>Cancel</button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}

export default Lesson
