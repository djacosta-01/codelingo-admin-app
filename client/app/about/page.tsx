'use client'

import { Dialog, DialogContent, DialogActions } from '@mui/material'
import ContentDataGrid from '@/components/add-class-content/content-data-grid'
import { Lesson, Question } from '@/types/content.types'
import { useState } from 'react'

const About = () => {
  const [prevContentData, setPrevContentData] = useState<Lesson | Question | null>(null)
  const [openAddContentDialog, setOpenAddContentDialog] = useState<boolean>(false)
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page. You can find information about the app here.</p>
      <ContentDataGrid
        params={{ className: 'TEST CMSI', lessonName: 'Lesson 1' }}
        page={'questions'}
        setPrevContentData={setPrevContentData}
        setOpenAddContentDialog={setOpenAddContentDialog}
      />
      <Dialog open={openAddContentDialog} onClose={() => setOpenAddContentDialog(false)}>
        <DialogContent>
          <h1>Dialog</h1>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenAddContentDialog(false)}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default About
