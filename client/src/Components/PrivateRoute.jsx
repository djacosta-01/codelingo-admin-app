import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const AuthenticatedRoute = ({ children, session }) => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // this simply handles when the session becomes a promise object and prevents unauthenticated users from getting a glimpse of protected routes
  useEffect(() => {
    const checkIfSessionExists = async () => {
      if (session) {
        const resolvedSession = await session
        // TODO: add link to go back to login instead of just doing it automatically
        if (!resolvedSession) navigate('/') // session doesn't exist
        else setLoading(false) // session exists
      } else {
        setLoading(false)
        navigate('/')
      }
    }
    checkIfSessionExists()
  }, [session, navigate])

  if (loading) {
    return <h1>Loading...</h1>
  }
  return children
}

export default AuthenticatedRoute
