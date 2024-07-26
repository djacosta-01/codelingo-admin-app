import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useState, useEffect } from 'react'
import ReactFlow from 'reactflow'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

const initialNodes = [
  {
    id: 'Input',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: 'Default',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: 'Output',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
]

const initialEdges = [
  { id: 'e1-2', source: 'Input', target: 'Default', animated: true },
  { id: 'e2-3', source: 'Default', target: 'Output', animated: true },
]

const MockKnowledgeGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodesForDisplay, setNodesForDisplay] = useState(initialNodes)
  const [edgesForDisplay, setEdgesForDisplay] = useState(initialEdges)
  const [open, setOpen] = useState(false) // dialog state
  // input states
  const [nodeTopic, setNodeTopic] = useState('')
  const [targetNodes, setTargetNodes] = useState('')

  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setNodeTopic('')
    setTargetNodes('')
  }

  useEffect(() => {
    setNodes(nodesForDisplay.map(nodeData => nodeData.id))
    setEdges(edgesForDisplay.map(edgeData => [edgeData.source, edgeData.target]))
  }, [nodesForDisplay, edgesForDisplay])

  const addDataToGraph = _event => {
    _event.preventDefault()
    const regex = /\s+/g
    const cleanedNodeTopic = nodeTopic.replace(regex, '')
    if (nodes?.includes(cleanedNodeTopic)) {
      alert('Node already exists')
      return
    }

    const newNode = {
      id: cleanedNodeTopic,
      type: 'default',
      data: { label: cleanedNodeTopic },
      position: { x: 475, y: 125 },
    }
    const targets = targetNodes.replace(regex, '').split(',')
    const edgesToAdd = targets.map(target => ({
      id: `${cleanedNodeTopic}-${target}`,
      source: cleanedNodeTopic,
      target,
      animated: true,
    }))

    setNodesForDisplay([...nodesForDisplay, newNode])
    setEdgesForDisplay([...edgesForDisplay, ...edgesToAdd])

    // resetting input states
    setNodeTopic('')
    setTargetNodes('')
  }

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={true} />
      <Box
        sx={{
          marginTop: '64px',
          marginLeft: '65px',
          height: '90vh',
          width: '95vw',
        }}
      >
        <ReactFlow nodes={nodesForDisplay} edges={edgesForDisplay} fitView />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 20,
        }}
      >
        <Button variant="contained" size="large" onClick={() => handleOpenDialog()}>
          Add
        </Button>
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Adding Node</DialogTitle>
        <DialogContent>
          <form onSubmit={addDataToGraph}>
            <TextField
              required
              variant="standard"
              label="Node Topic"
              value={nodeTopic}
              onChange={_event => setNodeTopic(_event.target.value)}
            />
            <TextField
              variant="standard"
              label="Target Node(s)"
              value={targetNodes}
              onChange={_event => setTargetNodes(_event.target.value)}
            />
            <Box
              id="dialog-buttons"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button type="submit">Add Node</Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MockKnowledgeGraph
