import NewClass from './NewClass.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper } from '@mui/material'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu.jsx'
import { supabase } from '../../supabaseClient/supabaseClient.js'
// import { handle } from "express/lib/application";

// interface Props {
//   items: { id: string; title: string; backgroundImage: string }[]
//   heading: string
//   onSelectItem: (item: { id: string; title: string; backgroundImage: string }) => void
// }

const Home = () => {
  // const [selectedIndex, setSelectedIndex] = useState(-1)
  // const [isNewClassActive, setIsNewClassActive] = useState(false)
  // const [newItems, setNewItems] = useState(items) // State for managing updated items list
  // const navigate = useNavigate()

  // const handleNewClass = newItem => {
  //   // Function to handle creating a new class
  //   setNewItems([...newItems, newItem]) // Add new item to the list
  //   setIsNewClassActive(false) // Close the NewClass form after creation
  // }

  // const navigateToLessonsPage = (className: string) => {
  //   // className = className.toLowerCase().replace(/\s+/g, '')
  //   navigate(`/classes/${className}/lessons`)
  // }

  const [classes, setClasses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
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
      // console.log('user')
      // console.log(user.user.id)
      console.log('data')
      console.log(data)
      console.log('classes')
      console.log(classes)
      setClasses(classes)
    }
    fetchClasses()
  }, [])

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={false} />

      <Box className="container" sx={{ marginTop: '65px' }}>
        <h1>CLASSES</h1>
        {classes.map((classItem, index) => {
          return (
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
                  transition: 'all',
                  transitionDuration: '0.3s',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            >
              {classItem.name}
            </Paper>
          )
        })}
        {/* {items.map((item, index) => (
          // Make this a paper component
          <a
            // href={`/class/${item.id}`}
            className={`list-group-item ${selectedIndex === index ? 'active' : ''}`}
            key={item.id}
            onClick={() => {
              // setSelectedIndex(index)
              // onSelectItem(item)
              // navigate(`/lessons?query=${item.title}`)
              navigateToLessonsPage(item.title)
            }}
            style={{ backgroundImage: `url(${item.backgroundImage})` }}
          >
            <span>{item.title}</span>
          </a>
        ))}
        {isNewClassActive && <NewClass onSubmit={handleNewClass} />}
        <a href="#" className="new-class-button" onClick={() => setIsNewClassActive(true)}>
          New Class
        </a> */}
      </Box>
    </>
  )
}

export default Home
