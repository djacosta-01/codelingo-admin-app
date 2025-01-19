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
import { useState } from 'react'
import Editor from '@monaco-editor/react'

interface MCQuestionProps {
  questionPrompt: string
  snippet: string
  options: { [key: string]: string }
  correctAnswer: string
  topicsCovered: string[]
  handleQuestionPromptInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSnippetInput: (value: string) => void
  handleOptionInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  deleteAnswerFromForm: (optionKey: string) => void
  handleAddNewOption: () => void
  handleCorrectAnswerSelect: (e: SelectChangeEvent) => void
  handleTopicsCoveredSelect: (e: SelectChangeEvent<string[]>) => void
}

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
const MultipleChoiceQuestion = ({
  questionPrompt,
  snippet,
  options,
  correctAnswer,
  topicsCovered,
  handleQuestionPromptInput,
  handleSnippetInput,
  handleOptionInput,
  deleteAnswerFromForm,
  handleAddNewOption,
  handleCorrectAnswerSelect,
  handleTopicsCoveredSelect,
}: MCQuestionProps) => {
  const [snippetIncluded, setSnippetIncluded] = useState(false)

  const resetSnippet = () => {
    setSnippetIncluded(false)
    handleSnippetInput('')
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
      {snippetIncluded || snippet !== '' ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Editor
            theme="vs-dark"
            height="50vh"
            width="50vw"
            defaultLanguage="python"
            options={{ contextmenu: false }}
            value={snippet}
            onChange={value => handleSnippetInput(value || '')}
          />
          <IconButton color="error" onClick={resetSnippet}>
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
        {Object.values(options).map((option, index) => {
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
                disabled={Object.values(options).length === 2}
                color="error"
                onClick={() => deleteAnswerFromForm(optionKey)}
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
          disabled={Object.values(options).length === 10}
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
          value={Object.values(options).includes(correctAnswer) ? correctAnswer : ''}
          onChange={handleCorrectAnswerSelect}
          sx={{ width: '15em' }}
        >
          {Object.values(options).map((option, index) => (
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
          onChange={handleTopicsCoveredSelect}
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
