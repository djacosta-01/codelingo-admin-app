import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import ReactFlow from 'reactflow'
import 'reactflow/dist/style.css'
import { formatNodes, formatEdges } from './scripts/graphMethods'

const KnowledgeGraph = ({ parsedNodes, parsedEdges }) => {
  const [nodes, setNodes] = useState(null)
  const [edges, setEdges] = useState(null)
  const [responseCode, setResponseCode] = useState(404)

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch(
          'https://knowledge-graph-api.vercel.app/classes/CS-101/average-graph'
        ) // hardcoding class name for now
        setResponseCode(response.status)
        const data = await response.json()
        // console.log(data)
        setNodes(formatNodes(parsedNodes))
        setEdges(formatEdges(parsedEdges))
        console.log('Success:', data)
      } catch (error) {
        console.error('error', error)
      }
    }
    fetchGraph()
  }, [])

  return (
    <div id="knowledge-graph" style={{ backgroundColor: '#EAECE9', height: 700, width: 800 }}>
      {responseCode === 404 ? (
        <h1 id="error">Graph not found</h1>
      ) : (
        <>
          <ReactFlow nodes={nodes} edges={edges} fitView />
          {/* {nodesInLevels ? <ReactFlow nodes={nodes} edges={edges} fitView /> : <h1>Loading...</h1>} */}
        </>
      )}
    </div>
  )
}

export default KnowledgeGraph
