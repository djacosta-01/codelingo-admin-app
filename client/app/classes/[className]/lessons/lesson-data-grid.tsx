'use client'

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid'
import { Dialog, DialogActions, DialogTitle, Button, Box } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lesson } from '@/types/content.types'
import { Edit, Delete } from '@mui/icons-material'
import { getLessonData, deleteLesson } from '@/app/classes/[className]/lessons/actions'
import DataGridSkeleton from '@/components/skeletons/data-grid-skeleton'

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
      <Button color="primary">Import</Button>
      <Box sx={{ flex: 1 }} />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}
const LessonDataGrid = ({
  className,
  refreshGrid,
  setPrevLessonData,
  dataLoading,
  setDataLoading,
  setOpen,
}: {
  className: string
  refreshGrid: number
  setPrevLessonData: Dispatch<SetStateAction<Lesson | null>>
  dataLoading: boolean
  setDataLoading: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
  const [lessonId, setLessonId] = useState<number | null>(null)

  const router = useRouter()

  const routeToLesson = ({ row }: GridRowParams) => {
    router.push(`/classes/${className}/lessons/${row.lessonName}`)
  }

  const handleConfimationDialogOpen = (id: number) => {
    setLessonId(id)
    setConfirmationDialogOpen(true)
  }

  const handleConfimationDialogClose = () => {
    setLessonId(null)
    setConfirmationDialogOpen(false)
  }

  const handleEditLesson = (id: number) => () => {
    const row = rows.find(row => row.id === id)
    const { id: rowId, lessonName, unitsCovered } = row!
    setPrevLessonData(prev => ({
      ...prev,
      lesson_id: rowId as number,
      name: lessonName,
      topics: unitsCovered.split(', '),
    }))
    setOpen(true)
  }

  const handleDeleteLesson = (id: number) => async () => {
    const response = await deleteLesson(id)
    if (!response.success) {
      console.error('Error deleting lesson: ', response.error)
      return
    }
    setRows(rows.filter(row => row.id !== id))
    handleConfimationDialogClose()
  }

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
            onClick={handleEditLesson(id as number)}
            color="inherit"
            sx={{ ':hover': { color: '#1B94F7' } }}
          />,
          <GridActionsCellItem
            key={id}
            icon={<Delete />}
            label="Delete"
            onClick={() => handleConfimationDialogOpen(id as number)}
            color="inherit"
            sx={{ ':hover': { color: 'red' } }}
          />,
        ]
      },
    },
  ]

  useEffect(() => {
    const fetchLessons = async () => {
      const lessons = await getLessonData(className)
      setRows(
        lessons.map(({ lesson_id, name, topics }) => ({
          id: lesson_id,
          lessonName: name,
          unitsCovered: topics?.join(', '),
        }))
      )
      setDataLoading(false)
    }
    fetchLessons()
  }, [className, setDataLoading, refreshGrid])

  return (
    <>
      {dataLoading ? (
        <DataGridSkeleton columns={columns} />
      ) : (
        <>
          <DataGrid
            rows={rows}
            columns={columns}
            onRowClick={routeToLesson}
            disableColumnSelector
            ignoreDiacritics
            getRowClassName={() => 'custom-row'}
            slots={{ toolbar: CustomToolbar }}
            sx={{
              '& .custom-row:hover': {
                cursor: 'pointer',
              },
            }}
          />
          <Dialog open={confirmationDialogOpen}>
            <DialogTitle>Are you sure you want to delete this lesson?</DialogTitle>
            <DialogActions>
              <Button onClick={handleConfimationDialogClose}>Cancel</Button>
              <Button color="error" onClick={handleDeleteLesson(lessonId as number)}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  )
}

export default LessonDataGrid
