import NewClass from './NewClass.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu.jsx'
import { supabase } from '../../supabaseClient/supabaseClient.js'

const Home = () => {
  const [classes, setClasses] = useState([])
  const [user, setUser] = useState(null) // should probably put this in a context
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error fetching user: ', userError)
        return
      }

      setUser(user.user)
      const { data, error } = await supabase.from('professor_courses').select('class_id')
      if (error) {
        console.error('Error fetching classes: ', error)
        return
      }

      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('name')
        .in(
          'class_id',
          data.map(d => d.class_id)
        )
      if (classesError) {
        console.error('Error fetching classes: ', classesError)
        return
      }
      // console.log('user')
      // console.log(user.user)
      setClasses(classes)
    }
    fetchClasses()
  }, [])

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={false} />
      <Box id="class-container" sx={{ marginTop: '80px' }}>
        {!user ? (
          ''
        ) : (
          <Typography variant="h4">{`${user.user_metadata.username}'s Classes`}</Typography>
        )}
        {!user || classes.length === 0 ? (
          <Typography variant="h3">Loading...</Typography>
        ) : (
          <Box
            id="classes"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {classes.map((classItem, index) => (
              <Paper
                key={index}
                onClick={() => navigate(`/classes/${classItem.name}/lessons`)}
                sx={{
                  width: '25ch',
                  height: '20ch',
                  margin: 5,
                  padding: 1,
                  outline: '1px solid black',
                  '&:hover': {
                    cursor: 'pointer',
                    transform: 'scale(1.05)',
                    transition: 'all 0.3s',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  },
                }}
              >
                {classItem.name}
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </>
  )
}

export default Home
