'use client'

import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { AddCircleOutline, Edit, Delete } from '@mui/icons-material'
import { getLessonQuestionData } from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { useState, useEffect } from 'react'

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Question', width: 200 },
  { field: 'col2', headerName: 'Snippet', width: 200 },
  { field: 'col3', headerName: 'Units Covered', width: 200 },
  { field: 'col4', headerName: 'Options', width: 200 },
  { field: 'col5', headerName: 'Answer', width: 200 },
  {
    field: 'col6',
    headerName: 'Question Actions',
    width: 200,
    renderCell: () => (
      <>
        <IconButton
          onClick={() => alert('edit question button clicked')}
          sx={{ ':hover': { color: '#1ABBFF' } }}
        >
          <Edit />
        </IconButton>
        <IconButton
          onClick={() => alert('delete question button clicked')}
          sx={{ ':hover': { color: '#E4080A' } }}
        >
          <Delete />
        </IconButton>
      </>
    ),
  },
]

const Lesson = ({
  params,
}: {
  params: {
    className: string
    lessonName: string
  }
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  useEffect(() => {
    const fetchLessonQuestions = async () => {
      const lessonQuestions = await getLessonQuestionData(params.className, params.lessonName)
      const tableRows = lessonQuestions.map(
        ({ prompt, snippet, topics, answer_options, answer }, index) => ({
          id: index,
          col1: prompt,
          col2: snippet,
          col3: topics?.join(', '),
          col4: answer_options?.join(', '),
          col5: answer,
        })
      )
      setRows(tableRows)
    }
    fetchLessonQuestions()
  }, [])

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
            <IconButton onClick={() => alert('add question button clicked')}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </Box>
        {/* source: https://mui.com/x/react-data-grid/demo/ */}
        <DataGrid
          ignoreDiacritics
          rows={rows}
          columns={columns}
          disableColumnSelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </>
  )
}

export default Lesson
