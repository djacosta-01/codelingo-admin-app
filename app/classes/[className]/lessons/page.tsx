'use client'

import { Box, Typography, Tooltip, IconButton, Container } from '@mui/material'
import { useState } from 'react'
import { Lesson } from '@/types/content.types'
import { AddCircleOutline } from '@mui/icons-material'
import AddLessonDialog from '@/app/classes/[className]/lessons/add-lesson-dialog'
import LessonDataGrid from '@/app/classes/[className]/lessons/lesson-data-grid'
import ClassConentHeaderSkeleton from '@/components/skeletons/class-content-header-skeleton'

const Lessons = ({ params }: { params: { className: string } }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [refreshGrid, setRefreshGrid] = useState<number>(1)
  const [prevLessonData, setPrevLessonData] = useState<Lesson | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)

  const handleLessonDialogOpen = () => {
    setOpen(true)
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      {dataLoading ? (
        <ClassConentHeaderSkeleton />
      ) : (
        <>
          <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4">
              <strong>{params.className.replace(/%20/g, ' ')}</strong>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="h5">Lessons</Typography>
              <Tooltip arrow title="Create New Lesson">
                <IconButton onClick={handleLessonDialogOpen}>
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </>
      )}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <AddLessonDialog
          className={params.className}
          open={open}
          setOpen={setOpen}
          setRefreshGrid={setRefreshGrid}
          prevLessonData={prevLessonData}
          resetPrevLessonData={setPrevLessonData}
        />
        <LessonDataGrid
          className={params.className}
          refreshGrid={refreshGrid}
          setPrevLessonData={setPrevLessonData}
          dataLoading={dataLoading}
          setDataLoading={setDataLoading}
          setOpen={setOpen}
        />
      </Box>
    </Container>
  )
}

export default Lessons
