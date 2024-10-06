'use client'

import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import {
  type SelectChangeEvent,
  Box,
  IconButton,
  Tooltip,
  Typography,
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
import { AddCircleOutline, Close } from '@mui/icons-material'
import { useState } from 'react'
import { insertQuestionData } from '@/app/classes/[className]/lessons/[lessonName]/actions'
import QuestionDataGrid from '@/app/classes/[className]/lessons/[lessonName]/question-data-grid'

const Lesson = ({
  params,
}: {
  params: {
    className: string
    lessonName: string
  }
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [questionType, setQuestionType] = useState<string>('')
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [options, setOptions] = useState({ option1: '', option2: '', option3: '', option4: '' })
  const [topicsCovered, setTopicsCovered] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>('')

  const [alertOpen, setAlertOpen] = useState<boolean>(false)

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value })
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleDialogClose = () => {
    setOpen(false)
    // reset form values
    setQuestionType('')
    setQuestionPrompt('')
    setOptions({ option1: '', option2: '', option3: '', option4: '' })
    setCorrectAnswer('')
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await insertQuestionData({
      questionType,
      prompt: questionPrompt,
      snippet: '',
      topics: topicsCovered,
      answer_options: Object.values(options),
      answer: correctAnswer,
    })
    if (response.success) {
      handleDialogClose()
    }
    setAlertOpen(true)
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
        <QuestionDataGrid params={{ className: params.className, lessonName: params.lessonName }} />
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
            <Button type="submit">Add Question</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Lesson
