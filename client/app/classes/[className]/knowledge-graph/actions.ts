'use server'

import { Json } from '@/supabase'
import { createClient } from '@/utils/supabase/server'
import { type Node, type Edge } from '@xyflow/react'

export const getKnowledgeGraphData = async (className: string) => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('User not found')
    return { success: false, error: 'User not found', graphData: null }
  }

  // TODO: probably should make a class_slug column in the classes table and filter by that
  const cleanedClassName = className.replace(/%20/g, ' ')
  // console.log('cleanedClassName: ', cleanedClassName)

  const { data: classID, error } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName) // hardcoding for now
    .single()

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error, graphData: null }
  }

  const { data: graphData, error: graphError } = await supabase
    .from('class_knowledge_graph')
    .select('nodes, edges, react_flow_data')
    .eq('class_id', classID.class_id)
    .single()

  // console.log(classID)
  // console.log('---------> graphData: ', graphData)
  // console.log('---------> length: ', graphData?.length)

  if (graphError) {
    console.error('Error fetching graph data: ', graphError)
    return { success: false, error: graphError, graphData: [] }
  }

  return { success: true, graphData }
}

export const updateKnowledgeGraph = async (
  className: string,
  {
    reactFlowNodes,
    reactFlowEdges,
  }: {
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  }
) => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('User not found')
    return { success: false, error: 'User not found' }
  }

  const cleanedClassName = className.replace(/%20/g, ' ')
  console.log('cleanedClassName: ', cleanedClassName)
  const { data: classID, error } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)
    .single()

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error, graphData: null }
  }

  const updatedGraphData: Json[] = [
    {
      reactFlowNodes: reactFlowNodes as unknown as Json,
      reactFlowEdges: reactFlowEdges as unknown as Json,
    },
  ]

  const { error: updateError } = await supabase
    .from('class_knowledge_graph')
    .update({
      react_flow_data: updatedGraphData,
    })
    .eq('class_id', classID.class_id)

  if (updateError) {
    console.error('Error updating graph data: ', error)
    return { success: false, error }
  }

  return { success: true }
}
