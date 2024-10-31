'use client'

import { Box, Dialog, DialogContent, DialogActions } from '@mui/material'
import ContentDataGrid from '@/components/add-class-content/content-data-grid'
import { Lesson, Question } from '@/types/content.types'
import { useState } from 'react'

const About = () => {
  const [prevContentData, setPrevContentData] = useState<Lesson | Question | null>(null)
  const [openAddContentDialog, setOpenAddContentDialog] = useState<boolean>(false)
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export default About
