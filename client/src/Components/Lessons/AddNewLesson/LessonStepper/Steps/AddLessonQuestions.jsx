import { Box, Select, MenuItem, Button } from '@mui/material'
import { useState } from 'react'
import MultipleChoice from '../../QuestionTypes/MultipleChoice'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const questionFormats = ['Multiple Choice', 'Matching', 'Fill in the Blank', 'Rearrange the Code']

const AddLessonQuestions = ({ prevLessonData, setLessonData }) => {
  const [questionFormat, setQuestionFormat] = useState('')
  const handlePageBasedOnQuestionFormat = format => {
    switch (format) {
      case 'Multiple Choice':
        return (
          <MultipleChoice
            topics={prevLessonData.lessonTopics}
            prevData={prevLessonData}
            setLessonData={setLessonData}
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
    <Box
      id="add-question-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        gap: 3,
        width: '50%',
        // backgroundColor: 'pink',
      }}
    >
      <Select
        id="select-question-format"
        value={questionFormat}
        onChange={event => setQuestionFormat(event.target.value)}
        displayEmpty
        renderValue={selected => (selected === '' ? 'Select Question Format' : selected)}
      >
        {questionFormats.map(format => (
          <MenuItem key={format} value={format}>
            {format}
          </MenuItem>
        ))}
      </Select>
      {handlePageBasedOnQuestionFormat(questionFormat)}
      {/* <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button id="back-button" onClick={() => alert('back button pressed')}>
          <NavigateBeforeIcon />
          Back
        </Button>
        <Button id="next-button" onClick={() => alert('next button clicked')}>
          Next
          <NavigateNextIcon />
        </Button>
      </Box> */}
      {console.log(prevLessonData)}
    </Box>
  )
}

export default AddLessonQuestions
