import { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import CheckboxSelect from '../../CheckBoxSelect'
import { supabase } from '../../../../../supabaseClient/supabaseClient'

const AddLessonStructure = ({ data, setData }) => {
  const [lessonTitle, setLessonTitle] = useState(data['lessonTitle'])
  const [lessonTopics, setLessonTopics] = useState([])
  const [topicsToDisplay, setTopicsToDisplay] = useState([])

  useEffect(() => {
    const fetchLessonTopics = async () => {
      const { data, error } = await supabase.from('knowledge_graph').select('nodes')
      // console.log(data)
      if (error) console.error('Error fetching lesson topics: ', error)
      else setLessonTopics(data[0].nodes)
    }
    fetchLessonTopics()
  }, [])

  const submitForm = event => {
    event.preventDefault()
    console.log('saving lesson structure')
  }

  return (
    <>
      <h1> Lesson Structure</h1>
      <form onSubmit={submitForm}>
        <TextField
          id="lesson-title-input"
          label="Lesson Title"
          margin="dense"
          variant="standard"
          value={lessonTitle}
          onChange={event => setLessonTitle(event.target.value)}
          required
        />
        <CheckboxSelect
          topics={lessonTopics}
          topicsPreviouslySelected={data['selectedTopics']}
          setTopicsToDisplay={setTopicsToDisplay}
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </>
  )
}

export default AddLessonStructure
