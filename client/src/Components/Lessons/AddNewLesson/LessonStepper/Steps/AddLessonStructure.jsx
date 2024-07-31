import { useState } from 'react'
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material'
import CheckboxSelect from '../../CheckBoxSelect'

const AddLessonStructure = ({ data, setData }) => {
  const [lessonTitle, setLessonTitle] = useState(data['lessonTitle'])
  const [numQuestions, setNumQuestions] = useState(data['numQuestions'])
  const [topicsToDisplay, setTopicsToDisplay] = useState([])

  // temporary solution. will fetch topics from the server later
  const mockTopics = [
    'Lists',
    'Strings',
    'Dictionaries',
    'Loops',
    'Functions',
    'Classes',
    'Recursion',
  ]

  const submitForm = event => {
    event.preventDefault()
    if ((data['lessonTitle'] === '' && lessonTitle === '') || topicsToDisplay.length === 0) {
      alert('Please fill in all fields')
      return
    }
    setData({ ...data, lessonTitle, numQuestions, selectedTopics: topicsToDisplay })
    alert('Lesson structure saved. You can proceed to the next step safely.')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <h1> Lesson Structure</h1>
      <Box
        id="add-lesson-structure-form"
        sx={{
          padding: 5,
          // outline: '1px dashed black',
        }}
      >
        <form onSubmit={submitForm}>
          <TextField
            id="lesson-title-input"
            label="Lesson Title"
            variant="standard"
            value={lessonTitle}
            onChange={event => setLessonTitle(event.target.value)}
            required
          />

          <CheckboxSelect
            topics={mockTopics}
            topicsPreviouslySelected={data['selectedTopics']}
            setTopicsToDisplay={setTopicsToDisplay}
          />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default AddLessonStructure
