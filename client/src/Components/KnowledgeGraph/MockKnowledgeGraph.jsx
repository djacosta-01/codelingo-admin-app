import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Background,
} from 'reactflow'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { supabase } from '../../supabaseClient/supabaseClient'
import { formatNodeData, formatEdgeData } from './scripts/initialMockValues'

const MockKnowledgeGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [reactFlowData, setReactFlowData] = useState({ reactFlowNodes: [], reactFlowEdges: [] })

  // input states and functions
  const [inputState, setInputState] = useState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  const handleInputChange = _event =>
    setInputState({
      ...inputState,
      [_event.target.name]: _event.target.value,
    })
  const saveGraphData = async () => {
    const { data, error } = await supabase.from('knowledge_graph').update({
      nodes,
      edges,
      react_flow_data: [
        {
          reactFlowNodes: reactFlowData.reactFlowNodes,
          reactFlowEdges: reactFlowData.reactFlowEdges,
        },
      ],
    })
    if (error) {
      console.error('Error saving graph data: ', error)
    } else {
      console.log('Graph data saved successfully: ', data)
      alert('Graph data saved successfully')
    }
  }

  // Dialog state and functions
  const [open, setOpen] = useState(false)
  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setInputState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  }

  // fetching graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      const response = await supabase.from('knowledge_graph').select('*')
      const { nodes, edges, react_flow_data } = response.data[0]
      setNodes(nodes)
      setEdges(edges)
      setReactFlowData(prev => ({
        ...prev,
        reactFlowNodes: react_flow_data[0].reactFlowNodes,
        reactFlowEdges: react_flow_data[0].reactFlowEdges,
      }))
    }
    fetchGraphData()
  }, [])

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    changes => {
      changes.forEach(change => {
        if (change.type === 'remove') {
          setNodes(prev => prev.filter(node => node !== change.id))
        }
      })
      setReactFlowData(prev => {
        return {
          ...prev,
          reactFlowNodes: applyNodeChanges(changes, prev.reactFlowNodes),
        }
      })
    },
    [setReactFlowData]
  )

  const onEdgesChange = useCallback(
    changes => {
      changes.forEach(change => {
        if (change.type !== 'remove') {
          return
        }
        const edgeToRemove = change.id.split('-')
        return setEdges(prev =>
          prev.filter(edge => edge[0] !== edgeToRemove[0] || edge[1] !== edgeToRemove[1])
        )
      })
      setReactFlowData(prev => {
        return {
          ...prev,
          reactFlowEdges: applyEdgeChanges(changes, prev.reactFlowEdges),
        }
      })
    },
    [setReactFlowData]
  )

  // handles edge connection
  const onConnect = useCallback(
    connection => {
      setReactFlowData(prev => {
        return {
          ...prev,
          reactFlowEdges: addEdge({ ...connection, animated: true }, prev.reactFlowEdges),
        }
      })
    },
    [setReactFlowData]
  )

  // checking if edge connections from input are valid
  const checkIfValid = useCallback(async edgesToAdd => {}, [])

  // form submission
  const addDataToGraph = _event => {
    _event.preventDefault()
    const regex = /\s+/g
    const cleanedNodeTopic = inputState.nodeTopic.replace(regex, '')
    if (nodes.includes(cleanedNodeTopic)) {
      alert(`${cleanedNodeTopic} already exists in your graph`)
      return
    }
    const newNodes = formatNodeData([cleanedNodeTopic])
    const edgesToAdd = inputState.targetNodes
      .replace(regex, '')
      .split(',')
      .map(target => {
        return [cleanedNodeTopic, target]
      })
    const newEdges = formatEdgeData(edgesToAdd)

    // adding nodes and edges to the graph
    setReactFlowData(prev => ({
      ...prev,
      reactFlowNodes: [...prev.reactFlowNodes, ...newNodes],
      reactFlowEdges: [...prev.reactFlowEdges, ...newEdges],
    }))

    setNodes([...nodes, cleanedNodeTopic])
    setEdges([...edges, ...edgesToAdd])
    // resetting input states
    setInputState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  }

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={true} />
      <Box
        sx={{
          // backgroundColor: 'coral',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '64px',
          marginLeft: '65px',
          height: '90vh',
          width: '100%',
        }}
      >
        {reactFlowData.reactFlowNodes.length !== 0 || reactFlowData.reactFlowEdges.length !== 0 ? (
          <>
            <ReactFlow
              nodes={reactFlowData.reactFlowNodes}
              edges={reactFlowData.reactFlowEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              {/* <Background gap={16} />
              <Controls /> */}
            </ReactFlow>
          </>
        ) : (
          <h1>Loading Graph...</h1>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          position: 'fixed',
          bottom: 30,
          right: 20,
        }}
      >
        <Button variant="contained" onClick={handleOpenDialog}>
          Add
        </Button>
        <Button variant="contained" color="success" onClick={saveGraphData}>
          Save
        </Button>
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Adding Node</DialogTitle>
        <DialogContent>
          <form onSubmit={addDataToGraph}>
            <TextField
              variant="standard"
              name="parentNodes"
              label="Parent Node(s)"
              value={inputState.parentNodes}
              onChange={handleInputChange}
            />
            <TextField
              required
              variant="standard"
              name={'nodeTopic'}
              label="Node Name"
              value={inputState.nodeTopic}
              onChange={handleInputChange}
            />
            <TextField
              variant="standard"
              name="targetNodes"
              label="Child Node(s)"
              value={inputState.targetNodes}
              onChange={handleInputChange}
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
