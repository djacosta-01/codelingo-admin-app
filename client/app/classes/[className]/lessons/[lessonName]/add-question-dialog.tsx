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
import { insertQuestion } from '@/app/classes/[className]/lessons/[lessonName]/actions'

const AddQuestionDialog = ({
  open,
  setOpen,
  alertOpen,
  setAlertOpen,
  prevQuestionData,
  resetPrevData,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  alertOpen: boolean
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  prevQuestionData: {
    questionType: string
    prompt: string
    snippet: string
    topics: string[]
    answerOptions: string[]
    answer: string
  } | null
  resetPrevData: Dispatch<
    SetStateAction<{
      questionType: string
      prompt: string
      snippet: string
      topics: string[]
      answerOptions: string[]
      answer: string
    } | null>
  >
}) => {
  const [questionType, setQuestionType] = useState<string>('')
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [options, setOptions] = useState({ option1: '', option2: '', option3: '', option4: '' })
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [buttonOperation, setButtonOperation] = useState<'Add Question' | 'Update Question'>(
    'Add Question'
  )
  useEffect(() => {
    if (prevQuestionData) {
      const { questionType, prompt, topics, answerOptions, answer } = prevQuestionData
      setQuestionType(questionType)
      setQuestionPrompt(prompt)
      setTopicsCovered(topics)
      setOptions(prev => ({
        ...prev,
        option1: answerOptions[0],
        option2: answerOptions[1],
        option3: answerOptions[2],
        option4: answerOptions[3],
      }))
      setCorrectAnswer(answer)
      setButtonOperation('Update Question')
    }
  }, [open])

  const handleDialogClose = () => {
    setOpen(false)
    // reset form values
    setQuestionType('')
    setQuestionPrompt('')
    setOptions({ option1: '', option2: '', option3: '', option4: '' })
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
        ? await insertQuestion({
            questionType,
            prompt: questionPrompt,
            snippet: '',
            topics: topicsCovered,
            answer_options: Object.values(options),
            answer: correctAnswer,
          })
        : alert('Update Question logic not implemented yet')

    if (response?.success) {
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
            <TextField
              required
              label="Option 1"
              name="option1"
              variant="standard"
              value={options.option1}
              onChange={handleOptionInput}
              sx={{
                flexBasis: 'calc(50% - 12px)',
              }}
            />
            <TextField
              required
              label="Option 2"
              name="option2"
              variant="standard"
              value={options.option2}
              onChange={handleOptionInput}
              sx={{
                flexBasis: 'calc(50% - 12px)',
              }}
            />
            <TextField
              required
              label="Option 3"
              name="option3"
              variant="standard"
              value={options.option3}
              onChange={handleOptionInput}
              sx={{
                flexBasis: 'calc(50% - 12px)',
              }}
            />
            <TextField
              required
              label="Option 4"
              name="option4"
              variant="standard"
              value={options.option4}
              onChange={handleOptionInput}
              sx={{
                flexBasis: 'calc(50% - 12px)',
              }}
            />
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
              {Array.from(Object.values(options)).map((option, index) => (
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
