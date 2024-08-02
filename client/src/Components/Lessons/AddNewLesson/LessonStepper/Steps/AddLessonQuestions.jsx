import { Box, TextField, MenuItem } from '@mui/material'
import { useState } from 'react'
import MultipleChoice from '../../QuestionTypes/MultipleChoice'

const questionFormats = ['Multiple Choice', 'Matching', 'Fill in the Blank', 'Rearrange the Code']

const AddLessonQuestions = ({ title, lessonTopics, setEnteredQuestions, setLessonData }) => {
  const [questionFormat, setQuestionFormat] = useState('')
  const handlePageBasedOnQuestionFormat = format => {
    switch (format) {
      case 'Multiple Choice':
        return (
          <MultipleChoice
            setEnteredQuestions={setEnteredQuestions}
            topics={lessonTopics}
            setQuestionData={setLessonData}
            resetQuestionFormat={setQuestionFormat}
          />
        )
      case 'Matching':
        return (
          <Box>
            <h1>Matching</h1>
          </Box>
        )
      case 'Fill in the Blank':
        return (
          <Box>
            <h1>Fill in the Blank</h1>
            <p>In development...</p>
          </Box>
        )
      case 'Rearrange the Code':
        return (
          <Box>
            <h1>Rearrange the Code</h1>
            <p>In development...</p>
          </Box>
        )
      default:
        return ''
    }
  }
  return (
    <>
      <TextField
        select
        label="Question Format"
        value={questionFormat}
        onChange={event => setQuestionFormat(event.target.value)}
      >
        {questionFormats.map((format, index) => (
          <MenuItem key={index} value={format}>
            {format}
          </MenuItem>
        ))}
      </TextField>
      {handlePageBasedOnQuestionFormat(questionFormat)}
      {}
    </>
  )
}

export default AddLessonQuestions
