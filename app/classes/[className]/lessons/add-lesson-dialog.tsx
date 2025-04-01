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
import { createNewLesson, updateLesson } from '@/app/classes/[className]/lessons/actions'
import { Lesson } from '@/types/content.types'

const AddLessonDialog = ({
  className,
  open,
  setOpen,
  setRefreshGrid,
  prevLessonData,
  resetPrevLessonData,
}: {
  className: string
  open: boolean
  setRefreshGrid: Dispatch<SetStateAction<number>>
  setOpen: Dispatch<SetStateAction<boolean>>
  prevLessonData: Lesson | null
  resetPrevLessonData: Dispatch<SetStateAction<Lesson | null>>
}) => {
  const [lessonID, setLessonID] = useState<number>(-1)
  const [newLessonName, setNewLessonName] = useState<string>('')
  const [lessonTopics, setLessonTopics] = useState<string[]>([])
  const [buttonOperation, setButtonOperation] = useState<'Add Lesson' | 'Update Lesson'>(
    'Add Lesson'
  )

  useEffect(() => {
    if (prevLessonData) {
      const { lesson_id, name, topics } = prevLessonData
      setLessonID(lesson_id ?? -1)
      setNewLessonName(name ?? '')
      setLessonTopics(topics ?? [])
      setButtonOperation('Update Lesson')
    }
  }, [prevLessonData])

  const handleLessonDiaglogClose = () => {
    setOpen(false)
    setNewLessonName('')
    setLessonTopics([])
    setButtonOperation('Add Lesson')
    resetPrevLessonData(null)
  }

  const handleLessonTopicChange = (e: SelectChangeEvent<typeof lessonTopics>) => {
    setLessonTopics(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const addingLesson = buttonOperation === 'Add Lesson'

    const response = addingLesson
      ? await createNewLesson(className, {
          lessonName: newLessonName,
          topics: lessonTopics,
        })
      : await updateLesson(lessonID, { lessonName: newLessonName, topics: lessonTopics })

    if (response.success) {
      handleLessonDiaglogClose()
      const message = addingLesson ? 'Lesson added successfully' : 'Lesson updated successfully'
      alert(message)
      setRefreshGrid(prev => prev + 1)
      return
    }

    alert('Error adding lesson')
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
        <Button type="submit">{buttonOperation}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddLessonDialog
