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
import { useState, useEffect } from 'react'
import { RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'
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

const RearrangeQuestion = () => {
  const [selectedText, setSelectedText] = useState('')
  const [snippetIncluded, setSnippetIncluded] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  // const [tokens, setTokens] = useState<string[]>([])
  const {
    questionPrompt,
    setQuestionPrompt,
    questionSnippet,
    setQuestionSnippet,
    questionOptions,
    setQuestionOptions,
  } = useQuestionContext()

  useEffect(() => {
    if (!Array.isArray(questionOptions)) {
      // console.log('in useEffect for rearrange')
      setQuestionOptions([] as string[])
    }
  }, [])

  const handleQuestionPromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionPrompt(e.target.value)
  }

  const handleSnippetInput = (value: string) => {
    setQuestionSnippet(value)
  }

  const showSnippet = () => {
    setSnippetIncluded(true)
  }

  const hideSnippet = () => {
    setQuestionSnippet('')
    setSnippetIncluded(false)
  }

  const handleTokenCreation = () => {
    const selection = window.getSelection()

    if (selection && selection.toString().length > 0) {
      // setSelectedText(selection.toString())
      setQuestionOptions(prev => [...(prev as string[]), selection.toString()])
    } else {
      alert('No text selected')
      setSelectedText('')
    }
  }

  const handleTokenReset = () => {
    setQuestionOptions([])
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

  // console.log(questionOptions)

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
        <Box
          onContextMenu={handleContextMenu}
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, cursor: 'context-menu' }}
        >
          <Editor
            theme="vs-dark"
            height="50vh"
            width="50vw"
            defaultLanguage="python"
            options={{ contextmenu: false }}
            value={questionSnippet}
            onChange={value => handleSnippetInput(value ?? '')}
          />
          <IconButton color="error" onClick={hideSnippet}>
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
            <MenuItem onClick={handleTokenCreation}>Create Token</MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button onClick={showSnippet}>Add Snippet</Button>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {!Array.isArray(questionOptions)
          ? ''
          : questionOptions.map((token, index) => (
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
      <Button onClick={handleTokenReset}>CLEAR</Button>

      {/* <FormControl>
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
      </FormControl> */}
    </>
  )
}

export default RearrangeQuestion
