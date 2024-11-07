'use client'

import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { Box, Toolbar, Typography, IconButton, Tooltip } from '@mui/material'
import { Info, Logout, Menu } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const Navbar = ({
  displaySideMenu,
  isSideMenuOpen,
  handleMenuOpen,
}: {
  displaySideMenu: boolean
  isSideMenuOpen: boolean
  handleMenuOpen: () => void
}) => {
  const router = useRouter()

  return (
    <AppBar position="fixed" open={isSideMenuOpen}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {displaySideMenu ? (
            <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
              <Menu fontSize="large" />
            </IconButton>
          ) : (
            ''
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& :hover': {
                cursor: 'pointer',
                textDecoration: 'underline',
              },
            }}
          >
            <Tooltip title="Home" arrow>
              <Typography
                variant="h5"
                onClick={() => router.push('/classes')}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  },
                }}
              >
                Codelingo
              </Typography>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Tooltip title="About" arrow>
            <IconButton sx={{ color: 'white' }} onClick={() => router.push('/about')}>
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign Out" arrow>
            <IconButton onClick={() => router.push('/auth/logout')} sx={{ color: 'white' }}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
