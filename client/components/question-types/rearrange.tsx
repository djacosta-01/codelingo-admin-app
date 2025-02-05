'use client'

import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
// import { python } from '@codemirror/lang-python'
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { Lock, LockOpen as Unlock } from '@mui/icons-material'
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

interface Token {
  text: string
  position: [number, number]
  range?: number[]
}

const RearrangeQuestion = () => {
  const editorRef = useRef<EditorView | null>(null)
  const [desiredTokens, setDesiredTokens] = useState<Token[]>([])
  const [editorLocked, setEditorLocked] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  const [distractorTokenDialogue, setDistractorTokenDialogue] = useState(false)
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
    setQuestionSnippet(value)
    setCorrectAnswer(value)
  }

  const handleTokenCreation = (distractor?: boolean) => {
    if (!editorRef.current) return

    if (distractor) {
      alert('distractor token feature coming soon...')
      return
    }

    const view = editorRef.current
    const state = view.state

    const { from: startIndex, to: endIndex } = state.selection.main
    const selectedText = state.sliceDoc(startIndex, endIndex)

    if (selectedText.trim().length === 0) {
      alert('No text selected. Please select a range of text to create a token')
      return
    }

    const range = [...Array(endIndex - startIndex)].map((_, i) => startIndex + i)

    if (handleTokenOverlapDetection(range)) {
      alert('Token overlap detected. Please select a different range of text')
      return
    }

    setDesiredTokens([
      ...desiredTokens,
      { text: selectedText, position: [startIndex, endIndex], range },
    ])
  }

  const handleTokenOverlapDetection = (tokenCandidatePosition: number[]) => {
    return desiredTokens.some(({ range }) => {
      if (!range) return false
      return range.some(index => tokenCandidatePosition.includes(index))
    })
  }

  const handleTokenReset = () => {
    // TODO: get rid of one of these
    setDesiredTokens([])
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
      <Box
        onContextMenu={handleContextMenu}
        sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
      >
        <CodeMirror
          value={questionSnippet}
          onChange={handleSnippetInput}
          height="300px"
          width="700px"
          extensions={[javascript(), EditorView.editable.of(!editorLocked)]}
          theme={oneDark}
          onUpdate={(viewUpdate: { view: EditorView }) => handleEditorLoad(viewUpdate.view)}
          onContextMenu={handleContextMenu}
        />

        <Tooltip title={editorLocked ? 'Editor is Locked' : 'Editor is Unlocked'}>
          <IconButton onClick={() => setEditorLocked(!editorLocked)}>
            {editorLocked ? <Lock /> : <Unlock />}
          </IconButton>
        </Tooltip>

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
            <MenuItem onClick={() => handleTokenCreation}>Create Token</MenuItem>
          </Menu>
        ) : null}
      </Box>
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        {desiredTokens.map(({ text }, index) => (
          <Paper key={index} elevation={4} sx={{ wrap: 'flexWrap', height: '3rem', padding: 1 }}>
            {text}
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button onClick={() => setDistractorTokenDialogue(true)}>Add Distractor Tokens</Button>

        <Button color="error" onClick={handleTokenReset}>
          CLEAR
        </Button>
      </Box>

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
      <Dialog open={distractorTokenDialogue}>
        <DialogTitle>Add Distractor Token</DialogTitle>
        <DialogContent>
          These tokens should serve as "misdirection" for the student. They should be similar to the
          correct answer, but not quite. The purpose of these tokens is to make the question more
          challenging for the student and to test their understanding of the material.
          <TextField
            autoFocus
            required
            multiline
            rows={4}
            placeholder="Enter your distractor token"
            label="Distractor Token"
            variant="standard"
            sx={{ width: '30rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTokenCreation(true)}>Add Distractor Token</Button>
          <Button onClick={() => setDistractorTokenDialogue(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RearrangeQuestion
