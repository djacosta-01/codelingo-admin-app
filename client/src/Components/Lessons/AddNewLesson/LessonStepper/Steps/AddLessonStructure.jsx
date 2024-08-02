import { useState, useEffect } from 'react'
import { TextField, Button, Box, FormControlLabel, MenuItem, Checkbox, Select } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../../../../supabaseClient/supabaseClient'
import CheckboxSelect from '../../CheckBoxSelect'
import { Check } from '@mui/icons-material'

const AddLessonStructure = ({ prevData, setPrevData }) => {
  const [topicsFromGraph, setTopicsFromGraph] = useState([])
  const [lessonTopics, setLessonTopics] = useState(prevData.lessonTopics)
  const { className } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLessonTopics = async () => {
      const { data, error } = await supabase.from('knowledge_graph').select('nodes')
      if (error) console.error('Error fetching lesson topics: ', error)
      else setTopicsFromGraph(data[0].nodes)
    }
    fetchLessonTopics()
  }, [])

  const handleInputChange = _event => {
    setPrevData({
      ...prevData,
      [_event.target.name]: _event.target.value,
    })
  }

  const submitForm = async event => {
    event.preventDefault()
    const { lessonID, lessonName } = prevData
    console.log(lessonID)
    console.log(lessonName)
    console.log(lessonTopics)
    const { data, error } = await supabase.from('lessons').upsert(
      {
        lesson_id: lessonID,
        lesson_name: lessonName,
        lesson_topics: lessonTopics,
      },
      { onConflict: ['lesson_id'] }
    )
    if (error) {
      console.error('Error adding lesson structure: ', error)
      return
    } else {
      console.log(data)
      alert('Lesson structure added to draft')
      navigate(`/classes/${className}/add-lessons/${lessonName}`)
    }
  }

  return (
    <>
      <h1>Lesson Structure</h1>
      <form onSubmit={submitForm}>
        <TextField
          id="lesson-title-input"
          label="Lesson Title"
          margin="dense"
          variant="standard"
          name="lessonName"
          value={prevData.lessonName}
          onChange={handleInputChange}
          required
        />
        <CheckboxSelect
          topicsFromGraph={topicsFromGraph}
          lessonTopics={lessonTopics}
          setLessonTopics={setLessonTopics}
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
      {lessonTopics.join(',')}
    </>
  )
}

export default AddLessonStructure
