'use client'

import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import { getLessonData, type Lesson } from '@/app/classes/[className]/lessons/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowId,
  GridActionsCellItem,
} from '@mui/x-data-grid'
import NavToLessonIcon from '@mui/icons-material/ArrowOutward'
import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'

const Lessons = ({ params }: { params: { className: string } }) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [prevLessonData, setPrevLessonData] = useState<Lesson | null>(null)
  const router = useRouter()

  const routeToLesson = (id: number) => {
    const lessonName = rows.find(row => row.id === id)?.col1
    router.push(`/classes/${params.className}/lessons/${lessonName}`)
  }

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessonData(params.className)
      const lessons = data.map(({ lesson_id, name, topics }) => ({
        id: lesson_id,
        col1: name,
        col2: topics?.join(', '),
      }))
      setRows(lessons)
    }
    fetchLessons()
  }, [params.className])

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      getActions: ({ id }) => {
        return [
          <Tooltip key={0} title={`Go to ${rows?.find(row => row.id === id)?.col1 ?? 'lesson'}`}>
            <GridActionsCellItem
              icon={<NavToLessonIcon />}
              label="Go to lesson"
              onClick={() => routeToLesson(id as number)}
              color="inherit"
              sx={{ ':hover': { transform: 'rotate(45deg)', transition: 'transform 0.5s ease' } }}
            />
          </Tooltip>,
        ]
      },
    },
    {
      field: 'col1',
      headerName: 'Lessons',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'col2',
      headerName: 'Units Covered',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
  ]
  return (
    <>
      <NavbarWithSideMenu
        className={params.className}
        displaySideMenu={true}
        currentPage="Lessons"
      />
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
        <Box sx={{ paddingLeft: 3 }}>
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
        </Box>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </>
  )
}

export default Lessons
