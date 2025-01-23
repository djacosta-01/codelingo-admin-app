'use client'

import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Checkbox,
} from '@mui/material'
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import { getAllLessons } from '@/app/classes/[className]/lessons/actions'
import { Lesson } from '@/types/content.types'

const CustomToolbar = ({ page }: { page: string }) => {
  const [open, setOpen] = useState(false)
  const [userLessons, setUserLessons] = useState<Lesson[] | undefined>(undefined)
  const [lessonsToImport, setLessonsToImport] = useState<{ [key: string]: boolean }>()

  const handleDialogOpen = async () => {
    setOpen(true)

    if (userLessons) return

    const response = await getAllLessons()

    if (!response.success) {
      alert(`Error fetching lessons: , ${response.error}`)
      return
    }

    setUserLessons(response.lessons)

    const checkbox = response.lessons?.reduce((acc: { [key: string]: boolean }, { name }) => {
      acc[name] = false
      return acc
    }, {} as { [key: string]: boolean })

    setLessonsToImport(checkbox)
  }

  const handleDialogClose = () => {
    setOpen(false)
  }

  const handleAddLessonToImportList = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLessonsToImport(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  return (
    <>
      <GridToolbarContainer>
        <GridToolbarDensitySelector />
        <Tooltip title="Import a Lesson">
          <Button onClick={handleDialogOpen}>Import</Button>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        <GridToolbarExport slotProps={{ button: { variant: 'outlined' } }} />
      </GridToolbarContainer>

      <Dialog open={open}>
        <DialogTitle>Import Lesson?</DialogTitle>
        <DialogContent>
          {userLessons
            ? userLessons.map(({ name }, index) => (
                <Box key={index}>
                  <Checkbox
                    checked={lessonsToImport?.name}
                    onChange={handleAddLessonToImportList}
                    name={name}
                  />
                  {name}
                </Box>
              ))
            : 'Loading...'}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => alert('IMPORT FEATURE COMING SOON!')}>Import</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CustomToolbar
