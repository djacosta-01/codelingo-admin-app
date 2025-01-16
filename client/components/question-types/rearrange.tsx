'use client'

import Editor from '@monaco-editor/react'
import { Box, Menu, MenuItem, Paper, Button, IconButton } from '@mui/material'
import { useState } from 'react'
import { RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'

const RearrangeQuestion = () => {
  const [selectedText, setSelectedText] = useState('')
  const [snippetIncluded, setSnippetIncluded] = useState(false)
  const [snippet, setSnippet] = useState('')
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  const [questionPrompt, setQuestionPrompt] = useState<string>('')
  const [tokens, setTokens] = useState<string[]>([])

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString())
      setTokens(prev => [...prev, selection.toString()])
    } else {
      alert('No text selected')
      // setSelectedText('')
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

  const handleEditorChange = (value: string | undefined, event: any) => {
    setQuestionPrompt(value ?? '')
  }

  return (
    <>
      <Box onContextMenu={handleContextMenu} sx={{ cursor: 'context-menu' }}>
        {snippetIncluded ? (
          <>
            <Editor
              theme="vs-dark"
              height="50vh"
              width="50vw"
              defaultLanguage="python"
              options={{ contextmenu: false }}
              value={questionPrompt}
              onChange={(value, event) => handleEditorChange(value, event)}
            />
            <IconButton color="error" onClick={() => setSnippetIncluded(false)}>
              <RemoveIcon />
            </IconButton>
          </>
        ) : (
          <Box>
            <Button onClick={() => setSnippetIncluded(true)}>Add Snippet</Button>
          </Box>
        )}
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
          }
        >
          <MenuItem onClick={handleSelectionChange}>Create Token</MenuItem>
          <MenuItem onClick={handleClose}>Cut</MenuItem>
        </Menu>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {tokens.map((token, index) => (
          <Paper
            elevation={4}
            key={index}
            sx={{
              padding: 1,
              height: '5em',
              minWidth: `5em`,
              maxWidth: `calc(${selectedText.length}em / 2)`,
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
    </>
  )
}

export default RearrangeQuestion
