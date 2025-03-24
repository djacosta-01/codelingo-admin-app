'use client'

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  QrCode2 as QRCodeIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { deleteClass } from '@/app/classes/[className]/class-settings/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ClassSettings = ({ params: { className } }: { params: { className: string } }) => {
  const router = useRouter()
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [decodedClassName, setDecodedClassName] = useState<string>('')
  const [classSettings, setClassSettings] = useState({
    notifications: true,
    autoGrading: false,
    shareableLink: `${
      typeof window !== 'undefined' ? window.location.origin : ''
    }/join-class?code=${encodeURIComponent(className)}`,
  })
  const [editingClassName, setEditingClassName] = useState<boolean>(false)
  const [newClassName, setNewClassName] = useState<string>('')

  useEffect(() => {
    // TODO: fix this
    const decoded = decodeURIComponent(className).replace(/%20/g, ' ')
    setDecodedClassName(decoded)
    setNewClassName(decoded)
  }, [className])

  const handleConfirmationDialogOpen = () => {
    setConfirmationDialogOpen(true)
  }

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false)
  }

  const handleDeleteClass = async () => {
    try {
      const response = await deleteClass(decodedClassName)

      if (response.success) {
        showSnackbar('Class deleted successfully')
        router.replace('/classes')
      } else {
        showSnackbar(`Error deleting class: ${response.error}`)
      }
    } catch (error) {
      showSnackbar(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    setConfirmationDialogOpen(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(classSettings.shareableLink)
    showSnackbar('Class link copied to clipboard!')
  }

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setClassSettings({
      ...classSettings,
      [setting]: value,
    })
    showSnackbar(`Setting updated: ${setting} is now ${value ? 'enabled' : 'disabled'}`)
  }

  const startEditingClassName = () => {
    setEditingClassName(true)
  }

  const saveClassName = () => {
    // TODO: implement the server action to update the class name
    setEditingClassName(false)
    showSnackbar('Class name updated successfully')
    // This would require implementation of the updateClassName server action
    // Then redirect to the new URL or refresh the page
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Class Settings
          </Typography>
          {!editingClassName ? (
            <Typography variant="h5" display="flex" alignItems="center">
              {decodedClassName}
              <IconButton
                color="primary"
                onClick={startEditingClassName}
                size="small"
                sx={{ ml: 1 }}
              >
                <EditIcon />
              </IconButton>
            </Typography>
          ) : (
            <Box display="flex" alignItems="center">
              <TextField
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                variant="outlined"
                size="small"
              />
              <IconButton color="primary" onClick={saveClassName} sx={{ ml: 1 }}>
                <SaveIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Class Information Section */}
          <Grid item xs={12} md={6}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <SettingsIcon sx={{ mr: 1 }} /> General Settings
                </Typography>

                <Box mt={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={classSettings.notifications}
                        onChange={e => handleSettingChange('notifications', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
                    Receive email notifications when students submit assignments
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={classSettings.autoGrading}
                        onChange={e => handleSettingChange('autoGrading', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Auto-grading"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Automatically grade multiple-choice questions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* QR Code Section */}
          <Grid item xs={12} md={6}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <QRCodeIcon sx={{ mr: 1 }} /> Class Invitation
                </Typography>

                <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Placeholder QR code icon */}
                  <QRCodeIcon sx={{ fontSize: 150, opacity: 0.7 }} />
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    QR Code functionality not implemented yet
                  </Typography>
                </Box>

                <Box mt={3} width="100%">
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={classSettings.shareableLink}
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={handleCopyLink} color="primary">
                              <CopyIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Danger Zone */}
        <Box mt={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffdddd', borderRadius: 1 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1">Delete this class</Typography>
                <Typography variant="body2" color="textSecondary">
                  Once you delete a class, there is no going back. Please be certain.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleConfirmationDialogOpen}
              >
                Delete Class
              </Button>
            </Box>
          </Paper>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogClose}>
        <DialogTitle>Are you sure you want to delete this class?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{decodedClassName}</strong> and all associated
            data, including lessons, assignments, and student records. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteClass} color="error" startIcon={<DeleteIcon />}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ClassSettings
