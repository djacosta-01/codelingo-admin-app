'use client'

import { Box, Button, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { QrCode2 as QRCode } from '@mui/icons-material'
import { deleteClass } from '@/app/classes/[className]/class-settings/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ClassSettings = ({ params: { className } }: { params: { className: string } }) => {
  const router = useRouter()
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)

  const handleConfimationDialogOpen = () => {
    setConfirmationDialogOpen(true)
  }

  const handleConfimationDialogClose = () => {
    setConfirmationDialogOpen(false)
  }

  const handleDeleteClass = async () => {
    const cleanedClassName = className.replace(/%20/g, ' ')
    console.log('Deleting class...', cleanedClassName)

    const response = await deleteClass(cleanedClassName)

    if (response.success) {
      console.log('Class deleted successfully')
      router.push('/classes')
    } else {
      console.error('Error deleting class: ', response.error)
    }
  }

  return (
    <>
      <Box>QRCode functionality not implemented yet</Box>
      <QRCode fontSize="large" />
      <Box>
        <Button variant="contained" onClick={handleConfimationDialogOpen} color="error">
          DELETE CLASS
        </Button>
        <Dialog open={confirmationDialogOpen}>
          <DialogTitle>Are you sure you want to delete this class?</DialogTitle>
          <DialogActions>
            <Button onClick={handleConfimationDialogClose}>Cancel</Button>
            <Button onClick={handleDeleteClass} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ClassSettings
