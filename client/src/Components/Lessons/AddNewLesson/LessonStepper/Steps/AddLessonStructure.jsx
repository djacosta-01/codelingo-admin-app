import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Select,
  Tooltip,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../../../../supabaseClient/supabaseClient'

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
        is_draft: prevData.isDraft,
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
        <Select
          required
          id="relevant-topics-for-question-select"
          multiple
          displayEmpty
          value={lessonTopics}
          renderValue={selected =>
            selected?.length === 0 ? 'Select Lesson Topics' : selected?.join(', ')
          }
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <MenuItem>
              <em>Select topics</em>
            </MenuItem>
            {topicsFromGraph.map((topic, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={lessonTopics.includes(topic)}
                    onChange={_event => {
                      if (lessonTopics.includes(topic)) {
                        setLessonTopics(prev => prev.filter(id => id !== topic))
                      } else {
                        setLessonTopics(prev => [...prev, topic])
                      }
                    }}
                    name={topic}
                  />
                }
                label={topic}
              />
            ))}
          </Box>
        </Select>
        <Box id="save-button">
          <Tooltip title="Save Structure" arrow>
            <Button type="submit" variant="contained">
              <CheckIcon />
            </Button>
          </Tooltip>
        </Box>
      </form>
    </>
  )
}

export default AddLessonStructure
