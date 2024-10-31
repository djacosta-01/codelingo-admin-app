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
import { useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useNodeLabelUpdate } from '@/hooks/knowledgeGraphHooks'

/** custom react flow nodes have these props available to them:
 * https://reactflow.dev/api-reference/types/node-props
 * */
const EditableNode = ({
  id,
  data,
  isConnectable,
}: {
  id: string
  data: {
    label: string
    setReactFlowData: (data: { reactFlowNodes: any[]; reactFlowEdges: any[] }) => void
  }
  isConnectable: boolean
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const [openNodeDialog, setOpenNodeDialog] = useState(false)
  const [nodeName, setNodeName] = useState(data.label)

  const updateNodeLabel = useNodeLabelUpdate(data.setReactFlowData, id, nodeName)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsMenuOpen(true)
    setAnchorElement(event.currentTarget)
  }

  const handleSave = () => {
    // console.log('handleSave')
    // console.log(nodeName)
    // console.log(id)
    updateNodeLabel()
    handleMenuClose()
    handleCloseDialog()
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
    setAnchorElement(null)
  }

  const handleEditNode = () => {
    setOpenNodeDialog(true)
  }

  const handleCloseDialog = () => setOpenNodeDialog(false)

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
        onClick={e => handleClick(e)}
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
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
    </Box>
  )
}

export default EditableNode
