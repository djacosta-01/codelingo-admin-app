'use client'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Snackbar,
  Alert,
  Skeleton,
  useTheme,
} from '@mui/material'
import { AddCircleOutline, School } from '@mui/icons-material'
import { getClassData, createNewClass } from '@/app/classes/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'

/**
 * TODO: need to create a theme provider to handle dark mode and light mode
 * instead of doing what we are doing here with the colors
 */

// array of header colors for classes - light mode colors
const LIGHT_MODE_COLORS = [
  '#1976d2', // blue (primary)
  '#2e7d32', // green
  '#d32f2f', // red
  '#7b1fa2', // purple
  '#ed6c02', // orange
  '#0288d1', // light blue
  '#5d4037', // brown
  '#6a1b9a', // deep purple
  '#00695c', // teal
  '#c2185b', // pink
]

// array of header colors for classes - dark mode colors (slightly deeper versions)
const DARK_MODE_COLORS = [
  '#0d47a1', // darker blue
  '#1b5e20', // darker green
  '#b71c1c', // darker red
  '#4a148c', // darker purple
  '#e65100', // darker orange
  '#01579b', // darker light blue
  '#3e2723', // darker brown
  '#4a148c', // darker deep purple
  '#004d40', // darker teal
  '#880e4f', // darker pink
]

// Number of skeleton cards to show during loading
const SKELETON_COUNT = 8

const ClassesSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(SKELETON_COUNT)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <Box
              sx={{
                height: '90px',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <Skeleton
                variant="rectangular"
                height={90}
                width="100%"
                animation="wave"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                }}
              />
            </Box>
            <CardContent>
              <Skeleton
                variant="text"
                height={32}
                width="80%"
                animation="wave"
                sx={{ marginBottom: 1 }}
              />
              <Skeleton variant="text" height={20} width="90%" animation="wave" />
              <Skeleton variant="text" height={20} width="70%" animation="wave" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
const Classes = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  // Select the appropriate color array based on the theme mode
  const CLASS_HEADER_COLORS = isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS

  const [classes, setClasses] = useState<(string | null)[]>([])
  const [addClassDialogOpen, setAddClassDialogOpen] = useState<boolean>(false)
  const [newClassName, setNewClassName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success',
  })

  const router = useRouter()

  /**
   * Function to get a color for the class header based on the class name and theme mode
   *
   * @param className - The name of the class to hash
   * @param index - The index of the class in the classes array
   * @returns
   */
  const getClassColor = (className: string, index: number) => {
    // hash the class name to get a consistent color for each class
    const hashCode =
      className?.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0) || 0

    const colorByHash = CLASS_HEADER_COLORS[Math.abs(hashCode) % CLASS_HEADER_COLORS.length]
    return colorByHash
  }

  /**
   *  handlers
   */
  const handleOpenAddClassDialog = () => setAddClassDialogOpen(true)
  const handleCloseAddClassDialog = () => setAddClassDialogOpen(false)

  const handleCancelAddClass = () => {
    setNewClassName('')
    setAddClassDialogOpen(false)
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false })
  }

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      showNotification('Class name cannot be empty', 'error')
      return
    }

    if (classes.includes(newClassName)) {
      showNotification('Class already exists', 'error')
      return
    }

    try {
      const response = await createNewClass(newClassName)

      if (!response.success) {
        showNotification('Error creating class', 'error')
        return
      }

      setClasses([...classes, newClassName])
      setNewClassName('')
      setAddClassDialogOpen(false)
      showNotification('Class created successfully!', 'success')
    } catch (error) {
      showNotification('Error creating class', 'error')
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true)
      try {
        const data = await getClassData()
        setClasses(data)
      } catch (error) {
        showNotification('Error loading classes', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchClasses()
  }, [])

  /**
   * TODO: switch to Grid2 since Grid is deprecated
   */
  return (
    <>
      <NavbarWithSideMenu className="" displaySideMenu={false} />
      <Container maxWidth="lg" sx={{ marginTop: 10, marginBottom: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Classes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={handleOpenAddClassDialog}
          >
            Create New Class
          </Button>
        </Box>

        {isLoading ? (
          <ClassesSkeleton isDarkMode={isDarkMode} />
        ) : classes.length > 0 ? (
          <Grid container spacing={3}>
            {classes.map((className, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  elevation={3}
                  onMouseEnter={() => router.prefetch(`/classes/${className}/lessons`)}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDarkMode
                        ? '0 10px 20px rgba(0,0,0,0.4)'
                        : '0 10px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => router.push(`/classes/${className}/lessons`)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: getClassColor(className || '', index),
                        color: 'white',
                        width: '100%',
                        py: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <School fontSize="large" />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', width: '100%' }}>
                      <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                        {className}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to manage lessons, roster, and class content
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              borderRadius: 2,
              p: 3,
            }}
          >
            <School fontSize="large" color="disabled" sx={{ marginBottom: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No classes yet
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" marginBottom={3}>
              Create your first class to get started with Knowledge Grapht
            </Typography>
          </Box>
        )}
      </Container>

      <Dialog open={addClassDialogOpen} onClose={handleCloseAddClassDialog} fullWidth maxWidth="sm">
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <TextField
            id="class-name"
            label="Class Name"
            placeholder="e.g., CS101: Introduction to Programming"
            variant="outlined"
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
            required
            error={newClassName.trim() === ''}
            helperText={newClassName.trim() === '' ? 'Class name is required' : ''}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelAddClass} variant="text">
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={newClassName.trim() === ''}
          >
            Create Class
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.show} autoHideDuration={5000} onClose={handleCloseNotification}>
        <Alert severity={notification.type} onClose={handleCloseNotification}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Classes
