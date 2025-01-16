'use client'

import {
  type SelectChangeEvent,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Fade,
  Tooltip,
} from '@mui/material'
import { Close, RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  createNewQuestion,
  updateQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { Question } from '@/types/content.types'
import RearrangeQuestion from '@/components/question-types/rearrange'
import MultipleChoiceQuestion from '@/components/question-types/multiple-choice'

const AddQuestionDialog = ({
  lessonName,
  open,
  setOpen,
  alertOpen,
  setAlertOpen,
  prevQuestionData,
  resetPrevData,
  setRefreshGrid,
}: {
  lessonName: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  alertOpen: boolean
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  prevQuestionData: Question | null
  resetPrevData: Dispatch<SetStateAction<Question | null>>
  setRefreshGrid: Dispatch<SetStateAction<number>>
}) => {
  const [questionId, setQuestionId] = useState<number>(-1)
  const [questionType, setQuestionType] = useState<string>('')
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [options, setOptions] = useState<{ [key: string]: string }>({ option1: '', option2: '' })
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [buttonOperation, setButtonOperation] = useState<'Add Question' | 'Update Question'>(
    'Add Question'
  )

  useEffect(() => {
    if (prevQuestionData) {
      const { questionId, questionType, prompt, topics, answerOptions, answer } = prevQuestionData

      setQuestionId(questionId ?? -1)
      setQuestionType(questionType)
      setQuestionPrompt(prompt)
      setTopicsCovered(topics)

      const prevAnswerOptions = convertToObject(answerOptions)

      setOptions(prev => ({
        ...prev,
        ...prevAnswerOptions,
      }))
      setCorrectAnswer(answer)
      setButtonOperation('Update Question')
    }
  }, [open, prevQuestionData])

  const convertToObject = (values: string[]) => {
    return values.reduce((acc: Record<string, string>, option, index) => {
      acc[`option${index + 1}`] = option
      return acc
    }, {})
  }

  const handleDialogClose = () => {
    setOpen(false)

    // reset form values
    setQuestionType('')
    setQuestionPrompt('')
    setOptions({
      option1: '',
      option2: '',
    })
    setCorrectAnswer('')
    setTopicsCovered([])
    setButtonOperation('Add Question')
    resetPrevData(null)
  }

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOptions({ ...options, [name]: value })
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const deleteAnswerFromForm = (key: string) => {
    const mapping = new Map(Object.entries(options))
    mapping.delete(key)

    // necessary to keep state updates in sync (specifically textfield onChange)
    const values = Object.values(Object.fromEntries(mapping))
    const updatedOptions = convertToObject(values)
    setOptions(updatedOptions)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response =
      buttonOperation === 'Add Question'
        ? await createNewQuestion(lessonName, {
            questionType,
            prompt: questionPrompt,
            snippet: '',
            topics: topicsCovered,
            answerOptions: Object.values(options),
            answer: correctAnswer,
          })
        : await updateQuestion(questionId, {
            questionType,
            prompt: questionPrompt,
            snippet: '',
            topics: topicsCovered,
            answerOptions: Object.values(options),
            answer: correctAnswer,
          })

    if (response.success) {
      handleDialogClose()
      setRefreshGrid(prev => prev + 1)
    } else if (response.error === 'Duplicate answer options found') {
      // move this error check to the frontend??
      alert(response.error)
      return
    }
    setAlertOpen(true)
  }

  const componentMap: { [key: string]: JSX.Element } = {
    multipleChoice: <MultipleChoiceQuestion />,
    rearrange: <RearrangeQuestion />,
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
            <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
            <MenuItem value="rearrange">Rearrange</MenuItem>
          </Select>
        </FormControl>

        {componentMap[questionType]}

        <Fade in={alertOpen}>
          <Alert
            severity="error"
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
