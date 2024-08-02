import { Box, FormControlLabel, MenuItem, Checkbox, Select } from '@mui/material'
import { useState, useEffect } from 'react'

const CheckboxSelect = ({ topics, topicsPreviouslySelected }) => {
  const [selectValues, setSelectValues] = useState(topicsPreviouslySelected)
  return (
    <>
      <Select
        required
        id="relevant-topics-for-question-select"
        multiple
        displayEmpty
        value={selectValues}
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
          {topics.map((topic, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectValues.includes(topic)}
                  onChange={_event => {
                    if (selectValues.includes(topic)) {
                      setSelectValues(prev => prev.filter(id => id !== topic))
                    } else {
                      setSelectValues(prev => [...prev, topic])
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
