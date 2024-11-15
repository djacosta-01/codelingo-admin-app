'use client'

import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import { Box } from '@mui/material'

const MockStudentPage = () => {
  return (
    <>
      {/* <NavbarWithSideMenu className="student" displaySideMenu={false} /> */}
      <Box sx={{ marginTop: '64px', marginLeft: '65px' }}>
        <h1>Student Page</h1>
      </Box>
    </>
  )
}

export default MockStudentPage
