import { useNavigate } from 'react-router-dom'

const AuthenticatedRoute = ({ children, session }) => {
  const navigate = useNavigate()
  return session ? children : navigate('/')
}

export default AuthenticatedRoute
