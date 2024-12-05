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
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  insertQuestion,
  updateQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { Question } from '@/types/content.types'

const AddQuestionDialog = ({
  lessonName,
  open,
  setOpen,
  alertOpen,
  setAlertOpen,
  prevQuestionData,
  resetPrevData,
}: {
  lessonName: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  alertOpen: boolean
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  prevQuestionData: Question | null
  resetPrevData: Dispatch<SetStateAction<Question | null>>
}) => {
  const [questionId, setQuestionId] = useState<number>(-1)
  const [questionType, setQuestionType] = useState<string>('')
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [options, setOptions] = useState({ option1: '', option2: '' })
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

      const prevAnswerOptions = answerOptions.reduce(
        (acc: Record<string, string>, option, index) => {
          acc[`option${index + 1}`] = option
          return acc
        },
        {}
      )
      setOptions(prev => ({
        ...prev,
        ...prevAnswerOptions,
      }))
      setCorrectAnswer(answer)
      setButtonOperation('Update Question')
    }
  }, [open, prevQuestionData])

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
    setOptions({ ...options, [e.target.name]: e.target.value })
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response =
      buttonOperation === 'Add Question'
        ? await insertQuestion(lessonName, {
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
    }
    setAlertOpen(true)
  }

  return (
    <Dialog open={open} fullScreen PaperProps={{ component: 'form', onSubmit: submitForm }}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent>
        <Box
          id="add-question-form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            justifyContent: 'space-evenly',
            height: '80vh',
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
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            label="Question Prompt"
            variant="standard"
            value={questionPrompt}
            onChange={e => setQuestionPrompt(e.target.value)}
          />
          <Box
            id="options"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
              width: '25%',
            }}
          >
            {Object.values(options).map((option, index) => {
              return (
                <TextField
                  key={index}
                  required
                  label={`Option ${index + 1}`}
                  name={`option${index + 1}`}
                  variant="standard"
                  value={option}
                  onChange={handleOptionInput}
                  sx={{
                    flexBasis: 'calc(50% - 12px)',
                  }}
                />
              )
            })}
          </Box>
          <Box id="add-new-question-button">
            <Button
              variant="contained"
              disabled={Object.values(options).length === 10}
              onClick={() =>
                setOptions(prev => {
                  return { ...prev, [`option${Object.keys(prev).length + 1}`]: '' }
                })
              }
            >
              add new textbox
            </Button>
          </Box>
          <FormControl>
            <InputLabel id="correct-answer">Correct Answer</InputLabel>
            <Select
              required
              labelId="correct-answer"
              label="Correct Answer"
              variant="standard"
              sx={{ width: '15em' }}
              value={correctAnswer}
              onChange={handleCorrectAnswerSelect}
            >
              {Object.values(options).map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button type="submit">{buttonOperation}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddQuestionDialog
