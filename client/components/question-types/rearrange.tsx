'use client'

import Editor from '@monaco-editor/react'
import {
  Box,
  Menu,
  MenuItem,
  Paper,
  Button,
  IconButton,
  TextField,
  FormControl,
  Checkbox,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from '@mui/material'
import { useState } from 'react'
import { RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'

interface QuestionProps {
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

const RearrangeQuestion = ({
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
}: QuestionProps) => {
  const [selectedText, setSelectedText] = useState('')
  const [snippetIncluded, setSnippetIncluded] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  // const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [tokens, setTokens] = useState<string[]>([])

  const handleSelectionChange = () => {
    const selection = window.getSelection()

    if (selection && selection.toString().length > 0) {
      // setSelectedText(selection.toString())
      setTokens(prev => [...prev, selection.toString()])
    } else {
      alert('No text selected')
      setSelectedText('')
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: e.clientX + 2,
            mouseY: e.clientY - 6,
          }
        : null
    )
  }

  const handleClose = () => {
    setContextMenu(null)
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
      {snippetIncluded ? (
        <Box onContextMenu={handleContextMenu} sx={{ cursor: 'context-menu' }}>
          <Editor
            theme="vs-dark"
            height="50vh"
            width="50vw"
            defaultLanguage="python"
            options={{ contextmenu: false }}
            value={snippet}
            onChange={value => handleSnippetInput(value ?? '')}
          />
          <IconButton color="error" onClick={() => setSnippetIncluded(false)}>
            <RemoveIcon />
          </IconButton>
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleSelectionChange}>Create Token</MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button onClick={() => setSnippetIncluded(true)}>Add Snippet</Button>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {tokens.map((token, index) => (
          <Paper
            elevation={4}
            key={index}
            sx={{
              padding: 1,
              height: '5em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {token}
          </Paper>
        ))}
      </Box>
      <Button onClick={() => setTokens([])}>CLEAR</Button>

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

export default RearrangeQuestion
