import { Box, Accordion, AccordionDetails, AccordionSummary, IconButton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { supabase } from '../../supabaseClient/supabaseClient'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Lesson = () => {
  const [lessonContent, setLessonContent] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('Loading Content...')
  const { className, lessonName } = useParams()

  useEffect(() => {
    // fetching lesson content from supabase
    const fetchLessonContent = async () => {
      const response = await supabase
        .from('lessons')
        .select('questions')
        .eq('lesson_name', lessonName)
      const data = response.data
      // console.log(data)
      if (data.length === 0) {
        setLoadingMessage('Lesson Not Found')
        return
      }
      setLessonContent(data[0].questions)
      // console.log(lessonContent)
    }
    fetchLessonContent()
  }, [lessonName])

  const handleEditClick = event => {
    alert('edit button clicked')
    event.stopPropagation()
    // navigate to edit page
  }

  const handleDeleteClick = event => {
    alert('delete button clicked')
    event.stopPropagation()
    // delete lesson from database
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '64px',
        marginLeft: '65px',
      }}
    >
      <Box id="lesson-container">
        <NavbarWithSideMenu className={className} displaySideMenu={true} />
        {!lessonContent ? (
          <h1>{loadingMessage}</h1>
        ) : (
          <Box
            id="lesson-content"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <h1>{lessonName}</h1>
            {lessonContent.map((question, index) => {
              return (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  sx={{
                    width: '50%',
                    outline: '1px solid black',
                  }}
                >
                  <Box
                    id="prompt-and-buttons"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      '& :hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <AccordionSummary>
                      ({question.questionType}) {question.prompt}
                    </AccordionSummary>
                    <Box
                      id="buttons-container"
                      sx={{
                        '& #edit-question-button :hover': {
                          color: '#2688FF',
                        },
                        '& #delete-question-button :hover': {
                          color: 'red',
                        },
                      }}
                    >
                      <IconButton
                        id="edit-question-button"
                        onClick={_event => handleEditClick(_event)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        id="delete-question-button"
                        onClick={_event => handleDeleteClick(_event)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <AccordionDetails>
                    <h3>Snippet: {question.snippet}</h3>
                    <h3>Answers: {question.options.join(', ')}</h3>
                    <h3>Correct Answer: {question.answer}</h3>
                    <h3>Topics: {question.topicsCovered.join(', ')}</h3>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Lesson
