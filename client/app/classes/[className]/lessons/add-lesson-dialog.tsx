'use client'

import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  type SelectChangeEvent,
} from '@mui/material'
import { addLesson } from '@/app/classes/[className]/lessons/actions'

const AddLessonDialog = ({
  className,
  open,
  setOpen,
}: {
  className: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [newLessonName, setNewLessonName] = useState<string>('')
  const [lessonTopics, setLessonTopics] = useState<string[]>([])

  const handleLessonDiaglogClose = () => {
    setOpen(false)
    setNewLessonName('')
    setLessonTopics([])
  }

  const handleLessonTopicChange = (e: SelectChangeEvent<typeof lessonTopics>) => {
    setLessonTopics(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await addLesson(className, { name: newLessonName, topics: lessonTopics })
    if (response.success) {
      // handleLessonDiaglogClose()
      alert('Lesson added successfully')
    }
    // handleLessonDiaglogClose()
  }

  return (
    <Dialog open={open} PaperProps={{ component: 'form', onSubmit: submitForm }}>
      <DialogTitle>Add Lesson</DialogTitle>
      <DialogContent>
        <Box
          id="add-new-lesson-form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            gap: 2,
          }}
        >
          <TextField
            required
            autoFocus
            fullWidth
            id="name"
            label="Lesson Name"
            value={newLessonName}
            onChange={e => setNewLessonName(e.target.value)}
            // variant="standard"
          />
          <FormControl fullWidth>
            <InputLabel id="lesson-topics">Lesson Topics</InputLabel>
            <Select
              required
              multiple
              labelId="lesson-topics"
              value={lessonTopics}
              onChange={handleLessonTopicChange}
              renderValue={selected => selected.join(', ')}
              //   variant="standard"
            >
              <MenuItem value="topic 1">
                <Checkbox checked={lessonTopics.includes('topic 1')} />
                <ListItemText primary="topic 1" />
              </MenuItem>
              <MenuItem value="topic 2">
                <Checkbox checked={lessonTopics.includes('topic 2')} />
                <ListItemText primary="topic 2" />
              </MenuItem>
              <MenuItem value="topic 3">
                <Checkbox checked={lessonTopics.includes('topic 3')} />
                <ListItemText primary="topic 3" />
              </MenuItem>
              <MenuItem value="topic 4">
                <Checkbox checked={lessonTopics.includes('topic 4')} />
                <ListItemText primary="topic 4" />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleLessonDiaglogClose}>
          Cancel
        </Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddLessonDialog
