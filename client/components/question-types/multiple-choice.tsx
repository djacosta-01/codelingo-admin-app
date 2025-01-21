'use client'

import {
  type SelectChangeEvent,
  Box,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
} from '@mui/material'
import { RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useQuestionContext } from '@/contexts/question-context'

const mockTopics = ['topic 1', 'topic 2', 'topic 3', 'topic 4', 'topic 5', 'topic 6', 'topic 7']

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const convertToObject = (values: string[]) => {
  return values.reduce((acc: Record<string, string>, option, index) => {
    acc[`option${index + 1}`] = option
    return acc
  }, {})
}

const MultipleChoiceQuestion = () => {
  const [snippetIncluded, setSnippetIncluded] = useState(false)
  const {
    questionPrompt,
    setQuestionPrompt,
    questionSnippet,
    setQuestionSnippet,
    questionOptions,
    setQuestionOptions,
    correctAnswer,
    setCorrectAnswer,
    topicsCovered,
    setTopicsCovered,
  } = useQuestionContext()

  useEffect(() => {
    if (Object.keys(questionOptions).length === 0) setQuestionOptions({ option1: '', option2: '' })
  }, [])

  const handleQuestionPromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionPrompt(e.target.value)
  }

  const handleSnippetInput = (value: string) => {
    setQuestionSnippet(value)
  }

  const hideSnippet = () => {
    setQuestionSnippet('')
    setSnippetIncluded(false)
  }

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQuestionOptions({ ...questionOptions, [name]: value })
  }

  const handleAddNewOption = () => {
    setQuestionOptions(prev => {
      return { ...prev, [`option${Object.keys(prev).length + 1}`]: '' }
    })
  }

  const deleteQuestionOption = (key: string) => {
    const mapping = new Map(Object.entries(questionOptions))
    mapping.delete(key)

    // necessary to keep state updates in sync (specifically textfield onChange)
    const values = Object.values(Object.fromEntries(mapping))
    const updatedOptions = convertToObject(values)
    setQuestionOptions(updatedOptions)
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const handleTopicsCovered = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e
    setTopicsCovered(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <>
      <TextField
        autoFocus
        required
        multiline
        rows={4}
        placeholder="Enter your question prompt"
        label="Question Prompt"
        variant="standard"
        value={questionPrompt}
        onChange={handleQuestionPromptInput}
        sx={{ width: '30rem' }}
      />
      {snippetIncluded || questionSnippet !== '' ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Editor
            theme="vs-dark"
            height="50vh"
            width="50vw"
            defaultLanguage="python"
            options={{ contextmenu: false }}
            value={questionSnippet}
            onChange={value => handleSnippetInput(value || '')}
          />
          <IconButton color="error" onClick={hideSnippet}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ) : (
        <Button onClick={() => setSnippetIncluded(true)}>Add Snippet</Button>
      )}

      <Box
        id="options"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          flexWrap: 'wrap',
          width: '50%',
        }}
      >
        {Object.values(questionOptions).map((option, index) => {
          const optionKey = `option${index + 1}`
          return (
            <Box key={index}>
              <TextField
                required
                label={`Option ${index + 1}`}
                name={optionKey}
                variant="standard"
                value={option}
                onChange={handleOptionInput}
              />
              <IconButton
                disabled={Object.values(questionOptions).length === 2}
                color="error"
                onClick={() => deleteQuestionOption(optionKey)}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          )
        })}
      </Box>
      <Box id="add-new-option-button">
        <Button
          variant="contained"
          disabled={Object.values(questionOptions).length === 10}
          onClick={handleAddNewOption}
        >
          Add Option
        </Button>
      </Box>
      <FormControl>
        <InputLabel id="correct-answer">Correct Answer</InputLabel>
        <Select
          required
          labelId="correct-answer"
          label="Correct Answer"
          variant="standard"
          value={Object.values(questionOptions).includes(correctAnswer) ? correctAnswer : ''}
          onChange={handleCorrectAnswerSelect}
          sx={{ width: '15em' }}
        >
          {Object.values(questionOptions).map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="topics-covered">Topics Covered</InputLabel>
        <Select
          required
          label="topics-covered"
          variant="standard"
          multiple
          value={topicsCovered}
          onChange={handleTopicsCovered}
          renderValue={(selected: string[]) => selected.join(', ')}
          sx={{ width: '15em' }}
          MenuProps={MenuProps}
        >
          {mockTopics.map((topic, index) => (
            <MenuItem key={index} value={topic}>
              <Checkbox checked={topicsCovered.includes(topic)} />
              {topic}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default MultipleChoiceQuestion
