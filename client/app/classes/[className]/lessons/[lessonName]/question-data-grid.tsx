'use client'

import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  GridRowsProp,
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid'
import {
  getLessonQuestions,
  deleteQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { Question } from '@/types/content.types'

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
  setPrevData: Dispatch<SetStateAction<Question | null>>
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [rows, setRows] = useState<GridRowsProp>()
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
  const [questionId, setQuestionId] = useState<number | null>(null)

  const handleConfimationDialogOpen = (id: number) => {
    setQuestionId(id)
    setConfirmationDialogOpen(true)
  }

  const handleConfimationDialogClose = () => {
    setQuestionId(null)
    setConfirmationDialogOpen(false)
  }

  const handleEditClick = (id: GridRowId) => () => {
    const row = rows?.find(row => row.id === id)
    const { id: rowId, col0, col1, col2, col3, col4 } = row!

    setPrevData(prev => ({
      ...prev,
      questionId: rowId as number,
      questionType: 'multiple-choice',
      prompt: col0,
      snippet: col1,
      topics: col2.split(', '),
      answerOptions: col3.split(', '),
      answer: col4,
    }))
    setOpen(true)
  }

  const handleDeleteQuestion = (id: GridRowId) => async () => {
    // TODO: only delete question from lesson bank table, not from questions table in future
    const response = await deleteQuestion(id as number)
    if (!response.success) {
      console.error('Error deleting question: ', response.error)
      return
    }
    setRows(rows?.filter(row => row.id !== id))
    handleConfimationDialogClose()
  }

  useEffect(() => {
    const fetchLessonQuestions = async () => {
      console.log('fetching lesson questions')
      const lessonQuestions = await getLessonQuestions(params.className, params.lessonName)
      const tableRows = lessonQuestions.map(
        ({ question_id, prompt, snippet, topics, answer_options, answer }) => ({
          id: question_id,
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
  }, [params.className, params.lessonName, setOpen])

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
            sx={{ ':hover': { color: '#1B94F7' } }}
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleConfimationDialogOpen(id as number)}
            color="inherit"
            sx={{ ':hover': { color: 'red' } }}
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
        disableColumnSelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
      <Dialog open={confirmationDialogOpen}>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>Are you sure you want to delete this question?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfimationDialogClose}>Cancel</Button>
          <Button color="error" onClick={handleDeleteQuestion(questionId as number)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuestionDataGrid
