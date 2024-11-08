'use client'

import {
  Box,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { AddCircleOutline, QrCode2 } from '@mui/icons-material'
import { getClassData, createNewClass } from '@/app/classes/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'

const Classes = () => {
  const [classes, setClasses] = useState<(string | null)[]>([])
  const [addClassDialogOpen, setAddClassDialogOpen] = useState<boolean>(false)
  const [newClassName, setNewClassName] = useState<string>('')

  const handleOpenAddClassDialog = () => setAddClassDialogOpen(true)

  const handleCloseAddClassDialog = () => setAddClassDialogOpen(false)
  const handleCancelAddClass = () => {
    setNewClassName('')
    setAddClassDialogOpen(false)
  }

  const handleCreateClass = async () => {
    if (!newClassName) {
      alert('Class name cannot be empty')
      return
    }

    if (classes.includes(newClassName)) {
      alert('Class already exists')
      return
    }

    const response = await createNewClass(newClassName)

    if (!response.success) {
      alert('Error creating class')
      return
    }

    setClasses([...classes, newClassName])
    setNewClassName('')
    setAddClassDialogOpen(false)
    alert('Class created successfully!')
  }

  const router = useRouter()

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getClassData()
      setClasses(data)
    }
    fetchClasses()
  }, [])

  return (
    <>
      <NavbarWithSideMenu className="" displaySideMenu={false} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          id="classes"
          sx={{
            // look into css breakpoints so each row always has 4 classes
            marginTop: '80px',
            marginLeft: '80px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            // backgroundColor: 'pink',
            maxWidth: '60%',
          }}
        >
          {[...classes].map((className, index) => (
            <Paper
              key={index}
              onMouseEnter={() => router.prefetch(`/classes/${className}/lessons`)}
              onClick={() => {
                router.push(`/classes/${className}/lessons`)
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '15em',
                height: '10em',
                margin: 3,
                outline: '1px solid black',
                transition: 'ease-in-out 0.2s',
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                  textDecoration: 'underline',
                },
              }}
            >
              {className}
            </Paper>
          ))}
          <Box id="add-class-button" sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            <Tooltip title="Create New Class">
              <IconButton onClick={handleOpenAddClassDialog}>
                <AddCircleOutline fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
          <Dialog open={addClassDialogOpen} onClose={handleCloseAddClassDialog}>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogContent>
              <TextField
                id="class-name"
                label="Class Name"
                variant="outlined"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelAddClass}>Cancel</Button>
              <Button onClick={handleCreateClass}>Create</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default Classes
