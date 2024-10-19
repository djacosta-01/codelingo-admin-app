'use client'

import {
  Box,
  Paper,
  Menu,
  MenuItem,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Handle, Position, ReactFlow, ReactFlowProvider } from '@xyflow/react'

// const nodeNames = ['Priority Queues']

const CustomNode = ({
  data,
  isConnectable,
}: {
  data: { label: string }
  isConnectable: boolean
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const [openNodeDialog, setOpenNodeDialog] = useState(false)
  const [nodeName, setNodeName] = useState('')

  const handleClick = (event: React.MouseEvent<HTMLElement>, nodeName: string) => {
    setIsMenuOpen(true)
    setAnchorElement(event.currentTarget)
    setNodeName(nodeName)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
    setAnchorElement(null)
  }

  const handleEditNode = () => {
    setOpenNodeDialog(true)
  }

  return (
    <Box
      sx={{
        transition: 'ease-in-out 0.2s',
        '&:hover': {
          cursor: 'pointer',
          transform: 'scale(1.05)',
          textDecoration: 'underline',
        },
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Paper
        elevation={8}
        onClick={e => handleClick(e, data.label)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '3em',
          width: '10em',
          outline: 'solid 1px',
        }}
      >
        <Typography variant="h6">{data.label}</Typography>
      </Paper>
      <Menu open={isMenuOpen} onClose={handleMenuClose} anchorEl={anchorElement}>
        <MenuItem onClick={handleEditNode}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
      <Dialog open={openNodeDialog} onClose={() => setOpenNodeDialog(false)}>
        <DialogTitle>Edit Node</DialogTitle>
        <DialogContent>
          <TextField
            label="Node Name"
            value={nodeName}
            onChange={e => setNodeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNodeDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenNodeDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </Box>
  )
}

export default CustomNode
