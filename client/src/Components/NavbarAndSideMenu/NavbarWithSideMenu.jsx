import { Menu, ChevronLeft } from '@mui/icons-material'
import LessonsIcon from '@mui/icons-material/MenuBook'
import KnowledgeGraphIcon from '@mui/icons-material/Workspaces'
import RosterIcon from '@mui/icons-material/Groups'
import ClassPerformanceIcon from '@mui/icons-material/Insights'
import SettingsIcon from '@mui/icons-material/Settings'
import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IconButton, Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, BugReport, Logout } from '@mui/icons-material'
import { supabase } from '../../supabaseClient/supabaseClient'

const drawerWidth = 240

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div', { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  })
)

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
)

const NavbarWithSideMenu = ({ className, displaySideMenu, currentPage }) => {
  const theme = useTheme()
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const handleMenuOpen = () => setIsSideMenuOpen(true)
  const handleMenuClose = () => setIsSideMenuOpen(false)
  const navigate = useNavigate()
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error.message)
  }

  // TODO: fix routes of other side menu items
  const sideMenuItems = [
    { text: 'Lessons', icon: <LessonsIcon />, slug: `/classes/${className}/lessons` },
    {
      text: 'Knowledge Graph',
      icon: <KnowledgeGraphIcon />,
      slug: `/classes/${className}/knowledge-graph`,
    },
    { text: 'Roster', icon: <RosterIcon />, slug: `/classes/${className}/roster` },
    {
      text: 'Class Performance',
      icon: <ClassPerformanceIcon />,
      slug: `/classes/${className}/class-performance`,
    },
    {
      text: 'Class Settings',
      icon: <SettingsIcon />,
      slug: `/classes/${className}/class-settings`,
    },
  ]

  return (
    <Box id="nav-and-sidemenu">
      {/* Navbar */}
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
              onClick={() => navigate('/')}
              sx={{
                '& :hover': {
                  cursor: 'pointer',
                  textDecoration: 'underline',
                },
              }}
            >
              <h2>Codelingo</h2>
            </Box>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Tooltip title="About" arrow>
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => alert('About page in development...')}
              >
                <Info />
              </IconButton>
            </Tooltip>
            <Tooltip title="Report a Problem" arrow>
              <IconButton
                sx={{ color: 'white' }}
                onClick={() =>
                  alert(
                    "Report a problem page in development...I guess you can say that's a problem (sorry, I'll see myself out)"
                  )
                }
              >
                <BugReport />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign Out" arrow>
              <IconButton onClick={() => handleSignOut()} sx={{ color: 'white' }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SideMenu */}
      {!displaySideMenu ? (
        ''
      ) : (
        <Drawer variant="permanent" open={isSideMenuOpen}>
          <DrawerHeader>
            <IconButton onClick={handleMenuClose}>
              {theme.direction === 'ltr' ? <ChevronLeft /> : ''}
            </IconButton>
          </DrawerHeader>
          <List>
            {sideMenuItems.map(({ text, icon, slug }, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isSideMenuOpen ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: currentPage === text ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                    ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                  }}
                  onClick={() => navigate(slug)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isSideMenuOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: currentPage === text ? 'black' : 'auto',
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: isSideMenuOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </Box>
  )
}

export default NavbarWithSideMenu
