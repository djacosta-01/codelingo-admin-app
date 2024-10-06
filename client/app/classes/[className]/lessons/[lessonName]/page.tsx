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
} from '@mui/material'
import { AddCircleOutline } from '@mui/icons-material'
import { useState } from 'react'
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
  const [questionType, setQuestionType] = useState<string>('multiple-choice')
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [options, setOptions] = useState({ option1: '', option2: '', option3: '', option4: '' })
  const [correctAnswer, setCorrectAnswer] = useState<string>('')

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value })
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value as string)
  }

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleDialogClose = () => {
    setOpen(false)
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
        <QuestionDataGrid params={{ className: params.className, lessonName: params.lessonName }} />
        <Dialog open={open} fullScreen>
          <DialogTitle>Add Question</DialogTitle>
          <DialogContent>
            <form>
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
                <Select
                  label="Question Type"
                  variant="standard"
                  sx={{ width: '15em' }}
                  value={questionType}
                  onChange={e => setQuestionType(e.target.value)}
                >
                  <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                </Select>
                <TextField
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
                  }}
                >
                  <TextField
                    required
                    label="Option 1"
                    name="option1"
                    variant="standard"
                    value={options.option1}
                    onChange={handleOptionInput}
                  />
                  <TextField
                    required
                    label="Option 2"
                    name="option2"
                    variant="standard"
                    value={options.option2}
                    onChange={handleOptionInput}
                  />
                  <TextField
                    required
                    label="Option 3"
                    name="option3"
                    variant="standard"
                    value={options.option3}
                    onChange={handleOptionInput}
                  />
                  <TextField
                    required
                    label="Option 4"
                    name="option4"
                    variant="standard"
                    value={options.option4}
                    onChange={handleOptionInput}
                  />
                </Box>
                <FormControl>
                  <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
                  <Select
                    required
                    labelId="correct-answer-label"
                    label="Correct Answer"
                    variant="standard"
                    sx={{ width: '15em' }}
                    value={Object.keys(options).length !== 4 ? 'Correct Answer' : correctAnswer}
                    onChange={handleCorrectAnswerSelect}
                  >
                    <MenuItem>
                      <em>-- Correct Answer --</em>
                    </MenuItem>
                    {Array.from(Object.values(options)).map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Lesson
