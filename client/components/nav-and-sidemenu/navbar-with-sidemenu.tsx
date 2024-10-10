'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import Navbar from '@/components/nav-and-sidemenu/navbar'
import SideMenu from '@/components/nav-and-sidemenu/side-menu'

const NavbarWithSideMenu = ({
  className,
  displaySideMenu,
  currentPage,
}: {
  className: string
  displaySideMenu: boolean
  currentPage: string
}) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const handleMenuOpen = () => setIsSideMenuOpen(true)
  const handleMenuClose = () => setIsSideMenuOpen(false)

  return (
    <Box id="nav-and-sidemenu">
      <Navbar
        displaySideMenu={displaySideMenu}
        isSideMenuOpen={isSideMenuOpen}
        handleMenuOpen={handleMenuOpen}
      />
      <SideMenu
        displaySideMenu={displaySideMenu}
        isSideMenuOpen={isSideMenuOpen}
        currentPage={currentPage}
        className={className}
        handleMenuClose={handleMenuClose}
      />
    </Box>
  )
}

export default NavbarWithSideMenu
