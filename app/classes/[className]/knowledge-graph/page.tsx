'use client'

import { Box, Button, IconButton, Skeleton } from '@mui/material'
import { Help } from '@mui/icons-material'
import {
  type Node,
  type Edge,
  ReactFlow,
  Background,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useState, useEffect, useContext } from 'react'
import {
  useOnNodesChange,
  useOnEdgesChange,
  useOnConnect,
  useOnConnectEnd,
} from '@/hooks/knowledgeGraphHooks'
import { getKnowledgeGraphData } from '@/app/classes/[className]/knowledge-graph/actions'
import EditableNode from '@/components/custom-graph-nodes/editable-node'
import HelperCard from '@/app/classes/[className]/knowledge-graph/helper-card'
import EditGraphActions from '@/app/classes/[className]/knowledge-graph/edit-graph-actions'
import KnowledgeGraphSkeleton from '@/components/skeletons/knowledge-graph-skeleton'
import { ViewModeContext } from '@/contexts/viewmode-context'
import { Json } from '@/supabase'

interface GraphDataResponse {
  success: boolean
  graphData:
    | {
        nodes: string[]
        edges: string[]
        react_flow_data: Json[]
      }
    | null
    | never[]
  error?: string | any
}

interface FlowData {
  reactFlowNodes: FlowNode[]
  reactFlowEdges: Edge[]
}

interface FlowNode extends Node {
  id: string
  data: {
    label: string
    setReactFlowData: any
  }
}

const nodeTypes = { editableNode: EditableNode }

interface KnowledgeGraphInteractionProps {
  nodesDraggable: boolean
  nodesConnectable: boolean
  elementsSelectable: boolean
}

const intialInteractionProps: KnowledgeGraphInteractionProps = {
  nodesDraggable: false,
  nodesConnectable: false,
  elementsSelectable: false,
}

const KnowledgeGraph = ({ className }: { className: string }) => {
  const [nodes, setNodes] = useState<string[]>([])
  const [edges, setEdges] = useState<string[]>([])
  const { settings } = useContext(ViewModeContext)

  // I plan to use this state to show a warning message when a cycle is detected
  // const [hasCycle, setHasCycle] = useState<boolean>(false)
  const [reactFlowData, setReactFlowData] = useState<{
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  } | null>(null)
  const [inEditMode, setInEditMode] = useState<boolean>(false)
  const [interactionProps, setInteractionProps] =
    useState<KnowledgeGraphInteractionProps>(intialInteractionProps)

  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow()

  const onNodesChange = useOnNodesChange({ setNodes, setReactFlowData })
  const onEdgesChange = useOnEdgesChange({ setEdges, setReactFlowData })
  const onConnect = useOnConnect({ setReactFlowData, setEdges })
  const onConnectEnd = useOnConnectEnd(screenToFlowPosition, setNodes, setEdges, setReactFlowData)
  // const isValidConnection = useIsValidConnection(getNodes, getEdges, setHasCycle)

  const enterEditMode = () => {
    setInEditMode(true)
    setInteractionProps({
      nodesDraggable: true,
      nodesConnectable: true,
      elementsSelectable: true,
    })
  }

  useEffect(() => {
    const fetchClassGraphData = async () => {
      const response: GraphDataResponse = await getKnowledgeGraphData(className)

      if (response.success && response.graphData && 'nodes' in response.graphData) {
        const { nodes, edges, react_flow_data } = response.graphData
        setNodes(nodes)
        setEdges(edges)

        if (react_flow_data && Array.isArray(react_flow_data) && react_flow_data[0]) {
          try {
            const flowData = react_flow_data[0] as unknown as FlowData
            if ('reactFlowNodes' in flowData && 'reactFlowEdges' in flowData) {
              setReactFlowData(prev => ({
                ...prev,
                reactFlowNodes: flowData.reactFlowNodes.map((nodeData: FlowNode) => ({
                  ...nodeData,
                  id: nodeData.id,
                  data: { ...nodeData.data, setReactFlowData },
                })),
                reactFlowEdges: flowData.reactFlowEdges,
              }))
            }
          } catch (error) {
            console.error('Error parsing react flow data:', error)
          }
        }
      }
    }

    fetchClassGraphData()
  }, [className])

  return (
    <>
      {reactFlowData ? (
        <>
          {reactFlowData.reactFlowNodes.length === 0 ? (
            <Box
              sx={{
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h1>No graph found</h1>
            </Box>
          ) : (
            <ReactFlow
              nodes={reactFlowData.reactFlowNodes}
              edges={reactFlowData.reactFlowEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectEnd={onConnectEnd}
              nodeTypes={nodeTypes}
              nodesDraggable={interactionProps.nodesDraggable}
              nodesConnectable={interactionProps.nodesConnectable}
              elementsSelectable={interactionProps.elementsSelectable}
              colorMode={settings.viewMode}
              nodeOrigin={[0.5, 0]}
              fitView
            >
              {inEditMode && <Background gap={20} />}
              <MiniMap />
            </ReactFlow>
          )}
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
        {reactFlowData ? (
          <HelperCard />
        ) : (
          <Box id="button" sx={{ paddingTop: 1, paddingLeft: 1 }}>
            <Skeleton variant="circular">
              <IconButton>
                <Help id="help-button" color="info" fontSize="large" />
              </IconButton>
            </Skeleton>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 45,
          left: 80,
        }}
      >
        {inEditMode ? (
          <EditGraphActions
            className={className}
            setInEditMode={setInEditMode}
            setInteractionProps={setInteractionProps}
            currentReactFlowData={reactFlowData}
            setReactFlowData={setReactFlowData}
          />
        ) : reactFlowData ? (
          <Button variant="contained" color="success" onClick={enterEditMode}>
            Edit Graph
          </Button>
        ) : (
          <Skeleton>
            <Button variant="contained" color="success" onClick={enterEditMode}>
              Edit Graph
            </Button>
          </Skeleton>
        )}
      </Box>
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
