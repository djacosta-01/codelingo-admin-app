'use client'

import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid'
import { getLessonQuestionData } from '@/app/classes/[className]/lessons/[lessonName]/actions'

// source: https://mui.com/x/react-data-grid/editing/
const QuestionDataGrid = ({
  params,
  setPrevData,
  setOpen,
}: {
  params: {
    className: string
    lessonName: string
  }
  setPrevData: Dispatch<
    SetStateAction<{
      questionType: string
      prompt: string
      snippet: string
      topics: string[]
      answerOptions: string[]
      answer: string
    } | null>
  >
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [rows, setRows] = useState<GridRowsProp>()

  const handleEditClick = (id: GridRowId) => () => {
    const row = rows?.find(row => row.id === id)
    const { col0, col1, col2, col3, col4 } = row!
    setPrevData(prev => ({
      ...prev,
      questionType: 'multiple-choice',
      prompt: col0,
      snippet: col1,
      topics: col2.split(', '),
      answerOptions: col3.split(', '),
      answer: col4,
    }))
    setOpen(true)
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows?.filter(row => row.id !== id))
  }

  useEffect(() => {
    const fetchLessonQuestions = async () => {
      const lessonQuestions = await getLessonQuestionData(params.className, params.lessonName)
      const tableRows = lessonQuestions.map(
        ({ prompt, snippet, topics, answer_options, answer }, index) => ({
          id: index,
          col0: prompt,
          col1: snippet,
          col2: topics?.join(', '),
          col3: answer_options?.join(', '),
          col4: answer,
        })
      )
      setRows(tableRows)
    }
    fetchLessonQuestions()
  }, [])

  const columns: GridColDef[] = [
    { field: 'col0', headerName: 'Questions', width: 180, align: 'center', headerAlign: 'center' },
    {
      field: 'col1',
      headerName: 'Snippet',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'col2',
      headerName: 'Units Covered',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'col3',
      headerName: 'Options',
      width: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'col4',
      headerName: 'Answer',
      width: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        disableColumnSelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  )
}

export default QuestionDataGrid
