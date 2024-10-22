'use client'

import { Box, TextField, Typography, Button, Alert, Fade } from '@mui/material'
import { useState } from 'react'
import { signup } from '@/app/auth/login/actions'
import Link from 'next/link'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [registrationError, setRegistrationError] = useState(false)

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('displayName', displayName)

    // checking if user signed up with LMU email
    const response = await signup(formData)
    if (response.error) {
      console.error(response.error)
      setRegistrationError(true)
    }
  }

  return (
    <Box
      id="register-container"
      sx={{
        height: '100vh',
        display: 'flex',
        gap: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Fade in={registrationError}>
        <Alert
          severity="error"
          onClose={() => {
            setRegistrationError(false)
          }}
        >
          Invalid email. Please use your LMU email.
        </Alert>
      </Fade>
      <Typography variant="h5">Register with Lion Educator Account</Typography>
      <form onSubmit={handleRegistration}>
        <Box
          id="registration-form"
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
            id="displayName"
            label="Display Name"
            name="displayName"
            variant="outlined"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={registrationError}
          />
          <TextField
            required
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Register
          </Button>
        </Box>
      </form>
      <Typography>
        Already have an account? <Link href="/">Login Here</Link>
      </Typography>
    </Box>
  )
}

export default Register
