export const initialNodes = [
  {
    id: 'Input',
    type: 'input',
    data: { label: 'Input Node' },
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
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
]

export const initialEdges = [
  { id: 'e1-2', source: 'Input', target: 'Default', animated: true },
  { id: 'e2-3', source: 'Default', target: 'Output', animated: true },
]
