'use client'

import { Box, Menu, MenuItem, Paper } from '@mui/material'
import { useState } from 'react'

const RearrangeQuestion = () => {
  const [selectedText, setSelectedText] = useState('')
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null)
  const [tokens, setTokens] = useState<string[]>([])

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    // alert('selection: ' + selection)
    if (selection && selection.toString()) {
      setSelectedText(selection.toString())
    } else {
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
    <Box onContextMenu={handleContextMenu} sx={{ cursor: 'context-menu' }}>
      <p>Select some text below:</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={handleSelectionChange}>Show Selected Text</MenuItem>
        <MenuItem onClick={handleClose}>Cut</MenuItem>
      </Menu>
      <Box
        sx={
          {
            // height: '5em',
            // minWidth: `5em`,
            // maxWidth: `calc(${selectedText.length}em / 2)`,
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
          }
        }
      >
        {/* {tokens.map((token, index) => (
          <Paper key={index} sx={{ padding: 1, margin: 1 }}>
            {token}
          </Paper>
        ))} */}
        <Paper
          elevation={4}
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
          <p>{selectedText}</p>
        </Paper>
      </Box>
    </Box>
  )
}

export default RearrangeQuestion
