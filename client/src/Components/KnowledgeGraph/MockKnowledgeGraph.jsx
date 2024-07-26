import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { initialEdges, initialNodes } from './scripts/initialMockValues'

const MockKnowledgeGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodesForDisplay, setNodesForDisplay] = useState(initialNodes)
  const [edgesForDisplay, setEdgesForDisplay] = useState(initialEdges)
  const [open, setOpen] = useState(false) // dialog state
  // input states
  const [nodeTopic, setNodeTopic] = useState('')
  const [targetNodes, setTargetNodes] = useState('')

  // Dialog functions
  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setNodeTopic('')
    setTargetNodes('')
  }

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    changes => setNodesForDisplay(nds => applyNodeChanges(changes, nds)),
    [setNodesForDisplay]
  )
  const onEdgesChange = useCallback(
    changes => setEdgesForDisplay(eds => applyEdgeChanges(changes, eds)),
    [setEdgesForDisplay]
  )
  // handles edge connection
  const onConnect = useCallback(
    connection => setEdgesForDisplay(eds => addEdge({ ...connection, animated: true }, eds)),
    [setEdgesForDisplay]
  )

  useEffect(() => {
    setNodes(nodesForDisplay.map(nodeData => nodeData.id))
    setEdges(edgesForDisplay.map(edgeData => [edgeData?.source, edgeData?.target]))
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

    // TODO: see if this is a better solution for checking if options input is valid
    // probably make a validation method?
    let invalidInput = false
    const edgesToAdd = targets.map(target => {
      if (!nodes?.includes(target) || target === cleanedNodeTopic) {
        alert('Target node does not exist or is the same as the source node')
        invalidInput = true
        return
      }
      // console.log('HELLO')
      return {
        id: `${cleanedNodeTopic}-${target}`,
        source: cleanedNodeTopic,
        target,
        animated: true,
      }
    })

    // console.log(edgesToAdd)
    // console.log(nodes)
    // console.log(edges)
    if (!invalidInput) {
      setNodesForDisplay([...nodesForDisplay, newNode])
      setEdgesForDisplay([...edgesForDisplay, ...edgesToAdd])
    }

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
        <ReactFlow
          nodes={nodesForDisplay}
          edges={edgesForDisplay}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
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
