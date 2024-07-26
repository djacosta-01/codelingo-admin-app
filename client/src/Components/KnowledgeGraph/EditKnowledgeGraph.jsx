import { TextField, Box, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import KnowledgeGraph from './Graph'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'
import HelperCard from './HelperCard'

import { nodesAtEachLevel, parseInput } from './scripts/graphMethods'

const EditKnowledgeGraph = () => {
  const [input, setInput] = useState(
    '== Level 1 ==\nTypes --> Variables\nExpressions --> Conditionals\nScope --> Lists\n== Level 2 ==\nVariables --> Iteration\nConditionals --> Iteration\nLists --> Random Access\n== Level 3 ==\nIteration\nRandom Access\n'
  )
  const [nodesFromInput, setNodesFromInput] = useState([])
  const [edgesFromInput, setEdgesFromInput] = useState([])
  const [parsedNodes, setParsedNodes] = useState([[]])

  const updateAndPostGraph = async (nodes, edges) => {
    if (nodes.length > 0 && edges.length > 0) {
      try {
        const response = await fetch('https://knowledge-graph-api.vercel.app/store-kg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodes: nodesFromInput,
            edges: edgesFromInput,
            class_name: 'CS-101',
            graph_name: 'class_avg_kg',
          }),
        })
        const result = await response.json()
        // console.log('Success:', result)
      } catch (error) {
        console.error('error', error)
      }
    }
  }

  const submitForm = event => {
    event.preventDefault()
    const [nodes, edges] = parseInput(input)
    setNodesFromInput(Array.from(nodes))
    setEdgesFromInput(Array.from(edges))
    updateAndPostGraph(nodesFromInput, edgesFromInput)
    setParsedNodes(nodesAtEachLevel(input).map(level => Array.from(new Set(level))))
  }

  return (
    <Box
      id="edit-knowledge-graph-container"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <NavbarWithSideMenu displaySideMenu={true} />
    </Box>
  )
}

export default EditKnowledgeGraph
