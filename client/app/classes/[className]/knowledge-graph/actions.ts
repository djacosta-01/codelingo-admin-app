'use server'

import { Json } from '@/supabase'
import { createClient } from '@/utils/supabase/server'

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
  const { data: classID, error } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error, graphData: null }
  }

  const { data: graphData, error: graphError } = await supabase
    .from('class_knowledge_graph')
    .select('nodes, edges, react_flow_data')
    .eq('class_id', classID[0].class_id)
    .single()

  if (graphError) {
    console.error('Error fetching graph data: ', graphError)
    return { success: false, error: graphError, graphData: null }
  }

  return { success: true, graphData }
}

// TODO: add server action for adding nodes and stuff
