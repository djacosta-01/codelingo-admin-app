'use client'

// import Editor from '@monaco-editor/react'
// import { EditorState } from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
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
import { useState, useEffect, useRef } from 'react'
import { RemoveCircleOutline as RemoveIcon, Lock, LockOpen as Unlock } from '@mui/icons-material'
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
  const [desiredTokens, setDesiredToken] = useState({ text: '', position: [0, 0] })
  const [editorLocked, setEditorLocked] = useState(false)
  const [snippetIncluded, setSnippetIncluded] = useState(true)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  const editorRef = useRef<EditorView | null>(null)

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

  const handleEditorLoad = (view: EditorView) => {
    editorRef.current = view
  }

  const handleSnippetInput = (value: string) => {
    if (editorLocked) {
      console.log('Editor is locked')
      return
    }
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
    alert('Token creation being reworked')
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
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
        >
          <CodeMirror
            value={questionSnippet}
            onChange={editorLocked ? () => {} : handleSnippetInput}
            height="300px"
            width="700px"
            extensions={[javascript(), EditorView.editable.of(editorLocked)]}
            theme={oneDark}
            onUpdate={(viewUpdate: { view: EditorView }) => handleEditorLoad(viewUpdate.view)}
            onContextMenu={handleContextMenu}
          />

          <IconButton onClick={() => setEditorLocked(!editorLocked)}>
            {editorLocked ? <Lock /> : <Unlock />}
          </IconButton>

          <IconButton color="error" onClick={hideSnippet}>
            <RemoveIcon />
          </IconButton>
          {editorLocked ? (
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
          ) : null}
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
