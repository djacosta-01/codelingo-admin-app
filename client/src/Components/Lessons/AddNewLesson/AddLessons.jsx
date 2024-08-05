import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../../supabaseClient/supabaseClient'
import LessonStepper from './LessonStepper/LessonStepper'
import AddLessonStructure from './LessonStepper/Steps/AddLessonStructure'
import AddLessonQuestions from './LessonStepper/Steps/AddLessonQuestions'
import ReviewLesson from './LessonStepper/Steps/ReviewLesson'
import NavbarWithSideMenu from '../../NavbarAndSideMenu/NavbarWithSideMenu'

const AddLessons = () => {
  const { lessonName } = useParams()
  const [activeStep, setActiveStep] = useState(1)
  const [lessonData, setLessonData] = useState(null)
  const [enteredQuestions, setEnteredQuestions] = useState(0)

  useEffect(() => {
    const fetchLessonIfExists = async () => {
      // no lesson name means we are creating a new lesson
      console.log('in use effect')
      if (!lessonName) {
        const { data, error } = await supabase.from('lessons').select('lesson_id')
        if (error) {
          console.error('Error fetching lesson: ', error)
          return
        }
        setLessonData({
          isDraft: true,
          lessonID: data.length + 1,
          lessonName: '',
          lessonTopics: [],
          lessonQuestions: [],
        })
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('lesson_name', lessonName)
        if (error) {
          console.error('Error fetching lesson: ', error)
          return
        }
        setLessonData({
          isDraft: data[0].is_draft,
          lessonID: data[data.length - 1].lesson_id,
          lessonName: data[0].lesson_name,
          lessonTopics: data[0].lesson_topics,
          lessonQuestions: data[0].questions ?? [],
        })
      }
    }
    fetchLessonIfExists()
  }, [activeStep, lessonName, enteredQuestions])

  // const [isStepOneComplete, setIsStepOneComplete] = useState(false)

  const handlePageBasedOnStep = step => {
    switch (step) {
      case 2:
        return (
          <AddLessonQuestions
            prevLessonData={lessonData}
            setLessonData={setLessonData}
            // enteredQuestions={enteredQuestions}
            // setEnteredQuestions={setEnteredQuestions}
          />
        )

      case 3:
        return <ReviewLesson lessonTitle={lessonData.lessonName} questions={lessonData.questions} />
      default:
        return <AddLessonStructure prevData={lessonData} setPrevData={setLessonData} />
    }
  }
  return (
    <>
      <NavbarWithSideMenu displaySideMenu={false} />
      <Box
        id="add-lesson-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          id="add-lesson-content"
          sx={{
            display: 'flex',
            flex: 1,
            marginTop: '64px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'pink',
          }}
        >
          {!lessonData ? (
            <Box>
              <h1>Loading...</h1>
            </Box>
          ) : (
            handlePageBasedOnStep(activeStep)
          )}
        </Box>
        <LessonStepper activeStep={activeStep} setActiveStep={setActiveStep} />
      </Box>
    </>
  )
}

export default AddLessons
