'use client'

import { useState, useEffect } from 'react'

import {
  Grid2 as Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  styled,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material'

import { determineReviewTopics } from './actions'

interface TopicData {
  id: string
  name: string
  averageScore: number
  masteryThreshold: number
  description?: string
  weakAreas?: string[]
}

// Mock data
const mockTopics: TopicData[] = [
  {
    id: '1',
    name: 'Variables',
    averageScore: 0.85,
    masteryThreshold: 0.7,
    description: 'Understanding of variable declaration and scope',
    weakAreas: ['Scope hoisting', 'const vs let'],
  },
  {
    id: '2',
    name: 'Functions',
    averageScore: 0.65,
    masteryThreshold: 0.7,
    description: 'Function declaration and usage',
    weakAreas: ['Arrow functions', 'Callbacks'],
  },
  {
    id: '3',
    name: 'Arrays',
    averageScore: 0.75,
    masteryThreshold: 0.7,
    description: 'Array methods and manipulation',
    weakAreas: ['reduce method', 'Array destructuring'],
  },
  {
    id: '4',
    name: 'Objects',
    averageScore: 0.55,
    masteryThreshold: 0.7,
    description: 'Object-oriented programming concepts',
    weakAreas: ['Prototypes', 'this keyword'],
  },
  {
    id: '5',
    name: 'Loops',
    averageScore: 0.9,
    masteryThreshold: 0.7,
    description: 'Different types of loops and iterations',
    weakAreas: [],
  },
  {
    id: '6',
    name: 'DOM',
    averageScore: 0.6,
    masteryThreshold: 0.7,
    description: 'DOM manipulation and events',
    weakAreas: ['Event bubbling', 'DOM traversal'],
  },
]

// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}))

const TopicScore = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

const ClassPerformance = () => {
  const [sortBy, setSortBy] = useState('name')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [topicsToReview, setTopicsToReview] = useState<TopicData[]>([])

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value)
  }

  const handleQueryTopics = () => {
    // Simulate API response by filtering topics below or near threshold
    const topicsNeedingReview = mockTopics
      .filter(topic => topic.averageScore <= topic.masteryThreshold)
      .sort((a, b) => a.averageScore - b.averageScore)

    setTopicsToReview(topicsNeedingReview)
    setDialogOpen(true)
  }

  const getUrgencyLevel = (score: number, threshold: number) => {
    if (score < threshold * 0.7) return { label: 'High Priority', color: 'error' }
    if (score < threshold * 0.85) return { label: 'Medium Priority', color: 'warning' }
    return { label: 'Low Priority', color: 'success' }
  }

  const sortedTopics = [...mockTopics].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return b.averageScore - a.averageScore
  })

  const getScoreColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'success.main'
    if (score >= threshold * 0.8) return 'warning.main'
    return 'error.main'
  }

  useEffect(() => {
    const testFetch = async () => {
      const response = await determineReviewTopics()
      console.log('Response from server:', response)
    }
    testFetch()
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Class Performance
        </Typography>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleQueryTopics} sx={{ mb: 2 }}>
            Analyze Topics for Review
          </Button>
          <Typography variant="body2" color="text.secondary">
            Click to analyze class performance and get suggestions for topics that need review.
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={handleSortChange}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {sortedTopics.map(topic => (
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={topic.id}>
            <StyledCard elevation={3}>
              <Typography variant="h6" gutterBottom>
                {topic.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {topic.description}
              </Typography>
              <TopicScore>
                <Typography variant="body2" sx={{ minWidth: '100px' }}>
                  Class Average:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: getScoreColor(topic.averageScore, topic.masteryThreshold),
                  }}
                >
                  {(topic.averageScore * 100).toFixed(1)}%
                </Typography>
              </TopicScore>
              <Box sx={{ mt: 1, width: '100%' }}>
                <Box
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    height: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${topic.averageScore * 100}%`,
                      height: '100%',
                      bgcolor: getScoreColor(topic.averageScore, topic.masteryThreshold),
                      transition: 'width 0.5s ease-in-out',
                    }}
                  />
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for displaying topics to review */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Topics Requiring Review</DialogTitle>
        <DialogContent>
          {topicsToReview.length === 0 ? (
            <Typography color="text.secondary">
              All topics are performing well above the mastery threshold!
            </Typography>
          ) : (
            <List>
              {topicsToReview.map(topic => {
                const urgency = getUrgencyLevel(topic.averageScore, topic.masteryThreshold)
                return (
                  <ListItem
                    key={topic.id}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="subtitle1">{topic.name}</Typography>
                          <Chip label={urgency.label} color={urgency.color as any} size="small" />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Current Average: {(topic.averageScore * 100).toFixed(1)}%
                        </Typography>
                      }
                    />
                  </ListItem>
                )
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ClassPerformance
