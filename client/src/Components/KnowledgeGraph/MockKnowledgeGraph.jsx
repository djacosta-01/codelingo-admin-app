import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { supabase } from '../../supabaseClient/supabaseClient'
import {
  // initialEdges,
  // initialNodes,
  formatNodeData,
  formatEdgeData,
} from './scripts/initialMockValues'

const MockKnowledgeGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [nodesForReactFlow, setNodesForReactFlow] = useState()
  const [edgesForReactFlow, setEdgesForReactFlow] = useState()
  const [open, setOpen] = useState(false) // dialog state
  // input states
  const [nodeTopic, setNodeTopic] = useState('')
  const [targetNodes, setTargetNodes] = useState('')
  const [fetchTrigger, setFetchTrigger] = useState(0)

  // Dialog functions
  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setNodeTopic('')
    setTargetNodes('')
  }

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    changes => {
      // console.log('onNodesChange')
      // console.log(changes)
      setNodesForReactFlow(nds => applyNodeChanges(changes, nds))
    },
    [setNodesForReactFlow]
  )

  const onEdgesChange = useCallback(
    changes => {
      // console.log('onEdgesChange')
      // console.log(changes)
      setEdgesForReactFlow(eds => applyEdgeChanges(changes, eds))
    },
    [setEdgesForReactFlow]
  )
  // handles edge connection
  const onConnect = useCallback(
    connection => {
      console.log('onConnect')
      console.log(connection)
      const { source, target } = connection
      const valid = checkIfValid([[source, target]])
      console.log('valid check')
      console.log(valid)
      if (valid) setEdgesForReactFlow(eds => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdgesForReactFlow]
  )

  // checking if edge connections are valid
  // move this to scripts folder later??
  const checkIfValid = useCallback(async edgesToAdd => {
    const response = await fetch('http://localhost:5000/classes/CS-101/update-class-graph', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        edges: edgesToAdd,
      }),
    })
    const { cycleFormed, message } = await response.json()
    // TODO: fix this because rn cycles formed is always true
    if (cycleFormed ?? true) {
      console.log('in if block')
      alert(message)
    }
    setFetchTrigger(prev => prev + 1)
    return cycleFormed
    // console.log(data)
  }, [])

  // fetching graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      // console.log('fetching graph data')
      const response = await fetch('http://localhost:5000/classes/CS-101/class-graph')
      const data = await response.json()
      // console.log(data)
      setNodes(data['nodes'])
      setEdges(data['edges'])
    }
    fetchGraphData()
  }, [fetchTrigger])

  // setting nodes and edges for react flow
  useEffect(() => {
    // console.log('setting nodes and edges for react flow')
    setNodesForReactFlow(formatNodeData(nodes))
    setEdgesForReactFlow(formatEdgeData(edges))
  }, [nodes, edges])

  // form validation
  const addDataToGraph = _event => {
    _event.preventDefault()
    const regex = /\s+/g
    const cleanedNodeTopic = nodeTopic.replace(regex, '')
    if (nodes.includes(cleanedNodeTopic)) {
      alert(`${cleanedNodeTopic} already exists in your graph`)
      return
    }
    const edgesToAdd = targetNodes
      .replace(regex, '')
      .split(',')
      .map(target => {
        return [cleanedNodeTopic, target]
      })
    console.log(edgesToAdd)
    checkIfValid(edgesToAdd)
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
          nodes={nodesForReactFlow}
          edges={edgesForReactFlow}
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
