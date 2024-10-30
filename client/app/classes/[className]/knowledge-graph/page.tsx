'use client'

import { Box } from '@mui/material'
import {
  type Node,
  type Edge,
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useState, useEffect } from 'react'
import { AddNodeForm } from '@/app/classes/[className]/knowledge-graph/add-node'
import {
  useOnNodesChange,
  useOnEdgesChange,
  useOnConnect,
  useOnConnectEnd,
  useIsValidConnection,
} from '@/hooks/knowledgeGraphHooks'
import { getKnowledgeGraphData } from '@/app/classes/[className]/knowledge-graph/actions'
import EditableNode from '@/components/custom-graph-nodes/editable-node'
import HelperCard from '@/app/classes/[className]/knowledge-graph/helper-card'
import KnowledgeGraphSkeleton from '@/components/skeletons/knowledge-graph-skeleton'

const nodeTypes = { editableNode: EditableNode }

const KnowledgeGraph = ({ className }: { className: string }) => {
  const [nodes, setNodes] = useState<string[]>([])
  const [edges, setEdges] = useState<string[]>([])
  const [hasCycle, setHasCycle] = useState<boolean>(false)

  const updateLabel = (nodeID: string, newLabel: string) => {
    console.log('updateLabel')
    const updatedData = reactFlowData.reactFlowNodes.map(node => {
      if (node.id === nodeID) {
        const updatedNodeData = {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        }
        setReactFlowData(prev => ({
          ...prev,
          reactFlowNodes: prev.reactFlowNodes.map(n => (n.id === nodeID ? updatedNodeData : n)),
        }))
        // setNodes(prev => prev.map(n => (n.id === nodeID ? updatedNodeData : n))
      }
      return node
    })
  }

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'editableNode',
      position: { x: 100, y: 100 },
      data: { label: 'Node 1', updateLabelHook: updateLabel },
    },
    {
      id: '2',
      type: 'editableNode',
      position: { x: 200, y: 200 },
      data: { label: 'Node 2', updateLabelHook: updateLabel },
    },
  ]

  const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }]

  const [reactFlowData, setReactFlowData] = useState<{
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  }>({
    reactFlowNodes: initialNodes,
    reactFlowEdges: initialEdges,
  })

  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow()

  const onNodesChange = useOnNodesChange({ setNodes, setReactFlowData })
  const onEdgesChange = useOnEdgesChange({ setEdges, setReactFlowData })
  const onConnect = useOnConnect({ setReactFlowData, setEdges })
  const onConnectEnd = useOnConnectEnd(screenToFlowPosition, setNodes, setEdges, setReactFlowData)
  const isValidConnection = useIsValidConnection(getNodes, getEdges, setHasCycle)

  // useEffect(() => {
  //   const fetchClassGraphData = async () => {
  //     const response = await getKnowledgeGraphData(className)

  //     if (response.success) {
  //       const { nodes, edges, react_flow_data } = response.graphData!
  //       setNodes(nodes!)
  //       setEdges(edges!)

  //       if (react_flow_data && Array.isArray(react_flow_data) && react_flow_data[0]) {
  //         const data = react_flow_data[0] as unknown as {
  //           reactFlowNodes: Node[]
  //           reactFlowEdges: Edge[]
  //         }

  //         setReactFlowData(prev => ({
  //           ...prev,
  //           reactFlowNodes: data.reactFlowNodes,
  //           reactFlowEdges: data.reactFlowEdges,
  //         }))
  //       }
  //     }
  //   }

  //   fetchClassGraphData()
  // }, [className])

  // console.log('hasCycle', hasCycle)
  return (
    <>
      {/* {reactFlowData.reactFlowNodes.length !== 0 || reactFlowData.reactFlowEdges.length !== 0 ? ( */}
      {true ? (
        <>
          <ReactFlow
            // nodes={initialNodes}
            // edges={initialEdges}
            nodes={reactFlowData.reactFlowNodes}
            edges={reactFlowData.reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            // isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            colorMode="dark"
            nodeOrigin={[0.5, 0]}
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
        <KnowledgeGraphSkeleton />
      )}
      <Box
        id="helper-card"
        sx={{
          display: 'flex',
          position: 'fixed',
          top: 70,
          left: 65,
        }}
      >
        <HelperCard />
      </Box>
      <AddNodeForm />
    </>
  )
}

export default function KnowledgeGraphWrapper({ params }: { params: { className: string } }) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraph className={params.className} />
    </ReactFlowProvider>
  )
}
