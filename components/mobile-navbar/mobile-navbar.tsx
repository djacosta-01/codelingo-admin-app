import { useState } from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore'
import HomeIcon from '@mui/icons-material/Home'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export default function MobileNavbar() {
  const [value, setValue] = useState(0)

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Knowledge Graph" icon={<AccountTreeIcon />} />
        <BottomNavigationAction label="Student Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Box>
  )
}
