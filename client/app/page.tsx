'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  // Typography,
  InputAdornment,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogContentText,
  Button,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import logoImage from '@/assets/logo.png'
import Image from 'next/image'
import { login } from '@/app/auth/login/actions'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function Home() {
  // const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // const navigate = useNavigate()

  // const handleDialogOpen = () => {
  //   setOpen(true)
  // }

  // const handleDialogClose = () => {
  //   setEmail('')
  //   setOpen(false)
  // }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        className="login-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          height: '100vh',
        }}
      >
        <Image src={logoImage} alt="CodeLingo" width="200" height="200" />
        <form>
          <Box
            id="form-container"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <TextField
              variant="standard"
              id="email"
              name="email"
              type="email"
              label="Email"
              value={email}
              onChange={_event => setEmail(_event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="standard"
              id="password"
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={_event => setPassword(_event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button variant="contained" formAction={login} type="submit">
                Log In
              </Button>
            </Box>
          </Box>
        </form>

        {/* Forgot Password Logic */}
        {/* <Typography
        variant="caption"
        onClick={() => handleDialogOpen()}
        sx={{
          color: 'grey',
          fontWeight: 'bold',
          ':hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
          },
        }}
      >
        Forgot Password?
      </Typography>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <DialogContentText>
              Enter your email address below and we will send you a link to reset your password.
            </DialogContentText>
            <TextField
              variant="standard"
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={_event => setEmail(_event.target.value)}
            />
          </DialogContent>
          <Button onClick={() => alert('COMING SOON...SORRY...')}>Reset Password</Button>
        </Box>
      </Dialog> */}

        {/* Registration */}
        {/* <Typography>
        Don't have an account? <Link to="/register">Register Here</Link>
      </Typography> */}
      </Box>
    </ThemeProvider>
  )
}
