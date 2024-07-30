import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Registration.css'
// import logoImage from "./../../assets/logo.png";
import { supabase } from '../../supabaseClient/supabaseClient'

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
      alert('You have successfully signed up!')
      // TODO: redirect to like an intro page so they can learn how to use the app and set up knowledge graph and their profile
      navigate('/home')
    }
  }

  return (
    <div className="registration-container">
      <div className="registration-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
