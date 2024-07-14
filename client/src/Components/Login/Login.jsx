import logoImage from './../../assets/logo.png'
import { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { useNavigate, Link } from 'react-router-dom'
import Registration from '../Registration/Registration.jsx'
import { supabase } from '../../supabaseClient/supabaseClient.js'

// const API_ENDPOINT = 'https://server-ivory-pi.vercel.app/api/user'

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegistration, setShowRegistration] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async event => {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert('Error logging in: ' + error.message)
    else {
      setIsLoggedIn(true)
      console.log('Login Success')
      navigate('/home')
    }
    // const username = event.target.username.value
    // const password = event.target.password.value
    // try {
    //   const response = await apiCall(username, password)
    //   if (response.data.success) {
    //     setIsLoggedIn(true)
    //     console.log('Login Success')
    //     navigate('/home')
    //   } else {
    //     console.error('Login Failed: ', response.data.message)
    //   }
    // } catch (error) {
    //   // FIXME: come back and fix this bc this is just for development
    //   // setAuthenticated(true)
    //   navigate('/home')
    //   console.error('Login failed:', error)
    // }
  }

  const toggleRegistration = () => {
    setShowRegistration(!showRegistration)
  }

  return (
    <div className="login-container">
      <img src={logoImage} alt="CodeLingo" width="200" height="200" />
      <h1>CodeLingo</h1>
      {!showRegistration ? (
        <>
          <h2>Log in to your Educator Account</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              name="email"
              placeholder="Email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              name="password"
              placeholder="Password"
            />
            <button type="submit">Log In</button>
          </form>
          <p>
            Don't have an account? <Link onClick={toggleRegistration}>Register</Link>
          </p>
        </>
      ) : (
        <>
          <h2>Register</h2>
          <Registration />
          <p>
            Already have an account? <Link onClick={toggleRegistration}>Login</Link>
          </p>
        </>
      )}
    </div>
  )
}

// const apiCall = () => {
//   axios.get(API_ENDPOINT).then(data => {
//     console.log(data)
//   })
//   // return axios.post(API_ENDPOINT, { username, password }, { withCredentials: true });
// }

export default Login
