'use client'

import MobileNavbar from '@/components/mobile-navbar/mobile-navbar'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

// const [data, setData] = useState([])
// const [loading, setLoading] = useState(true)

const mockData = [
  { name: 'TEST CMSI', section_number: 'T', description: 'Test class' },
  { name: 'TEST CMSI 2', section_number: 'T2', description: 'Test class 2' },
  { name: 'Algo', section_number: 'T', description: 'Test class ' },
  { name: 'Algo 1', section_number: 'T2', description: 'Test class 2' },
]

const Classes = () => {
  //use effect, call API route
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
  }))

  // const darkTheme = createTheme({ palette: { mode: 'dark' } })
  const lightTheme = createTheme({ palette: { mode: 'light' } })

  return (
    <div>
      <h1>Classes</h1>
      <Grid container spacing={2}>
        {[lightTheme].map((theme, index) => (
          <Grid item xs={6} key={index}>
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  display: 'grid',
                  gridTemplateColumns: { md: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {mockData.map((item, index) => (
                  <Item key={index}>
                    <h3>
                      {item.name} (Section: {item.section_number})
                    </h3>
                    <p>{item.description}</p>
                  </Item>
                ))}
              </Box>
            </ThemeProvider>
          </Grid>
        ))}
      </Grid>

      <MobileNavbar />
    </div>
  )
}

export default Classes

{
  /* <ul>
{mockData.map((item, index) => (
  <li key={index}>
    <h3>
      {item.name} (Section: {item.section_number})
    </h3>
    <p>{item.description}</p>
  </li>
))}
</ul> */
}
