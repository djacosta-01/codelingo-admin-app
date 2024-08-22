import logoImage from '../../../assets/logo.png'
import { useState } from 'react'
// import axios from 'axios'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom'
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
import { supabase } from '../../../supabaseClient/supabaseClient.js'

const Login = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleDialogClose = () => {
    setEmail('')
    setOpen(false)
  }
  const handlePasswordReset = async () => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })
  }
  const handleSubmit = async event => {
    event.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('Error logging in: ' + error.message)
      console.log(error)
    } else {
      // setIsLoggedIn(true)
      // console.log('Login Success')
      navigate('/')
    }
  }

  return (
    <Box className="login-container" sx={{ display: 'flex', gap: 2 }}>
      <img src={logoImage} alt="CodeLingo" width="200" height="200" />
      <h2>Log in to your Educator Account</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={_event => setEmail(_event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle fontSize="small" sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="standard"
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={_event => setPassword(_event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
        />
        <button type="submit">Log In</button>
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
          <Button onClick={() => alert('button clicked')}>Reset Password</Button>
        </Box>
      </Dialog> */}
      {/* Registration */}
      <Typography>
        Don't have an account? <Link to="/register">Register Here</Link>
      </Typography>
    </Box>
  )
}

export default Login
