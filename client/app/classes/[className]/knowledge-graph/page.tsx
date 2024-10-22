'use client'

import { Box } from '@mui/material'
import { type Node, type Edge, ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useState, useEffect } from 'react'
import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'
import HelperCard from '@/app/classes/[className]/knowledge-graph/helper-card'
import { AddNodeForm } from '@/app/classes/[className]/knowledge-graph/add-node'
import { useOnNodesChange, useOnEdgesChange, useOnConnect } from '@/hooks/knowledgeGraphHooks'
import { getKnowledgeGraphData } from '@/app/classes/[className]/knowledge-graph/actions'
import CustomNode from '@/components/custom-test-node/custom-node'

const nodeTypes = { editableNode: CustomNode }

const KnowledgeGraph = ({ params }: { params: { className: string } }) => {
  const [nodes, setNodes] = useState<string[]>([])
  const [edges, setEdges] = useState<string[]>([])
  const [reactFlowData, setReactFlowData] = useState<{
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  }>({
    reactFlowNodes: [],
    reactFlowEdges: [],
  })

  // hooks
  const onNodesChange = useOnNodesChange({ setNodes, setReactFlowData })
  const onEdgesChange = useOnEdgesChange({ setEdges, setReactFlowData })
  const onConnect = useOnConnect({ setReactFlowData })

  useEffect(() => {
    const fetchClassGraphData = async () => {
      const response = await getKnowledgeGraphData(params.className)

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
  }, [params.className])

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
          height: 'calc(100vh - 64px)',
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
              nodeTypes={nodeTypes}
              colorMode="dark"
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
            {/* <TestNode /> */}
          </>
        ) : (
          <h1>Loading graph data. This may take a few seconds...</h1>
        )}
      </Box>
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

export default KnowledgeGraph
