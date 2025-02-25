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
} from '@mui/x-data-grid'
import {
  getLessonQuestions,
  deleteQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import DataGridSkeleton from '@/components/skeletons/data-grid-skeleton'
import { useQuestionContext } from '@/contexts/question-context'

// source: https://mui.com/x/react-data-grid/editing/
const QuestionDataGrid = ({
  params,
  dataLoading,
  setDataLoading,
  setOpen,
  refreshGrid,
}: {
  params: {
    className: string
    lessonName: string
  }
  dataLoading: boolean
  setDataLoading: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  refreshGrid: number
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
  const {
    questionID,
    setQuestionID,
    setQuestionType,
    setQuestionPrompt,
    setQuestionSnippet,
    setQuestionOptions,
    setCorrectAnswer,
    setTopicsCovered,
  } = useQuestionContext()

  const handleConfimationDialogOpen = (id: number) => {
    setQuestionID(id)
    setConfirmationDialogOpen(true)
  }

  const handleConfimationDialogClose = () => {
    setQuestionID(null)
    setConfirmationDialogOpen(false)
  }

  const handleEditClick = (id: number) => () => {
    const row = rows?.find(row => row.id === id)
    const {
      id: rowId,
      promptColumn,
      questionTypeColumn,
      snippetColumn,
      unitsCoveredColumn,
      optionsColumn,
      answerColumn,
    } = row!

    setQuestionID(rowId)
    setQuestionType(questionTypeColumn)
    setQuestionPrompt(promptColumn)
    setQuestionSnippet(snippetColumn)
    setQuestionOptions(optionsColumn.split(', '))
    setCorrectAnswer(answerColumn)
    setTopicsCovered(unitsCoveredColumn.split(', '))
    setOpen(true)
  }

  const handleDeleteQuestion = (id: number) => async () => {
    // TODO: only delete question from lesson bank table, not from questions table in future
    const response = await deleteQuestion(id)
    if (!response.success) {
      console.error('Error deleting question: ', response.error)
      return
    }
    setRows(rows?.filter(row => row.id !== id))
    handleConfimationDialogClose()
  }

  useEffect(() => {
    const fetchLessonQuestions = async () => {
      const lessonQuestions = await getLessonQuestions(params.className, params.lessonName)

      const tableRows = lessonQuestions.map(
        ({ question_id, question_type, prompt, snippet, topics, answer_options, answer }) => ({
          id: question_id,
          promptColumn: prompt,
          questionTypeColumn: question_type,
          snippetColumn: snippet,
          unitsCoveredColumn: topics?.join(', '),
          // TODO: convert this to be a list of objects and update it accordingly
          optionsColumn: answer_options?.join(', '),
          answerColumn: answer,
        })
      )

      setRows(tableRows)
      setDataLoading(false)
    }

    fetchLessonQuestions()
  }, [params.className, params.lessonName, setDataLoading, setOpen, refreshGrid])

  const columns: GridColDef[] = [
    {
      field: 'promptColumn',
      headerName: 'Question',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'questionTypeColumn',
      headerName: 'Question Type',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'snippetColumn',
      headerName: 'Snippet',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'unitsCoveredColumn',
      headerName: 'Units Covered',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'optionsColumn',
      headerName: 'Options',
      width: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'answerColumn',
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
            onClick={handleEditClick(id as number)}
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
      {dataLoading ? (
        <DataGridSkeleton columns={columns} />
      ) : (
        <>
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
              <Button color="error" onClick={handleDeleteQuestion(questionID as number)}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  )
}

export default QuestionDataGrid
