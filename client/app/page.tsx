'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import logoImage from '@/assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { login } from '@/app/auth/login/actions'

export default function Login() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleDialogClose = () => {
    setEmail('')
    setOpen(false)
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const response = await login(formData)

    if (response?.error) {
      alert(response.error)
      return
    }
  }

  return (
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
      <form onSubmit={handleLogin}>
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
            required
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
            required
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
            <Button variant="contained" type="submit">
              Log In
            </Button>
          </Box>
        </Box>
      </form>

      <Typography
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
      </Dialog>
      <Typography>
        {`Don't have an account?`} <Link href="/register">Register Here</Link>
      </Typography>
    </Box>
  )
}
