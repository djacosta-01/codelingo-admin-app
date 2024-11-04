'use client'

import { Box, Stack, Paper } from '@mui/material'
import { getClassData } from '@/app/student/actions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ClassData {
  class_id: number
  description: string | null
  name: string | null
  section_number: string | null
}

const Classes = () => {
  const [classes, setClasses] = useState<ClassData[]>()
  const router = useRouter()

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getClassData()
      console.log('data', data)
      setClasses(data)
    }
    fetchClasses()
  }, [])

  // console.log(classes)

  return (
    <Stack
      sx={{
        backgroundColor: 'grey',
        height: '100vh',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {classes?.map(({ name, description, section_number }, index) => (
        <Box key={index} sx={{ minWidth: '50%' }}>
          <Paper>
            {name}: {section_number}
            <h3>
              <i>{description}</i>
            </h3>
          </Paper>
        </Box>
      ))}
    </Stack>
  )
}

export default Classes
