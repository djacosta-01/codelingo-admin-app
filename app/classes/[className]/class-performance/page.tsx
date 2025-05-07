'use client'

import { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  styled,
  Chip,
  Grid,
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { determineReviewTopics } from './actions'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

interface PerformanceData {
  averages: Array<Record<string, number>>
  nodes: Record<string, string>
  topReviewTopics: string[]
}

const formatPercentage = (decimal: number): string => {
  return `${(decimal * 100).toFixed(1)}%`
}

const getPerformanceLevel = (score: number): string => {
  if (score >= 0.7) return 'Good'
  if (score >= 0.5) return 'Needs Improvement'
  return 'Critical'
}

const ClassPerformance = () => {
  const [topicsToReview, setTopicsToReview] = useState<string[]>([])
  const [topics, setTopics] = useState<Record<string, string>>({})
  const [averages, setAverages] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await determineReviewTopics() as PerformanceData
      setTopicsToReview(response.topReviewTopics)
      setTopics(response.nodes)
      setAverages(response.averages[0])
    }
    fetchData()
  }, [])

  // Calculate statistics
  const stats = Object.values(averages).reduce((acc, score) => {
    acc.totalTopics++
    acc.averageScore += score
    if (score >= 0.7) acc.goodPerformance++
    else if (score >= 0.5) acc.needsImprovement++
    else acc.critical++
    return acc
  }, {
    totalTopics: 0,
    averageScore: 0,
    goodPerformance: 0,
    needsImprovement: 0,
    critical: 0,
  })
  stats.averageScore = stats.totalTopics ? stats.averageScore / stats.totalTopics : 0

  // Prepare chart data
  const performanceDistribution = {
    labels: ['Good', 'Needs Improvement', 'Critical'],
    datasets: [{
      data: [stats.goodPerformance, stats.needsImprovement, stats.critical],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
    }],
  }

  const topicPerformance = {
    labels: Object.values(topics),
    datasets: [{
      label: 'Topic Performance',
      data: Object.values(topics).map(topic => averages[topic] * 100),
      backgroundColor: Object.values(topics).map(topic => 
        averages[topic] >= 0.7 ? '#4caf50' :
        averages[topic] >= 0.5 ? '#ff9800' : '#f44336'
      ),
    }],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Topic Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Performance (%)',
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Performance Distribution',
      },
    },
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Class Performance Overview
      </Typography>

      {/* Key Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Average Score
            </Typography>
            <Typography variant="h4" color={
              stats.averageScore >= 0.7 ? 'success.main' :
              stats.averageScore >= 0.5 ? 'warning.main' : 'error.main'
            }>
              {formatPercentage(stats.averageScore)}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Topics
            </Typography>
            <Typography variant="h4">
              {stats.totalTopics}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Topics Mastered
            </Typography>
            <Typography variant="h4" color="success.main">
              {stats.goodPerformance}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Need Review
            </Typography>
            <Typography variant="h4" color="error.main">
              {topicsToReview.length}
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Box sx={{ height: 300 }}>
              <Doughnut data={performanceDistribution} options={doughnutOptions} />
            </Box>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={8}>
          <ChartContainer>
            <Box sx={{ height: 300 }}>
              <Bar data={topicPerformance} options={barOptions} />
            </Box>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Review Topics */}
      {topicsToReview.length > 0 && (
        <ChartContainer>
          <Typography variant="h6" gutterBottom>
            Suggested Topics for Review
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {topicsToReview.map((topic) => (
              <Chip
                key={topic}
                label={`Topic ${topic} (${formatPercentage(averages[topic])})`}
                color="warning"
                sx={{ fontWeight: 'bold' }}
              />
            ))}
          </Box>
        </ChartContainer>
      )}
    </Box>
  )
}

export default ClassPerformance
