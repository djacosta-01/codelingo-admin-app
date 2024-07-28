export const reactFlowInitialNodes = [
  {
    id: 'Input',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 250, y: 25 },
  },

  {
    id: 'Default',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: 'Output',
    type: 'output',
    data: { label: 'Output' },
    position: { x: 250, y: 250 },
  },
]

export const reactFlowInitialEdges = [
  { id: 'e1-2', source: 'Input', target: 'Default', animated: true },
  { id: 'e2-3', source: 'Default', target: 'Output', animated: true },
]

export const initialNodes = ['Input', 'Default', 'Output']
export const initialEdges = [
  ['Input', 'Default'],
  ['Default', 'Output'],
]

export const formatNodeData = nodeData => {
  return nodeData.map(node => {
    return {
      id: node,
      type: 'default',
      data: { label: node },
      position: { x: 250, y: 25 },
    }
  })
}

export const formatEdgeData = edgeData => {
  return edgeData.map(edge => {
    return {
      id: `${edge[0]}-${edge[1]}`,
      source: edge[0],
      target: edge[1],
      animated: true,
    }
  })
}
