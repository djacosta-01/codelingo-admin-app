'use client'

import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Fade,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import RearrangeQuestion from '@/components/question-types/rearrange'
import MultipleChoiceQuestion from '@/components/question-types/multiple-choice'
import { useQuestionContext } from '@/contexts/question-context'

const AddQuestionDialog = ({
  lessonName,
  open,
  setOpen,
  setAlertOpen,
  setRefreshGrid,
}: {
  lessonName: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  setRefreshGrid: Dispatch<SetStateAction<number>>
}) => {
  const [error, setError] = useState<boolean>(false)
  const { questionType, questionID, setQuestionType, submitQuestion, resetStates } =
    useQuestionContext()
  const [buttonOperation, setButtonOperation] = useState<'Add Question' | 'Update Question'>(
    'Add Question'
  )

  // probably don't need this anymore since we're using context??
  useEffect(() => {
    if (questionID) setButtonOperation('Update Question')
  }, [open])

  const handleDialogClose = () => {
    setOpen(false)

    // reset form values
    resetStates()
    setButtonOperation('Add Question')
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response =
      buttonOperation === 'Add Question'
        ? await submitQuestion({ lessonName })
        : await submitQuestion({ questionID: questionID! }) // questionID guaranteed to be defined here

    if (!response.success) {
      setError(true)
      return
    }

    handleDialogClose()
    setRefreshGrid(prev => prev + 1)
    setAlertOpen(true)
  }

  const componentMap: { [key: string]: JSX.Element } = {
    ['Multiple Choice']: <MultipleChoiceQuestion />,
    ['Rearrange']: <RearrangeQuestion />,
  }

  return (
    <Dialog open={open} fullScreen PaperProps={{ component: 'form', onSubmit: submitForm }}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <FormControl id-="question-type">
          <InputLabel>Question Type</InputLabel>
          <Select
            required
            label="Question Type"
            variant="standard"
            sx={{ width: '15em' }}
            value={questionType}
            onChange={e => setQuestionType(e.target.value)}
          >
            <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
            <MenuItem value="Rearrange">Rearrange</MenuItem>
          </Select>
        </FormControl>

        {componentMap[questionType]}

        <Fade in={error}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(false)
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            Failed to add question. Please review your input and try again
          </Alert>
        </Fade>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button type="submit">{buttonOperation}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddQuestionDialog
