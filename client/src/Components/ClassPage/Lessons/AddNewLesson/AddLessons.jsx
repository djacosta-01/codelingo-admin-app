import { Box } from '@mui/material'
import { useState } from 'react'
import LessonStepper from './LessonStepper'
import AddLessonStructure from './ChildComponents/AddLessonStructure'
import AddLessonQuestions from './ChildComponents/AddLessonQuestions'

// switch to Review Component later
const Step3Test = () => {
  return (
    <>
      <h1>Step 3</h1>
      <p>Review and confirm lesson page goes here</p>
    </>
  )
}

const AddLessons = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [dataFromStepOne, setdataFromStepOne] = useState({
    lessonTitle: '',
    numQuestions: 1,
    selectedTopics: [],
  })
  const [dataFromStepTwo, setdataFromStepTwo] = useState([{}])
  const [enteredQuestions, setEnteredQuestions] = useState(0)
  // const [isStepOneComplete, setIsStepOneComplete] = useState(false)

  const handlePageBasedOnStep = step => {
    switch (step) {
      case 2:
        return enteredQuestions === dataFromStepOne.numQuestions ? (
          <h2>All questions entered</h2>
        ) : (
          <>
            <div>{`Questions entered: ${enteredQuestions}/${dataFromStepOne.numQuestions}`}</div>
            <AddLessonQuestions
              title={dataFromStepOne['lessonTitle']}
              topics={dataFromStepOne['selectedTopics']}
              setEnteredQuestions={setEnteredQuestions}
              setQuestionData={setdataFromStepTwo}
            />
          </>
        )
      case 3:
        return <Step3Test />
      default:
        return <AddLessonStructure data={dataFromStepOne} setData={setdataFromStepOne} />
    }
  }
  return (
    <>
      {handlePageBasedOnStep(activeStep)}
      <LessonStepper activeStep={activeStep} setActiveStep={setActiveStep} />
    </>
  )
}

export default AddLessons
