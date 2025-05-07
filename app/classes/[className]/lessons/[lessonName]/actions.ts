'use server'

import { Question, MultipleChoice, Rearrange } from '@/types/content.types'
import { createClient } from '@/utils/supabase/server'

export const getLessonQuestions = async (
  className: string,
  lessonName: string
): Promise<
  {
    question_id: number
    question_type: string
    prompt: string | null
    snippet: string | null
    topics: string[] | null
    answer_options: any[] | null
    answer: string | null
  }[]
> => {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return []
  }

  // TODO: like it was stated in other functions, make a class_slug column so we don't have to clean the class name
  // SAME goes for the lesson name
  const cleanedClassName = className.replace(/%20/g, ' ')
  const cleanedLessonName = lessonName.replace(/%20/g, ' ')

  const { data: lessonID, error: lessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', cleanedLessonName)
    .single()

  if (lessonIDError) {
    console.error('Error fetching lesson ID: ', lessonIDError)
    return []
  }

  const { data: questionIDs, error: questionIDsError } = await supabase
    .from('lesson_question_bank')
    .select('question_id')
    .eq('lesson_id', lessonID.lesson_id)

  if (questionIDsError) {
    console.error('Error fetching question IDs: ', questionIDsError)
    return []
  }

  const { data: questionData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .in(
      'question_id',
      questionIDs.map(question => question.question_id)
    )

  if (questionsError) {
    console.error('Error fetching questions: ', questionsError)
    return []
  }

  return questionData
}

// TODO: add question to class question bank
export async function createNewQuestion(lessonName: string, className: string | undefined,  questionData: Question) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  if (!lessonName) {
    console.error('No lesson name found')
    return { success: false, error: 'No lesson name found' }
  }

  // Handle different question types
  if (questionData.questionType === 'multiple-choice') {
    const multipleChoiceData = questionData as MultipleChoice
    const { questionType, prompt, snippet, topics, answerOptions, answer } = multipleChoiceData
    const answerOptionValues = answerOptions.map(option => Object.values(option)[0])

    const { error } = await supabase.from('questions').insert({
      question_type: questionType,
      prompt,
      snippet,
      topics,
      answer_options: answerOptionValues,
      answer,
    } as any)

    if (error) {
      console.error('Error inserting question data: ', error)
      return { success: false, error }
    }
  } else if (questionData.questionType === 'rearrange') {
    const rearrangeData = questionData as Rearrange
    const { questionType, prompt, snippet, topics, answerOptions, answer } = rearrangeData

    if (!prompt || !topics || !topics.length) {
      console.error('Missing required fields for rearrange question')
      return {
        success: false,
        error: 'Missing required fields. Please provide a prompt and select at least one topic.',
      }
    }

    // Make sure we have at least one token
    if (!answerOptions || answerOptions.length === 0) {
      console.error('No tokens defined for rearrange question')
      return {
        success: false,
        error: 'No tokens defined. Please create at least one token for the rearrange question.',
      }
    }

    const studentViewOptions = processRearrangeOptionsData(answerOptions, snippet)

    const { error } = await supabase.from('questions').insert({
      question_type: questionType,
      prompt,
      snippet,
      topics,
      answer_options: [{ professorView: answerOptions }, { studentView: studentViewOptions }],
      answer,
    } as any)

    if (error) {
      console.error('Error inserting question data: ', error)
      return { success: false, error }
    }
  } else {
    console.error('Unsupported question type')
    return { success: false, error: 'Unsupported question type' }
  }

  const { data: questionIDs, error: questionIDError } = await supabase
    .from('questions')
    .select('question_id')

  if (questionIDError) {
    console.error('Error fetching question ID: ', questionIDError)
    return { success: false, error: questionIDError }
  }

  // theoretically, the largest question id should be the one we just inserted
  const questionID = questionIDs.map(id => id.question_id).sort((a, b) => b - a)[0]

  // link the question to the class
  // const cleanedClassName = className.replace(/%20/g, ' ')
  const { data: classID, error: classIDError } = await supabase
    .from('classes')
    .select('class_id')
    .eq('name', className!)
    .single()

  if (classIDError) {
    console.error('Error fetching class ID: ', classIDError)
    return { success: false, error: classIDError }
  }

  const { error: classQuestionBankError } = await supabase.from('class_question_bank').insert({
    class_id: classID.class_id,
    owner_id: user.id,
    question_id: questionID,
  })

  if (classQuestionBankError) {
    console.error('Error linking question to class: ', classQuestionBankError)
    return { success: false, error: classQuestionBankError }
  }


  // link the question to the lesson
  const cleanedLessonName = lessonName.replace(/%20/g, ' ')
  const { data: lessonID, error: lessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', cleanedLessonName)
    .single()

  if (lessonIDError) {
    console.error('Error fetching lesson ID: ', lessonIDError)
    return { success: false, error: lessonIDError }
  }

  const { error: lessonQuestionBankError } = await supabase.from('lesson_question_bank').insert({
    lesson_id: lessonID.lesson_id,
    owner_id: user.id,
    question_id: questionID,
  })

  if (lessonQuestionBankError) {
    console.error('Error linking question to lesson: ', lessonQuestionBankError)
    return { success: false, error: lessonQuestionBankError }
  }

  return { success: true }
}

export async function updateQuestion(id: number, questionData: Question) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { questionType, prompt, snippet, topics, answerOptions, answer } = questionData

  let updateData: any = {
    question_type: questionType,
    prompt,
    snippet,
    topics,
    answer,
  }

  if (questionType === 'multiple-choice') {
    const answerOptionValues = answerOptions.map(option =>
      typeof option === 'string' ? option : Object.values(option)[0]
    )
    updateData.answer_options = answerOptionValues
  } else if (questionType === 'rearrange') {
    const studentViewOptions = processRearrangeOptionsData(answerOptions, snippet)
    updateData.answer_options = [
      { professorView: answerOptions },
      { studentView: studentViewOptions },
    ]
  }

  const { error } = await supabase.from('questions').update(updateData).eq('question_id', id)

  if (error) {
    console.error('Error updating question data: ', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function deleteQuestion(id: number) {
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase.from('questions').delete().eq('question_id', id)

  if (error) {
    console.error('Error deleting question: ', error)
    return { success: false, error }
  }

  return { success: true }
}

// ------------------
// Helper Functions
// ------------------

const checkAnswersForDuplicates = (answerOptions: string[]) => {
  const seen = new Set()
  for (const option of answerOptions) {
    const trimmedOption = option.trim()
    if (seen.has(trimmedOption)) {
      return true
    }
    seen.add(trimmedOption)
  }
  return false
}

const processRearrangeOptionsData = (options: any[], snippet: string) => {
  // Extract all tokens text for student view
  const allTokens = options.map(option => option.text)

  // Filter out only tokens that aren't distractors (have valid positions in the snippet)
  const nonDistractorOptions = options.filter(
    option => !option.isDistractor && option.position && option.position.length >= 2
  )

  // If we don't have any non-distractor tokens with positions, return simple tokens
  if (nonDistractorOptions.length === 0) {
    return [{ tokens: allTokens, problem: [snippet] }]
  }

  // Add START and END positions to help with slicing
  const optionsIncludingStartAndEnd = [
    ...nonDistractorOptions,
    { text: 'START', position: [0] },
    { text: 'END', position: [snippet.length] },
  ]

  // Extract all position points and sort them
  const positions = Array.from(
    new Set(
      optionsIncludingStartAndEnd.flatMap(option => {
        const [start, end] = option.position || []
        return [start, end].filter(pos => pos !== undefined)
      })
    )
  ).sort((a, b) => a - b)

  // Create slices from the positions
  const sliceIndices = []
  for (let i = 0; i < positions.length - 1; i++) {
    sliceIndices.push([positions[i], positions[i + 1]])
  }

  // Generate the problem text with blanks for tokens
  const slices = sliceIndices.map(([start, end]) => {
    const text = snippet.slice(start, end)

    // Check if this slice corresponds to a token
    const isToken = nonDistractorOptions.some(option => {
      const [optStart, optEnd] = option.position || []
      return optStart === start && optEnd === end
    })

    if (isToken) {
      // Replace with a blank of the same length
      // return '_'.repeat(text.length)
      return null
    }

    return text
  })

  return [{ tokens: allTokens, problem: slices }]
}
