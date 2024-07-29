import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import { supabase } from '../../supabaseClient/supabaseClient'
import {
  reactFlowInitialNodes,
  reactFlowInitialEdges,
  initialNodes,
} from './scripts/initialMockValues'

const MockKnowledgeGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [reactFlowData, setReactFlowData] = useState({ reactFlowNodes: [], reactFlowEdges: [] })
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

  // fetching graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      // console.log('fetching graph data')
      const response = await supabase.from('knowledge_graph').select('*')
      // console.log('response')
      // console.log(response.data)
      const { nodes, edges } = response.data[0]
      const reactFlowData = response.data[0].react_flow_data
      // console.log('nodes')
      // console.log(nodes)
      // console.log('edges')
      // console.log(edges)
      // console.log('reactFlowData')
      // console.log(reactFlowData)
      setNodes(nodes)
      setEdges(edges)
      setReactFlowData(prev => ({
        ...prev,
        reactFlowNodes: reactFlowData[0].reactFlowNodes,
        reactFlowEdges: reactFlowData[0].reactFlowEdges,
      }))
    }
    fetchGraphData()
  }, [])

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    changes => {
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
      // console.log('onEdgesChange')
      // console.log(changes)
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

  // setting nodes and edges for react flow
  // useEffect(() => {
  //   // console.log('setting nodes and edges for react flow')
  //   setNodesForReactFlow(formatNodeData(nodes))
  //   setEdgesForReactFlow(formatEdgeData(edges))
  // }, [nodes, edges])

  // form validation
  const addDataToGraph = _event => {
    _event.preventDefault()
    const regex = /\s+/g
    const cleanedNodeTopic = nodeTopic.replace(regex, '')
    alert(`Will try to add ${cleanedNodeTopic} to the graph after`)
    // if (nodes.includes(cleanedNodeTopic)) {
    //   alert(`${cleanedNodeTopic} already exists in your graph`)
    //   return
    // }
    // const edgesToAdd = targetNodes
    //   .replace(regex, '')
    //   .split(',')
    //   .map(target => {
    //     return [cleanedNodeTopic, target]
    //   })
    // console.log(edgesToAdd)
    // checkIfValid(edgesToAdd)
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
        {/* <ReactFlow
          nodes={testNodes}
          edges={testEdges}
          onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          fitView
        /> */}
        <ReactFlow
          nodes={reactFlowData.reactFlowNodes}
          edges={reactFlowData.reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </Box>
      {/* <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 20,
        }}
      >
        <Button variant="contained" size="large" onClick={() => handleOpenDialog()}>
          Add
        </Button>
      </Box> */}
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
