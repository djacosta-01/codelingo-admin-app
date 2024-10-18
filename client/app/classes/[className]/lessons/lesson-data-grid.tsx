import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridToolbar,
} from '@mui/x-data-grid'

import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lesson } from '@/types/content.types'
import { getLessonData } from '@/app/classes/[className]/lessons/actions'
import { Edit, Delete } from '@mui/icons-material'
const LessonDataGrid = ({
  params,
  setPrevLessonData,
  setOpen,
}: {
  params: { className: string }
  setPrevLessonData: Dispatch<SetStateAction<Lesson | null>>
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
  const [lessonId, setLessonId] = useState<number | null>(null)

  const router = useRouter()

  const routeToLesson = ({ row }: GridRowParams) => {
    router.push(`/classes/${params.className}/lessons/${row.lessonName}`)
  }

  const handleConfimationDialogOpen = (id: number) => {
    setLessonId(id)
    setConfirmationDialogOpen(true)
    alert('Delete clicked')
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

  //   const handleDeleteLesson = (id: number) => async () => {
  //     // call server action here...
  //   }

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
      const lessons = await getLessonData(params.className)
      setRows(
        lessons.map(({ lesson_id, name, topics }) => ({
          id: lesson_id,
          lessonName: name,
          unitsCovered: topics?.join(', '),
        }))
      )
    }
    fetchLessons()
  }, [params.className])

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      onRowClick={routeToLesson}
      disableColumnSelector
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  )
}

export default LessonDataGrid
