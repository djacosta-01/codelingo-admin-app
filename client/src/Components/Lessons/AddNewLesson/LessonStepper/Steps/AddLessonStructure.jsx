import { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import CheckboxSelect from '../../CheckBoxSelect'
import { supabase } from '../../../../../supabaseClient/supabaseClient'

const AddLessonStructure = ({ data, setData }) => {
  const [lessonTopics, setLessonTopics] = useState([])
  // const [topicsToDisplay, setTopicsToDisplay] = useState([])
  console.log('data')
  console.log(data)

  useEffect(() => {
    const fetchLessonTopics = async () => {
      const { data, error } = await supabase.from('knowledge_graph').select('nodes')
      if (error) console.error('Error fetching lesson topics: ', error)
      else setLessonTopics(data[0].nodes)
    }
    fetchLessonTopics()
  }, [])

  const handleInputChange = _event => {
    setData({
      ...data,
      [_event.target.name]: _event.target.value,
    })
  }

  const submitForm = event => {
    event.preventDefault()
    alert('functionality not implemented yet')
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
          name="lessonName"
          value={data.lessonName}
          onChange={handleInputChange}
          required
        />
        <CheckboxSelect
          topics={lessonTopics}
          topicsPreviouslySelected={data.lessonTopics}
          // setTopicsToDisplay={setTopicsToDisplay}
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
      {/* {data.lessonName} */}
    </>
  )
}

export default AddLessonStructure
