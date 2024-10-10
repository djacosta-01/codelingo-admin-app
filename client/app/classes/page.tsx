'use client'

import { Box, Paper } from '@mui/material'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import { getClassData } from '@/app/classes/actions'
import { useState, useEffect } from 'react'
// import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Classes = () => {
  const [classes, setClasses] = useState<(string | null)[]>([])
  const router = useRouter()
  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getClassData()
      setClasses(data)
    }
    fetchClasses()
  }, [])

  return (
    <>
      <NavbarWithSideMenu className="" displaySideMenu={false} currentPage="" />
      <Box id="class-container" sx={{ marginTop: '80px' }}>
        <Box
          id="classes"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {classes.map((className, index) => (
            <Paper
              key={index}
              // onMouseEnter={() => router.prefetch(`/classes/${className}/lessons`)}
              onClick={() => {
                router.push(`/classes/${className}/lessons`)
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15em',
                height: '10em',
                margin: 5,
                padding: 1,
                outline: '1px solid black',
                transition: 'ease-in-out 0.2s',
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.05)',
                  textDecoration: 'underline',
                },
              }}
            >
              {className}
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default Classes
