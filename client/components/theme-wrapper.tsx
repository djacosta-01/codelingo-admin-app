'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, IconButton, Tooltip } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'
import { useState } from 'react'

const ToggleTheme = ({ mode, toggleMode }: { mode: 'light' | 'dark'; toggleMode: () => void }) => {
  return (
    <Box
      id="mode-toggler"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        padding: 2,
        zIndex: 10000, // so the toggle is always visible bottom left
      }}
    >
      <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
        <IconButton onClick={toggleMode}>
          {mode === 'dark' ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = createTheme({
    palette: {
      mode,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToggleTheme mode={mode} toggleMode={toggleMode} />
      {children}
    </ThemeProvider>
  )
}

export default ThemeWrapper
