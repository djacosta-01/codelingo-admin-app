'use client'

import { Box } from '@mui/material'
import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'

const Classes = () => {
  return (
    <Box>
      <NavbarWithSideMenu className="test" displaySideMenu={true} currentPage="test" />
    </Box>
  )
}

export default Classes
