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
