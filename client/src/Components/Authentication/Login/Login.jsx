import logoImage from '../../../assets/logo.png'
import { useState } from 'react'
// import axios from 'axios'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom'
import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { supabase } from '../../../supabaseClient/supabaseClient.js'

const Login = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

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
    <div className="login-container">
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
      {/* <Typography
        variant="caption"
        onClick={() => alert('forgot password')}
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
      </Typography> */}
      <p>
        Don't have an account? <Link to="/register">Register Here</Link>
      </p>
    </div>
  )
}

export default Login
