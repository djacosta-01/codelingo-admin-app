import { Box } from '@mui/material'
import { useState } from 'react'
import LessonStepper from './LessonStepper/LessonStepper'
import AddLessonStructure from './LessonStepper/Steps/AddLessonStructure'
import AddLessonQuestions from './LessonStepper/Steps/AddLessonQuestions'
import ReviewLesson from './LessonStepper/Steps/ReviewLesson'
import NavbarWithSideMenu from '../../NavbarAndSideMenu/NavbarWithSideMenu'

const AddLessons = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [dataFromStepOne, setdataFromStepOne] = useState({
    lessonTitle: '',
    numQuestions: 0,
    selectedTopics: [],
  })
  const [dataFromStepTwo, setdataFromStepTwo] = useState([])
  const [enteredQuestions, setEnteredQuestions] = useState(0)
  // const [isStepOneComplete, setIsStepOneComplete] = useState(false)

  const handlePageBasedOnStep = step => {
    switch (step) {
      case 2:
        return enteredQuestions === dataFromStepOne.numQuestions ? (
          <h2>All questions entered</h2>
        ) : (
          <>
            {/* <div>{`Questions entered: ${enteredQuestions}/${dataFromStepOne.numQuestions}`}</div> */}
            <AddLessonQuestions
              title={dataFromStepOne['lessonTitle']}
              topics={dataFromStepOne['selectedTopics']}
              setEnteredQuestions={setEnteredQuestions}
              setQuestionData={setdataFromStepTwo}
            />
          </>
        )
      case 3:
        return (
          <ReviewLesson lessonTitle={dataFromStepOne.lessonTitle} questions={dataFromStepTwo} />
        )
      default:
        return <AddLessonStructure data={dataFromStepOne} setData={setdataFromStepOne} />
    }
  }
  return (
    <>
      <NavbarWithSideMenu displaySideMenu={false} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // // alignItems: 'center',
          marginTop: '64px',
          // backgroundColor: 'coral',
          minHeight: '90vh',
        }}
      >
        {handlePageBasedOnStep(activeStep)}
        <LessonStepper activeStep={activeStep} setActiveStep={setActiveStep} />
      </Box>
    </>
  )
}

export default AddLessons
