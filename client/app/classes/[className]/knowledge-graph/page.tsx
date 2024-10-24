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
} from '@/hooks/knowledgeGraphHooks'
import { getKnowledgeGraphData } from '@/app/classes/[className]/knowledge-graph/actions'
import CustomNode from '@/components/custom-test-node/custom-node'
import HelperCard from '@/app/classes/[className]/knowledge-graph/helper-card'

const nodeTypes = { editableNode: CustomNode }

const KnowledgeGraph = ({ className }: { className: string }) => {
  const [nodes, setNodes] = useState<string[]>([])
  const [edges, setEdges] = useState<string[]>([])
  const [reactFlowData, setReactFlowData] = useState<{
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  }>({
    reactFlowNodes: [],
    reactFlowEdges: [],
  })

  const { screenToFlowPosition } = useReactFlow()

  const onNodesChange = useOnNodesChange({ setNodes, setReactFlowData })
  const onEdgesChange = useOnEdgesChange({ setEdges, setReactFlowData })
  const onConnect = useOnConnect({ setReactFlowData })
  const onConnectEnd = useOnConnectEnd(screenToFlowPosition, setNodes, setEdges)

  useEffect(() => {
    const fetchClassGraphData = async () => {
      const response = await getKnowledgeGraphData(className)

      if (response.success) {
        const { nodes, edges, react_flow_data } = response.graphData!
        setNodes(nodes!)
        setEdges(edges!)
        if (react_flow_data && Array.isArray(react_flow_data) && react_flow_data[0]) {
          const data = react_flow_data[0] as unknown as {
            reactFlowNodes: Node[]
            reactFlowEdges: Edge[]
          }
          setReactFlowData(prev => ({
            ...prev,
            reactFlowNodes: data.reactFlowNodes,
            reactFlowEdges: data.reactFlowEdges,
          }))
        }
      }
    }

    fetchClassGraphData()
  }, [className])

  console.log(nodes, edges)
  return (
    <>
      {reactFlowData.reactFlowNodes.length !== 0 || reactFlowData.reactFlowEdges.length !== 0 ? (
        <>
          <ReactFlow
            nodes={reactFlowData.reactFlowNodes}
            edges={reactFlowData.reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Loading graph data. This may take a few seconds...</h1>
        </Box>
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
