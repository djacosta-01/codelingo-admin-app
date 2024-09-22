'use client'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Background,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useState, useEffect, useCallback } from 'react'
import { getKnowledgeGraphData } from '@/app/classes/[className]/knowledge-graph/actions'
import NavbarWithSideMenu from '@/components/navbar-with-sidemenu'
import { Json } from '@/supabase'

const KnowledgeGraph = ({ params }: { params: { className: string } }) => {
  //   const [graphData, setGraphData] = useState({ nodes: [], edges: [], react_flow_data: [{}] })
  /**
   * ----------------------------------------------
   * Graph data states and functions
   * ----------------------------------------------
   * */
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [reactFlowData, setReactFlowData] = useState({ reactFlowNodes: [], reactFlowEdges: [] })

  // TODO: move this to server side
  //   const saveGraphData = async () => {
  //     // TODO: use upsert instead of update
  //     const { data, error } = await supabase.from('class_knowledge_graph').update({
  //       nodes,
  //       edges,
  //       react_flow_data: [
  //         {
  //           reactFlowNodes: reactFlowData.reactFlowNodes,
  //           reactFlowEdges: reactFlowData.reactFlowEdges,
  //         },
  //       ],
  //     })
  //     if (error) {
  //       console.error('Error saving graph data: ', error)
  //     } else {
  //       alert('Graph data saved successfully')
  //     }
  //   }

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

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
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

  /* source: https://reactflow.dev/learn/concepts/core-concepts */
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

  /**
   * ----------------------------------------------
   *Fetching graph data
   * ----------------------------------------------
   * */
  const [loadingMessage, setLoadingMessage] = useState<string>(
    'Loading graph data. This may take a few seconds...'
  )
  useEffect(() => {
    // TODO: FIX TYPES!!!
    const fetchClassGraphData = async () => {
      const graphData = await getKnowledgeGraphData(params.className)
      const { nodes, edges, react_flow_data } = graphData
      setNodes(nodes)
      setEdges(edges)
      setReactFlowData(prev => ({
        ...prev,
        reactFlowNodes: react_flow_data[0].reactFlowNodes,
        reactFlowEdges: react_flow_data[0].reactFlowEdges,
      }))
    }
    fetchClassGraphData()
  }, [])

  return (
    <>
      <NavbarWithSideMenu
        className={params.className}
        displaySideMenu={true}
        currentPage={'Knowledge Graph'}
      />
      <Box
        id={`${params.className.toLowerCase}-knowledge-graph-container`}
        sx={{
          marginTop: '64px',
          //   marginLeft: '65px',
          height: '90vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
              <Background gap={20} />
              <Box
                id="controls"
                sx={{
                  position: 'fixed',
                  bottom: 30,
                  left: 60,
                  zIndex: 100,
                }}
              >
                <Controls />
              </Box>
            </ReactFlow>
          </>
        ) : (
          <h1>
            <Typography variant="h3">{loadingMessage}</Typography>
          </h1>
        )}
      </Box>
    </>
  )
}

export default KnowledgeGraph
