'use client'

import { Menu, ChevronLeft } from '@mui/icons-material'
import LessonsIcon from '@mui/icons-material/MenuBook'
import KnowledgeGraphIcon from '@mui/icons-material/Workspaces'
import RosterIcon from '@mui/icons-material/Groups'
import ClassPerformanceIcon from '@mui/icons-material/Insights'
import SettingsIcon from '@mui/icons-material/Settings'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IconButton, Box, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { Info, BugReport, Logout } from '@mui/icons-material'
import Link from 'next/link'
// import { useRouter } from 'next/router'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

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

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}))

const NavbarWithSideMenu = ({
  className,
  displaySideMenu,
  currentPage,
}: {
  className: string
  displaySideMenu: boolean
  currentPage: string
}) => {
  const theme = useTheme()
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const handleMenuOpen = () => setIsSideMenuOpen(true)
  const handleMenuClose = () => setIsSideMenuOpen(false)
  //   const navigate = useNavigate()
  // const handleSignOut = async () => {
  //   // const { error } = await supabase.auth.signOut()
  //   // if (error) console.log('Error logging out:', error.message)
  // }

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
              {/* Fix this bc it looks awful */}
              <Typography variant="h5">
                <Link href="/classes">Codelingo</Link>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Tooltip title="About" arrow>
              <IconButton
                sx={{ color: 'white' }}
                // onClick={() => alert('About page in development...')}
                // onClick={() => alert('About page in development...')}
              >
                <Link href="/api">
                  <Info />
                </Link>
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
              <IconButton sx={{ color: 'white' }}>
                <Link href="/auth/logout">
                  <Logout />
                </Link>
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
            {sideMenuItems.map(({ text, icon /*slug*/ }, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isSideMenuOpen ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: currentPage === text ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                    ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                  }}
                  onClick={() => alert('Page in development...')}
                  //   onClick={() => navigate(slug)}
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
