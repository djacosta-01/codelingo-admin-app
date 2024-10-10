'use client'

import { Box, Typography, Tooltip } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { getLessonData, type Lesson } from '@/app/classes/[className]/lessons/actions'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import NavToLessonIcon from '@mui/icons-material/ArrowOutward'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const createColumns = (
  page: string,
  className: string,
  rows: GridRowsProp,
  router: AppRouterInstance
): GridColDef[] => {
  const routeToLesson = (id: number) => {
    const lessonName = rows.find(row => row.id === id)?.col1
    router.push(`/classes/${className}/lessons/${lessonName}`)
  }

  switch (page) {
    case 'classes':
      return [
        {
          field: 'actions',
          type: 'actions',
          width: 100,
          align: 'center',
          headerName: 'Classes',
          headerAlign: 'center',
        },
      ] as GridColDef[]

    case 'lessons':
      return [
        {
          field: 'actions',
          type: 'actions',
          width: 100,
          align: 'center',
          headerAlign: 'center',
          getActions: ({ id }) => {
            return [
              <Tooltip
                key={0}
                title={`Go to ${rows?.find(row => row.id === id)?.col1 ?? 'lesson'}`}
              >
                <GridActionsCellItem
                  icon={<NavToLessonIcon />}
                  label="Go to lesson"
                  onClick={() => routeToLesson(id as number)}
                  color="inherit"
                  sx={{ transition: 'ease-in-out 0.2s', ':hover': { transform: 'rotate(45deg)' } }}
                />
              </Tooltip>,
            ]
          },
        },
        {
          field: 'lessonNames',
          headerName: 'Lessons',
          width: 180,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'unitesCovered',
          headerName: 'Units Covered',
          width: 180,
          align: 'center',
          headerAlign: 'center',
        },
      ] as GridColDef[]

    case 'questions':
      return [
        {
          field: 'col0',
          headerName: 'Questions',
          width: 180,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'col1',
          headerName: 'Snippet',
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
        {
          field: 'col3',
          headerName: 'Options',
          width: 220,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'col4',
          headerName: 'Answer',
          width: 220,
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
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={() => alert('Edit clicked')}
                // onClick={handleEditClick(id)}
                color="inherit"
                sx={{ ':hover': { color: '#1B94F7' } }}
              />,
              <GridActionsCellItem
                key={id}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => alert('Delete clicked')}
                // onClick={() => handleConfimationDialogOpen(id as number)}
                color="inherit"
                sx={{ ':hover': { color: 'red' } }}
              />,
            ]
          },
        },
      ] as GridColDef[]
  }

  return []
}

const createRows = async (page: string, className: string): Promise<GridRowsProp> => {
  let contentData: GridRowsProp = []

  switch (page) {
    case 'classes':
      contentData = [{ id: 1, col0: className }]
      break

    case 'lessons':
      const lessons = await getLessonData(className)
      contentData = lessons.map(({ lesson_id, name, topics }) => ({
        id: lesson_id,
        lessonNames: name,
        unitsCovered: topics?.join(', '),
      }))
      break
  }
  return contentData
}

const ContentDataGrid = ({ params, page }: { params: { className: string }; page: string }) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [columns, setColumns] = useState<GridColDef[]>([])
  const router = useRouter()

  useEffect(() => {
    const initiaizeGridData = async () => {
      // const initialRows = await createRows('classes', 'TEST CMSI')
      // const intialColumns = createColumns('classes', 'TEST CMSI', initialRows)
      const initialRows = await createRows(page, params.className)
      const intialColumns = createColumns(page, params.className, initialRows, router)
      setRows(initialRows)
      setColumns(intialColumns)
    }
    initiaizeGridData()
  }, [])

  return <DataGrid rows={rows} columns={columns} />
}

export default ContentDataGrid
