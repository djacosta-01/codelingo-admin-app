'use client'

import { Box, Typography, Tooltip } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowsProp,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid'
import {
  getLessonQuestions,
  deleteQuestion,
} from '@/app/classes/[className]/lessons/[lessonName]/actions'
import { getLessonData } from '@/app/classes/[className]/lessons/actions'
import { Lesson, Question } from '@/types/content.types'
import { useRouter } from 'next/navigation'
import { type Dispatch, useState, useEffect, useCallback } from 'react'
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
    const lessonName = rows?.find(row => row.id === id)?.lessonNames
    router.push(`/classes/${className}/lessons/${lessonName}`)
  }
  console.log('--------------> creating columns')
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
                title={`Go to ${rows?.find(row => row.id === id)?.lessonNames ?? 'lesson'}`}
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
      console.log('creating columns')
      return [
        {
          field: 'questions',
          headerName: 'Questions',
          width: 180,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'snippet',
          headerName: 'Snippet',
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
          field: 'options',
          headerName: 'Options',
          width: 220,
          align: 'center',
          headerAlign: 'center',
        },
        {
          field: 'answer',
          headerName: 'Answer',
          width: 220,
          align: 'center',
          headerAlign: 'center',
        },
      ] as GridColDef[]
  }

  return []
}

const createRows = async (
  page: string,
  className: string,
  lessonName: string
): Promise<GridRowsProp> => {
  let contentData: GridRowsProp = []

  console.log('--------------> creating rows')
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

    case 'questions':
      console.log('getting questions')
      const questions = await getLessonQuestions(className, lessonName)
      contentData = questions.map(
        ({ question_id, prompt, snippet, topics, answer_options, answer }) => ({
          id: question_id,
          questions: prompt,
          snippet: snippet,
          unitsCovered: topics?.join(', '),
          options: answer_options?.join(', '),
          answer: answer,
        })
      )
      console.log('questions:', contentData)
      break
  }
  return contentData
}

const ContentDataGrid = ({
  params,
  page,
  setPrevContentData,
  setOpenAddContentDialog,
}: {
  params: { className: string } | { className: string; lessonName: string }
  page: string
  setPrevContentData: Dispatch<React.SetStateAction<Lesson | Question | null>>
  setOpenAddContentDialog: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [columns, setColumns] = useState<GridColDef[]>([])
  const router = useRouter()

  // const createRows = useCallback(
  //   async (page: string, className: string, lessonName: string): Promise<GridRowsProp> => {
  //     let contentData: GridRowsProp = []

  //     switch (page) {
  //       case 'classes':
  //         contentData = [{ id: 1, col0: className }]
  //         break

  //       case 'lessons':
  //         const lessons = await getLessonData(className)
  //         contentData = lessons.map(({ lesson_id, name, topics }) => ({
  //           id: lesson_id,
  //           lessonNames: name,
  //           unitsCovered: topics?.join(', '),
  //         }))
  //         break

  //       case 'questions':
  //         console.log('getting questions')
  //         const questions = await getLessonQuestions(className, lessonName)
  //         contentData = questions.map(
  //           ({ question_id, prompt, snippet, topics, answer_options, answer }) => ({
  //             id: question_id,
  //             questions: prompt,
  //             snippet: snippet,
  //             unitsCovered: topics?.join(', '),
  //             options: answer_options?.join(', '),
  //             answer: answer,
  //           })
  //         )
  //         console.log('questions:', contentData)
  //         break
  //     }
  //     return contentData
  //   },
  //   []
  // )
  useEffect(() => {
    const handleEditClick = async (id: GridRowId) => {
      console.log('HIIIIIIIII')

      const rows = await createRows(
        page,
        params.className,
        'lessonName' in params ? params.lessonName : ''
      )

      const row = rows?.find(r => r.id === id)
      console.log('id:', id)
      console.log('rows:', rows)
      console.log('row:', row)

      console.log('columns:', columns)

      switch (page) {
        case 'classes':
          alert('Edit class clicked')
          break

        case 'lessons':
          alert('Edit lesson clicked')
          break

        case 'questions':
          // const row = rows?.find(r => r.id === id)

          const { id, questions, snippet, unitsCovered, options, answer } = row!
          setPrevContentData(prev => ({
            ...prev,
            questionId: id as number,
            questionType: 'multiple-choice',
            prompt: questions,
            snippet: snippet,
            topics: unitsCovered.split(', '),
            answerOptions: options.split(', '),
            answer: answer,
          }))
          setOpenAddContentDialog(true) // open the dialog
          break
      }
    }

    const actions: GridColDef[] = [
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
              onClick={() => handleEditClick(id)}
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
    ]

    const initiaizeGridData = async () => {
      const initialRows = await createRows(
        page,
        params.className,
        'lessonName' in params ? params.lessonName : ''
      )
      const intialColumns = createColumns(page, params.className, initialRows, router)

      console.log('initialRows:', rows)
      console.log('initialColumns:', columns)

      setRows(initialRows)
      setColumns([...intialColumns, ...actions])
    }
    initiaizeGridData()
    //'actions', 'page', 'params', and 'router'
  }, [])

  console.log('BEFORE RENDER > rows:', rows)
  console.log('BEFORE RENDER > columns:', columns)

  return (
    <>
      <DataGrid rows={rows} columns={columns} />
    </>
  )
}

export default ContentDataGrid
