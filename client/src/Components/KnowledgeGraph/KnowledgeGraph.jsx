import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Background,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient/supabaseClient'
import { formatNodeData, formatEdgeData } from './scripts/initialMockValues'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import HelperCard from './HelperCard'

const KnowledgeGraph = () => {
  const { className } = useParams()
  /**
   * ----------------------------------------------
   * Input states and functions
   * ----------------------------------------------
   * */
  const [inputState, setInputState] = useState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  const handleInputChange = _event =>
    setInputState({
      ...inputState,
      [_event.target.name]: _event.target.value,
    })

  /**
   * ----------------------------------------------
   * Graph data states and functions
   * ----------------------------------------------
   * */
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [reactFlowData, setReactFlowData] = useState({ reactFlowNodes: [], reactFlowEdges: [] })

  const saveGraphData = async () => {
    // TODO: use upsert instead of update
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
      alert('Graph data saved successfully')
    }
  }

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
  const checkForCycles = useCallback(async edgesToAdd => {}, [])

  /**
   * ----------------------------------------------
   * Dialog state and functions
   * ----------------------------------------------
   * */
  const [open, setOpen] = useState(false)
  const handleOpenDialog = () => setOpen(true)
  const handleCloseDialog = () => {
    setOpen(false)
    setInputState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  }

  /**
   * ----------------------------------------------
   * Form submission function
   * ----------------------------------------------
   * */
  const addDataToGraph = _event => {
    _event.preventDefault()
    // TODO: add logic for when user wants to add multiple nodes w/either multiple parent or children at once
    const regex = /\s+/g
    const cleanedNodeTopic = inputState.nodeTopic.replace(regex, '')
    if (nodes.includes(cleanedNodeTopic)) {
      alert(`${cleanedNodeTopic} already exists in your graph`)
      return
    }
    const cleanedParents = inputState.parentNodes.replace(regex, '') // readd split
    const cleanedTargets = inputState.targetNodes.replace(regex, '') // readd split

    // TODO: maybe add logic for when user wants to add a single node without parent or child nodes
    // should probably handle this in the backend
    if (cleanedParents === '' && cleanedTargets === '') {
      alert(
        'Your node should have at least one parent or child node. Otherwise, it is an isolated node which is not allowed'
      )
      return
    }
    const edgesToAdd = inputState.targetNodes
      .replace(regex, '')
      .split(',')
      .flatMap(target => {
        return [
          [cleanedParents, cleanedNodeTopic],
          [cleanedNodeTopic, target],
        ]
        // return [cleanedNodeTopic, target]
      })

    const newNodes = formatNodeData(cleanedNodeTopic.split(','))
    const newEdges = formatEdgeData(edgesToAdd)
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

  /**
   * ----------------------------------------------
   *Fetching graph data from supabase
   * ----------------------------------------------
   * */
  const [loadingMessage, setLoadingMessage] = useState(
    'Loading graph data. This may take a few seconds...'
  )
  useEffect(() => {
    const fetchGraphData = async () => {
      const { data, error } = await supabase.from('knowledge_graph').select('*')
      if (error) {
        setLoadingMessage("We couldn't find your knowledge graph")
        return
      }
      const { nodes, edges, react_flow_data } = data[0]
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
  return (
    <>
      <NavbarWithSideMenu className={className} displaySideMenu={true} />
      <Box
        sx={{
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
              <Background gap={16} />
              {/* <Box
                sx={{
                  position: 'fixed',
                  bottom: 30,
                  left: 20,
                  zIndex: 100,
                }}
              > */}
              <Controls />
              {/* </Box> */}
            </ReactFlow>
          </>
        ) : (
          <h1>{loadingMessage}</h1>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          position: 'fixed',
          top: 70,
          left: 65,
        }}
      >
        <HelperCard />
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

export default KnowledgeGraph
