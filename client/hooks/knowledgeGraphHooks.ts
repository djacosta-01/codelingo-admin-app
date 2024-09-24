import { useCallback } from 'react'
import {
  NodeChange,
  Connection,
  EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'

// TODO: FIX TYPES!!!
export const useOnNodesChange = ({ setNodes, setReactFlowData }) => {
  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'remove') {
          setNodes(prev => prev.filter((node: string) => node !== change.id))
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

  return onNodesChange
}
export const useOnEdgesChange = ({ setEdges, setReactFlowData }) => {
  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach(change => {
        if (change.type !== 'remove') {
          return
        }
        const edgeToRemove = change.id.split('-')
        return setEdges(prev =>
          prev.filter(
            (edge: string[]) => edge[0] !== edgeToRemove[0] || edge[1] !== edgeToRemove[1]
          )
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

  return onEdgesChange
}

export const useOnConnect = ({ setReactFlowData }) => {
  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onConnect = useCallback(
    (connection: Connection) => {
      setReactFlowData(prev => {
        return {
          ...prev,
          reactFlowEdges: addEdge({ ...connection, animated: true }, prev.reactFlowEdges),
        }
      })
    },
    [setReactFlowData]
  )

  return onConnect
}
