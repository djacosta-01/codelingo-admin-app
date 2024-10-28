import { useCallback } from 'react'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

export const useOnNodesChange = ({ setNodes, setReactFlowData }) => {
  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  const onNodesChange = useCallback(
    changes => {
      changes.forEach(change => {
        if (change.type === 'remove') {
          setNodes(prev => prev.filter(node => node !== change.id))
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
    changes => {
      changes.forEach(change => {
        if (change.type !== 'remove') {
          return
        }
        const edgeToRemove = change.id.split('-')
        return setEdges(prev =>
          prev.filter(edge => edge[0] !== edgeToRemove[0] || edge[1] !== edgeToRemove[1])
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

// TODO: need to pass in setEdges as well here
export const useOnConnect = ({ setReactFlowData }) => {
  /* source: https://reactflow.dev/learn/concepts/core-concepts */
  console.log('in useOnConnect')
  const onConnect = useCallback(
    connection => {
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

// TODO: need to pass in setReactFlowData and set nodes and edges in there as well
let id = 1
const getId = () => `${id++}`
export const useOnConnectEnd = (screenToFlowPosition, setNodes, setEdges, setReactFlowData) => {
  /* https://reactflow.dev/examples/nodes/add-node-on-edge-drop */
  const onConnectEnd = useCallback(
    (event, connectionState) => {
      console.log('in onConnectEnd')
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId()
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event
        const newNode = {
          id,
          type: 'editableNode',
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        }

        // setNodes(nds => nds.concat(newNode))
        // setEdges(eds =>
        //   eds.concat({ id, source: connectionState.fromNode.id, target: id, animated: true })
        // )
        setNodes(nds => [...nds, newNode.id])
        setEdges(eds => [...eds, [connectionState.fromNode.id, id]])
        setReactFlowData(prev => {
          return {
            ...prev,
            reactFlowNodes: [...prev.reactFlowNodes, newNode],
            reactFlowEdges: [
              ...prev.reactFlowEdges,
              { id, source: connectionState.fromNode.id, target: id, animated: true },
            ],
          }
        })
      }
    },
    [screenToFlowPosition]
  )

  return onConnectEnd
}
