import { AppBar, Box, Tooltip, Toolbar, IconButton } from '@mui/material'
import { Info, BugReport, AccountCircle } from '@mui/icons-material'
import { supabase } from '../supabaseClient/supabaseClient.js'

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log('Error logging out:', error.message)
}

const NavbarWithMenu = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>Codelingo</Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="About">
              <IconButton sx={{ color: 'white' }}>
                <Info />
              </IconButton>
            </Tooltip>
            <Tooltip title="Report a Problem">
              <IconButton sx={{ color: 'white' }}>
                <BugReport />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign Out">
              <IconButton onClick={() => handleSignOut()} sx={{ color: 'white' }}>
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default NavbarWithMenu
