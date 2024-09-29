'use client'

import LessonsIcon from '@mui/icons-material/MenuBook'
import KnowledgeGraphIcon from '@mui/icons-material/Workspaces'
import RosterIcon from '@mui/icons-material/Groups'
import ClassPerformanceIcon from '@mui/icons-material/Insights'
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import MuiDrawer from '@mui/material/Drawer'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

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

const SideMenu = ({
  displaySideMenu,
  isSideMenuOpen,
  currentPage,
  className,
  handleMenuClose,
}: {
  displaySideMenu: boolean
  isSideMenuOpen: boolean
  currentPage: string
  className: string
  handleMenuClose: () => void
}) => {
  const theme = useTheme()
  const router = useRouter()

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

  return !displaySideMenu ? null : (
    <Drawer variant="permanent" open={isSideMenuOpen}>
      <DrawerHeader>
        <IconButton onClick={handleMenuClose}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : null}
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
                backgroundColor: currentPage === text ? 'rgba(0, 0.1, 0.1, 0.4)' : 'transparent',
                // ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
              }}
              onClick={() => router.push(slug)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSideMenuOpen ? 3 : 'auto',
                  justifyContent: 'center',
                  //   color: currentPage === text ? 'black' : 'auto',
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
  )
}

export default SideMenu
