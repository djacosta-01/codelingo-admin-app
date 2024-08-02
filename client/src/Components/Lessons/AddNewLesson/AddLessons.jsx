import { Avatar, Box, Skeleton } from '@mui/material'
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

  useEffect(() => {
    const fetchLessonIfExists = async () => {
      if (!lessonName) {
        const { data, error } = await supabase.from('lessons').select('lesson_id')
        if (error) {
          console.error('Error fetching lesson: ', error)
          return
        }
        setLessonData(prev => ({
          ...prev,
          lessonID: data[data.length - 1].lesson_id + 1,
        }))
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
          lessonName: data[0].lesson_name,
          lessonID: data[data.length - 1].lesson_id,
          lessonTopics: data[0].lesson_topics,
          lessonQuestions: data[0].questions,
        })
      }
    }
    fetchLessonIfExists()
  }, [])

  // const [dataFromStepOne, setdataFromStepOne] = useState({
  //   lessonTitle: '',
  //   selectedTopics: [],
  // })
  const [dataFromStepTwo, setdataFromStepTwo] = useState([])
  const [enteredQuestions, setEnteredQuestions] = useState(0)
  const [isStepOneComplete, setIsStepOneComplete] = useState(false)

  const handlePageBasedOnStep = step => {
    switch (step) {
      case 2:
        return <h1>Under Construction...</h1>
      // return enteredQuestions === dataFromStepOne.numQuestions ? (
      //   <h2>All questions entered</h2>
      // ) : (
      //   <AddLessonQuestions
      //     title={dataFromStepOne['lessonTitle']}
      //     topics={dataFromStepOne['selectedTopics']}
      //     setEnteredQuestions={setEnteredQuestions}
      //     setQuestionData={setdataFromStepTwo}
      //   />
      // )
      case 3:
        return <ReviewLesson lessonTitle={lessonData.lessonName} questions={dataFromStepTwo} />
      default:
        return <AddLessonStructure data={lessonData} setData={setLessonData} />
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
          // backgroundColor: 'grey',
        }}
      >
        <Box
          id="add-lesson-content"
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'pink',
          }}
        >
          {!lessonData ? (
            <Box>
              <h1>Loading...</h1>
              {/* <Skeleton
                variant="rectangular"
                // width="70vw"
                // height="70vh"
                sx={{
                  marginTop: '64px',
                  marginLeft: '65px',
                }}
              >
                <AddLessonStructure data={lessonData} setData={setLessonData} />
              </Skeleton> */}
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
