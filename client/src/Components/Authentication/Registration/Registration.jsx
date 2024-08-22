import { useState } from 'react'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, InputAdornment } from '@mui/material'
// import './Registration.css'
import logoImage from '../../../assets/logo.png'
import { supabase } from '../../../supabaseClient/supabaseClient'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { displayName: formData.username },
      },
    })
    if (error) alert('Error signing up: ' + error.message)
    else {
      // const { error } = await supabase.from('professors').insert([{
      alert('You have successfully signed up! Please check your email to confirm your account')
      // TODO: redirect to like an intro page so they can learn how to use the app and set up knowledge graph and their profile
      navigate('/')
    }
  }

  return (
    <Box
      sx={{
        // backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img src={logoImage} alt="CodeLingo" width="200" height="200" />
      <h2>Create your Account</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          name="username"
          type="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="off"
        />
        <TextField
          variant="standard"
          name="email"
          type="email"
          value={formData.email}
          label="Email"
          onChange={handleChange}
          autoComplete="off"
        />
        <TextField
          variant="standard"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
        />
        <button type="submit">Register</button>
      </form>
    </Box>
  )
}

export default Register
