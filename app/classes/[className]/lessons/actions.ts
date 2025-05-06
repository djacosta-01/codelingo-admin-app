'use server'

import { createClient } from '@/utils/supabase/server'
import { Lesson } from '@/types/content.types'
import { getKnowledgeGraphData } from '../knowledge-graph/actions'

export const getAllLessons = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { data, error } = await supabase.from('professor_lessons').select('lesson_id')

  if (error) {
    console.error('Error fetching lessons: ', error)
    return { success: false, error }
  }

  const userLessonIDs = data.map(lesson => lesson.lesson_id)

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .in('lesson_id', userLessonIDs)

  if (lessonsError) {
    console.error('Error fetching lessons: ', lessonsError)
    return { success: false, error: lessonsError }
  }

  return { success: true, lessons }
}

export const lessonDataFor = async (className: string): Promise<Lesson[]> => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  // TODO: probably should make a class_slug column in the classes table and filter by that
  const cleanedClassName = className.replace(/%20/g, ' ')
  const { data: classID, error: classError } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)
    .single()

  if (classError) {
    console.error('Error fetching class ID: ', classError)
    return []
  }

  const { data: lessonIDs, error: lessonIDsError } = await supabase
    .from('class_lesson_bank')
    .select('lesson_id')
    .eq('class_id', classID.class_id)

  if (lessonIDsError) {
    console.error('Error fetching lesson IDs: ', lessonIDsError)
    return []
  }

  const { data: lessonData, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .in(
      'lesson_id',
      lessonIDs.map(lesson => lesson.lesson_id)
    )

  if (lessonsError) {
    console.error('Error fetching lessons: ', lessonsError)
    return []
  }

  return lessonData
}

// Should work, but need to update RLS policies on the database for inserts
export const createNewLesson = async (
  className: string,
  { lessonName, topics }: { lessonName: string; topics: string[] }
) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const cleanedClassName = className.replace(/%20/g, ' ')

  // TODO: make this into a function please bc we're doing this in multiple places
  const { data: classID, error } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)
    .single()

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error }
  }

  const { error: insertError } = await supabase.from('lessons').insert({ name: lessonName, topics })

  if (insertError) {
    console.error(insertError)
    return { success: false, error: insertError }
  }

  const { data: newLessonID, error: newLessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', lessonName)
    .single()

  if (newLessonIDError) {
    console.error(newLessonIDError)
    return { success: false, error: newLessonIDError }
  }

  const { error: insertIntoClassLessonBankError } = await supabase
    .from('class_lesson_bank')
    .insert({
      owner_id: user.id,
      class_id: classID.class_id,
      lesson_id: newLessonID.lesson_id,
    })

  if (insertIntoClassLessonBankError) {
    console.error('Error inserting into class_lesson_bank: ', insertIntoClassLessonBankError)
    return { success: false, error: insertIntoClassLessonBankError }
  }

  return { success: true }
}

export const importLessonToClass = async (className: string, lessonIDs: number[]) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const cleanedClassName = className.replace(/%20/g, ' ')

  const { data, error } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', cleanedClassName)
    .single()

  if (error) {
    console.error('Error fetching class ID: ', error)
    return { success: false, error: 'Something went wrong' }
  }

  for (const lessonID of lessonIDs) {
    const { error: insertError } = await supabase
      .from('class_lesson_bank')
      .insert({ owner_id: user.id, class_id: data.class_id, lesson_id: lessonID })

    if (insertError) {
      console.error('Error importing lessons ', insertError)
      return { success: false, error: 'Error importing lessons' }
    }
  }

  return { success: true }
}

export const updateLesson = async (
  id: number,
  { lessonName, topics }: { lessonName: string; topics: string[] }
) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase
    .from('lessons')
    .update({
      name: lessonName,
      topics,
    })
    .eq('lesson_id', id)

  if (error) {
    console.error('Error updating lesson: ', error)
    return { success: false, error }
  }

  return { success: true }
}

export const deleteLesson = async (lessonID: number) => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  // NOTE: this also deletes lesson in class lesson bank table
  // TODO: give user option to keep the lesson for later and pass that decision in as a param
  const { error: deleteError } = await supabase.from('lessons').delete().eq('lesson_id', lessonID)

  if (deleteError) {
    console.error('Error deleting lesson: ', deleteError)
    return { success: false, error: deleteError }
  }

  return { success: true }
}

export const getLessonTopics = async (className: string) => {
  const { graphData } = await getKnowledgeGraphData(className)
  console.log('graphData: ', graphData)
  if (!graphData || !('react_flow_data' in graphData)) {
    console.error('Invalid graphData structure')
    return { success: false, topics: [] }
  }
  const { react_flow_data } = graphData
  interface ReactFlowData {
    reactFlowNodes: { data: { label: string } }[]
  }

  const { reactFlowNodes } = react_flow_data[0] as unknown as ReactFlowData

  const nodes = reactFlowNodes.map(node => {
    const {
      data: { label },
    } = node
    return label
  })

  return { success: true, topics: nodes }
}
