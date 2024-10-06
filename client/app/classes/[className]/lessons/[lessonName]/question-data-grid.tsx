import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { getLessonQuestionData } from '@/app/classes/[className]/lessons/[lessonName]/actions'

// source: https://mui.com/x/react-data-grid/editing/
const QuestionDataGrid = ({
  params,
}: {
  params: {
    className: string
    lessonName: string
  }
}) => {
  const [rows, setRows] = useState<GridRowsProp>()
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    console.log('edit clicked', id)
    console.log('rowModesModel', rowModesModel)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    console.log('save clicked', id)
    console.log('rowModesModel', rowModesModel)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows?.filter(row => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows?.find(row => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows?.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log('processRowUpdate', updatedRow)
    setRows(rows?.map(row => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  useEffect(() => {
    const fetchLessonQuestions = async () => {
      const lessonQuestions = await getLessonQuestionData(params.className, params.lessonName)
      const tableRows = lessonQuestions.map(
        ({ prompt, snippet, topics, answer_options, answer }, index) => ({
          id: index,
          col0: prompt,
          col1: snippet,
          col2: topics?.join(', '),
          col3: answer_options?.join(', '),
          col4: answer,
        })
      )
      setRows(tableRows)
    }
    fetchLessonQuestions()
  }, [])

  const columns: GridColDef[] = [
    { field: 'col0', headerName: 'Questions', width: 180, editable: true },
    {
      field: 'col1',
      headerName: 'Snippet',
      width: 180,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'col2',
      headerName: 'Topics',
      width: 180,
    },
    {
      field: 'col3',
      headerName: 'Options',
      width: 220,
    },
    {
      field: 'col4',
      headerName: 'Answer',
      width: 220,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        disableColumnSelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  )
}

export default QuestionDataGrid
