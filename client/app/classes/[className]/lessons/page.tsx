'use client'

import { Box, Typography, Tooltip, IconButton, Skeleton } from '@mui/material'
import { useState } from 'react'
import { Lesson } from '@/types/content.types'
import { AddCircleOutline } from '@mui/icons-material'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import AddLessonDialog from '@/app/classes/[className]/lessons/add-lesson-dialog'
import LessonDataGrid from '@/app/classes/[className]/lessons/lesson-data-grid'
import ClassConentHeaderSkeleton from '@/components/skeletons/class-content-header-skeleton'

const Lessons = ({ params }: { params: { className: string } }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [prevLessonData, setPrevLessonData] = useState<Lesson | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(true)

  const handleLessonDialogOpen = () => {
    setOpen(true)
  }

  return (
    <>
      {dataLoading ? (
        <ClassConentHeaderSkeleton />
      ) : (
        <>
          <Box id="class-name" sx={{ paddingLeft: 3 }}>
            <h1>{params.className.replace(/%20/g, ' ')}</h1>
          </Box>
          <Box
            sx={{
              paddingLeft: 5,
              paddingBottom: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h5">Lessons</Typography>
            <Tooltip title="Create New Lesson">
              <IconButton onClick={handleLessonDialogOpen}>
                <AddCircleOutline />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
      <AddLessonDialog
        className={params.className}
        open={open}
        setOpen={setOpen}
        prevLessonData={prevLessonData}
        resetPrevLessonData={setPrevLessonData}
      />
      <LessonDataGrid
        className={params.className}
        setPrevLessonData={setPrevLessonData}
        setDataLoading={setDataLoading}
        setOpen={setOpen}
      />
    </>
  )
}

export default Lessons
