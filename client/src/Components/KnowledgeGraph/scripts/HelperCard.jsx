import { Box, Card, CardContent, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import HelpIcon from '@mui/icons-material/Help'

const HelperCard = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <>
      {isHelpOpen ? (
        <Card variant="outlined" sx={{ backgroundColor: '#EAECE9' }}>
          <Box
            id="help-container"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              '& > :not(style)': {
                m: 0,
                // padding: 1,
                width: '40ch',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={() => setIsHelpOpen(!isHelpOpen)}>X</IconButton>
                <h2>How to Input Your Knowledge Graph</h2>
              </Box>

              <h3>Input Format:</h3>
              <ol>
                <li>
                  Levels: Indicate each level using '== Level X ==', where X is the level number.
                </li>
                <li>
                  {`Nodes and Relationships: Specify relationships between nodes using '-->'
                      symbol.`}
                </li>
              </ol>
              <h3>Steps to Input Your Knowledge Graph</h3>
              <ol>
                <li>Start with Level 1: List nodes and their relationships within each level.</li>
                <li>
                  Continue with Subsequent Levels: Define nodes and their relationships for each
                  subsequent level.
                </li>
                <li>Ensure there are no cycles within your knowledge graph</li>
              </ol>
            </CardContent>
          </Box>
        </Card>
      ) : (
        <Tooltip title="Help" arrow>
          <IconButton onClick={() => setIsHelpOpen(!isHelpOpen)}>
            <HelpIcon id="help-button" color="info" />
          </IconButton>
        </Tooltip>
      )}
    </>
  )
}

export default HelperCard
