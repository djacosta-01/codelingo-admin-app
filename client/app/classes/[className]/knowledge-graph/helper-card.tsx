'use client'

import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HelpIcon from '@mui/icons-material/Help'
import { keyframes } from '@mui/material'
import { useState } from 'react'

const slideIn = keyframes`
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  `

const slideOut = keyframes`
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
      `

const HelperCard = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false)

  const handleCardToggle = () => {
    if (isHelpOpen) {
      setIsHelpOpen(false)
      setTimeout(() => setIsVisible(false), 300) // Delay unmounting by 300ms to allow slideOut animation
    } else {
      setIsVisible(true)
      setIsHelpOpen(true) // Slight delay to ensure visibility state is updated
    }
  }

  return (
    <>
      {isVisible ? (
        <Card
          id="helper-card"
          sx={{
            animation: `${isHelpOpen ? slideIn : slideOut} 0.3s ease-in-out`,
            width: '18rem',
            position: 'relative',
            outline: '1px solid black',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 1,
              padding: 0,
              flexWrap: 'wrap',
              '& #close-button': {
                margin: 0,
                padding: 0,
                alignSelf: 'flex-start',
              },
            }}
          >
            <IconButton id="close-button" onClick={handleCardToggle}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Inputting your Knowledge Graph
            </Typography>
            <Typography>
              A valid knowledge graph input should satisfy the following conditions:
              <ol>
                <li>No duplicate nodes</li>
                <li>No cyles between nodes</li>
              </ol>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Controls:
            </Typography>
            <Typography>
              <ul>
                <li>Add a Node: Click Add button and enter relevant information</li>
                <li>
                  Creating an Edge: Enter edge info when adding a node or click edge source and drag
                  to desired node
                </li>
                <li>Move a Node: Click and drag</li>
                <li>Delete a Node/Edge: Click node or edge and press backspace</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Tooltip title="Help" arrow>
          <IconButton onClick={handleCardToggle}>
            <HelpIcon id="help-button" color="info" fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </>
  )
}

export default HelperCard
