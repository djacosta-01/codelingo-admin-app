'use client'

import { Box, TextField, Typography, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { signup } from '@/app/auth/login/actions'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  return (
    <form>
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
        <Button variant="contained" formAction={signup} type="submit">
          Register
        </Button>
      </Box>
    </form>
  )
}

export default Register
