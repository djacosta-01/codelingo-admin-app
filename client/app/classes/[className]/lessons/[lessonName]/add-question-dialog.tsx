'use client'

import {
  type SelectChangeEvent,
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
  // alertOpen,
  setAlertOpen,
  prevQuestionData,
  resetPrevData,
  setRefreshGrid,
}: {
  lessonName: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  // alertOpen: boolean
  setAlertOpen: Dispatch<SetStateAction<boolean>>
  prevQuestionData: Question | null
  resetPrevData: Dispatch<SetStateAction<Question | null>>
  setRefreshGrid: Dispatch<SetStateAction<number>>
}) => {
  const [error, setError] = useState<boolean>(false)
  const [questionId, setQuestionId] = useState<number>(-1)
  const [questionSnippet, setQuestionSnippet] = useState('')
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
      const { questionId, questionType, snippet, prompt, topics, answerOptions, answer } =
        prevQuestionData

      setQuestionId(questionId ?? -1)
      setQuestionSnippet(snippet)
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
  }, [open])

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
    setQuestionSnippet('')
    setOptions({
      option1: '',
      option2: '',
    })
    setCorrectAnswer('')
    setTopicsCovered([])
    setButtonOperation('Add Question')
    resetPrevData(null)
  }

  const handleQuestionPromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionPrompt(e.target.value)
  }

  const handleSnippetInput = (value: string) => {
    setQuestionSnippet(value ?? '')
  }

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOptions({ ...options, [name]: value })
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const handleAddNewOption = () => {
    setOptions(prev => {
      return { ...prev, [`option${Object.keys(prev).length + 1}`]: '' }
    })
  }

  const deleteAnswerFromForm = (key: string) => {
    const mapping = new Map(Object.entries(options))
    mapping.delete(key)

    // necessary to keep state updates in sync (specifically textfield onChange)
    const values = Object.values(Object.fromEntries(mapping))
    const updatedOptions = convertToObject(values)
    setOptions(updatedOptions)
  }

  const handleTopicsCovered = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e
    setTopicsCovered(typeof value === 'string' ? value.split(',') : value)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response =
      buttonOperation === 'Add Question'
        ? await createNewQuestion(lessonName, {
            questionType,
            prompt: questionPrompt,
            snippet: questionSnippet,
            topics: topicsCovered,
            answerOptions: Object.values(options),
            answer: correctAnswer,
          })
        : await updateQuestion(questionId, {
            questionType,
            prompt: questionPrompt,
            snippet: questionSnippet,
            topics: topicsCovered,
            answerOptions: Object.values(options),
            answer: correctAnswer,
          })

    if (!response.success) {
      setError(true)
      return
    }

    handleDialogClose()
    setRefreshGrid(prev => prev + 1)
    setAlertOpen(true)
  }

  const componentMap: { [key: string]: JSX.Element } = {
    ['Multiple Choice']: (
      <MultipleChoiceQuestion
        questionPrompt={questionPrompt}
        snippet={questionSnippet}
        options={options}
        correctAnswer={correctAnswer}
        topicsCovered={topicsCovered}
        handleQuestionPromptInput={handleQuestionPromptInput}
        handleSnippetInput={handleSnippetInput}
        handleOptionInput={handleOptionInput}
        deleteAnswerFromForm={deleteAnswerFromForm}
        handleAddNewOption={handleAddNewOption}
        handleCorrectAnswerSelect={handleCorrectAnswerSelect}
        handleTopicsCoveredSelect={handleTopicsCovered}
      />
    ),
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
