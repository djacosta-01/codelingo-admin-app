'use client'

import { Box, Paper, Typography } from '@mui/material'
import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import { getClassData } from '@/app/classes/actions'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Classes = () => {
  const [classes, setClasses] = useState<(string | null)[]>([])

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
            <Link href={`/classes/${className}/lessons`}>
              <Paper
                key={index}
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
            </Link>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default Classes
