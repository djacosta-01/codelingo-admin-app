'use client'

import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import { getLessonData } from '@/app/classes/[className]/lessons/actions'
import { useState, useEffect } from 'react'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid'
import { Lesson } from '@/types/content.types'
import { AddCircleOutline, Edit, Delete } from '@mui/icons-material'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import AddLessonDialog from '@/app/classes/[className]/lessons/add-lesson-dialog'
import LessonDataGrid from '@/app/classes/[className]/lessons/lesson-data-grid'

const Lessons = ({ params }: { params: { className: string } }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [rows, setRows] = useState<GridRowsProp>([])
  const [prevLessonData, setPrevLessonData] = useState<Lesson | null>(null)

  const handleLessonDialogOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessonData(params.className)
      const lessons = data.map(({ lesson_id, name, topics }) => ({
        id: lesson_id,
        lessonName: name,
        unitsCovered: topics?.join(', '),
      }))
      setRows(lessons)
    }
    fetchLessons()
  }, [params.className])

  const columns: GridColDef[] = [
    {
      field: 'lessonName',
      headerName: 'Lessons',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'unitsCovered',
      headerName: 'Units Covered',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={() => alert('Edit')}
            // onClick={handleEditClick(id)}
            color="inherit"
            sx={{ ':hover': { color: '#1B94F7' } }}
          />,
          <GridActionsCellItem
            key={id}
            icon={<Delete />}
            label="Delete"
            // onClick={() => handleConfimationDialogOpen(id as number)}
            onClick={() => alert('Delete')}
            color="inherit"
            sx={{ ':hover': { color: 'red' } }}
          />,
        ]
      },
    },
  ]

  return (
    <>
      <NavbarWithSideMenu className={params.className} displaySideMenu currentPage="Lessons" />
      <Box
        id="lesson-container"
        sx={{
          marginTop: '64px',
          marginLeft: '65px',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          width: 'calc(100vw - 65px)',
        }}
      >
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
        ></Box>
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
        <AddLessonDialog
          className={params.className}
          open={open}
          setOpen={setOpen}
          prevLessonData={prevLessonData}
          resetPrevLessonData={setPrevLessonData}
        />
        <LessonDataGrid
          params={{ className: params.className }}
          setPrevLessonData={setPrevLessonData}
          setOpen={setOpen}
        />
      </Box>
    </>
  )
}

export default Lessons
