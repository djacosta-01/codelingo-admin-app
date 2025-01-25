'use client'

import Editor from '@monaco-editor/react'
import { EditorState } from '@uiw/react-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
import CodeMirrorExample from '../add-class-content/custom-editor'

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
  const [selectionObj, setSelectionObj] = useState({ text: '', position: [0, 0] })
  const [snippetIncluded, setSnippetIncluded] = useState(true)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)

  const {
    questionType,
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
    if (!Array.isArray(questionOptions)) {
      setQuestionOptions([] as string[])
    }
  }, [])

  const handleQuestionPromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionPrompt(e.target.value)
  }

  const handleSnippetInput = (value: string) => {
    setQuestionSnippet(value)
    setCorrectAnswer(value)
  }

  const showSnippet = () => {
    setSnippetIncluded(true)
  }

  const hideSnippet = () => {
    setQuestionSnippet('')
    setSnippetIncluded(false)
  }

  const handleTokenCreation = () => {
    // const selection = window.getSelection()

    // if (selection && selection.toString().length > 0) {
    //   // console.log(selection)
    //   // console.log('Anchor node:', selection.anchorNode)
    //   // console.log('Focus node:', selection.focusNode)
    //   // console.log('Anchor offset:', selection.anchorOffset)
    //   // console.log('Focus offset:', selection.focusOffset)
    //   // const x = [...selection.toString()]

    //   // console.log(x)
    //   // setSelectedText(selection.toString())
    //   setQuestionOptions(prev => [...(prev as string[]), selection.toString()])
    // } else {
    //   alert('No text selected')
    //   setSelectedText('')
    // }
    const selectionObj = window.getSelection()
    const selectedText = selectionObj?.toString() // Get the selected text

    if (selectedText) {
      const range = selectionObj?.getRangeAt(0) // Get the range of the selection
      const startOffset = range?.startOffset // Start offset of the selection
      const endOffset = range?.endOffset // End offset of the selection
      console.log('Selected text:', selectedText)
      console.log('Start offset:', startOffset)
      console.log('End offset:', endOffset)
      console.log('Range:', range)
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

  const handleContextMenuClose = () => {
    setContextMenu(null)
  }

  const handleTopicsCovered = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e
    setTopicsCovered(typeof value === 'string' ? value.split(',') : value)
  }

  const testNewSelectionMethod = (e: { target: any }) => {
    console.log('IN TEST NEW SELECTION METHOD\n')

    const input = e.target
    const { value, selectionStart, selectionEnd } = input

    if (selectionStart !== selectionEnd) {
      console.log('Value:', value)
      console.log('Selection start:', selectionStart)
      console.log('Selection end:', selectionEnd)
      const selectedText = value.slice(selectionStart, selectionEnd)
      console.log(selectedText)
    }
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
        <Box
          onContextMenu={handleContextMenu}
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, cursor: 'context-menu' }}
        >
          {/* <CodeMirror
            height="500px"
            width="500px"
            value={questionSnippet}
            onChange={value => handleSnippetInput(value ?? '')}
            theme={oneDark}
            extensions={[javascript()]}
          /> */}
          <CodeMirrorExample />
          {/* <Editor
            theme="vs-dark"
            height="50vh"
            width="50vw"
            defaultLanguage="python"
            options={{ contextmenu: false }}
            value={questionSnippet}
            onChange={value => handleSnippetInput(value ?? '')}
          /> */}
          {questionSnippet}
          <IconButton color="error" onClick={hideSnippet}>
            <RemoveIcon />
          </IconButton>
          <Menu
            open={contextMenu !== null}
            onClose={handleContextMenuClose}
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

export default RearrangeQuestion
