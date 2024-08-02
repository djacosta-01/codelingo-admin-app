import { Box, FormControlLabel, MenuItem, Checkbox, Select } from '@mui/material'
import { useState } from 'react'

const CheckboxSelect = ({ topicsFromGraph, lessonTopics, setLessonTopics }) => {
  return (
    <>
      <Select
        required
        id="relevant-topics-for-question-select"
        multiple
        displayEmpty
        value={lessonTopics}
        renderValue={selected => (selected.length === 0 ? 'Select topics' : selected.join(', '))}
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
    </>
  )
}

export default CheckboxSelect
