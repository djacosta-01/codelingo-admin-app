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
    answer_options: string[] | null
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

export async function createNewQuestion(lessonName: string, questionData: Question) {
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

  // can prolly have a helper here that processes and inserts data
  if (questionData.questionType === 'multiple-choice') {
    console.log('multiple choice being processed')
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
    })

    if (error) {
      console.error('Error inserting question data: ', error)
      return { success: false, error }
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

    const cleanedLessonName = lessonName.replace(/%20/g, ' ')
    const { data: lessonID, error: lessonIDError } = await supabase
      .from('lessons')
      .select('lesson_id')
      .eq('name', cleanedLessonName)
      .single()

    if (lessonIDError) {
      console.error('Error fetching question or lesson ID: ', lessonIDError)
      return { success: false, error: lessonIDError }
    }

    const { error: lessonQuestionBankError } = await supabase.from('lesson_question_bank').insert({
      lesson_id: lessonID.lesson_id,
      owner_id: user.id,
      question_id: questionID,
    })

    if (lessonQuestionBankError) {
      console.error('Error inserting into lesson_question_bank: ', lessonQuestionBankError)
      return { success: false, error: lessonQuestionBankError }
    }
    return { success: true }
  }
  console.log('rearrange being processed')
  const rearrangeData = questionData as Rearrange
  const { questionType, prompt, snippet, topics, answerOptions, answer } = rearrangeData

  const studentViewOptions = processRearrangeOptionsData(answerOptions, snippet)

  console.log(answerOptions)
  console.log(studentViewOptions)
  const { error } = await supabase.from('questions').insert({
    question_type: questionType,
    prompt,
    snippet,
    topics,
    answer_options: [{ professorView: answerOptions }, { studentView: studentViewOptions }],
    answer,
  })

  if (error) {
    console.error('Error inserting question data: ', error)
    return { success: false, error }
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

  const cleanedLessonName = lessonName.replace(/%20/g, ' ')
  const { data: lessonID, error: lessonIDError } = await supabase
    .from('lessons')
    .select('lesson_id')
    .eq('name', cleanedLessonName)
    .single()

  if (lessonIDError) {
    console.error('Error fetching question or lesson ID: ', lessonIDError)
    return { success: false, error: lessonIDError }
  }

  const { error: lessonQuestionBankError } = await supabase.from('lesson_question_bank').insert({
    lesson_id: lessonID.lesson_id,
    owner_id: user.id,
    question_id: questionID,
  })

  if (lessonQuestionBankError) {
    console.error('Error inserting into lesson_question_bank: ', lessonQuestionBankError)
    return { success: false, error: lessonQuestionBankError }
  }
  return { success: true }

  // TODO: need to add question to class_question_bank table as well
}

export async function updateQuestion(
  id: number,
  { questionType, prompt, snippet, topics, answerOptions, answer }: Question
) {
  // TODO: fix the logic here
  const supabase = createClient()

  const userResponse = await supabase.auth.getUser()
  const user = userResponse.data.user

  if (!user) {
    console.error('No user found')
    return { success: false, error: 'No user found' }
  }

  const { error } = await supabase
    .from('questions')
    .update({
      question_type: questionType,
      prompt,
      snippet,
      topics,
      answer_options: answerOptions,
      answer,
    })
    .eq('question_id', id)

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
  const selectTokensText = options.map(option => option.text)

  const optionsIncludingStartAndEnd = [
    ...options,
    { text: 'START', position: [0] },
    { text: 'END', position: [snippet.length] },
  ]

  const positions = new Set(
    optionsIncludingStartAndEnd.flatMap(option => option.position).sort((a, b) => a - b)
  )

  const sliceIndices = Array.from(positions)
    .map((position, index, arr) => [position, arr[index + 1]])
    .filter(slice => !slice.includes(undefined))

  const slices = sliceIndices.map(([start, end], index) => {
    const text = snippet.slice(start, end)
    if (selectTokensText.includes(text)) {
      const blankText = [...text].map(character => '_').join('')
      return blankText
    }
    return text
  })

  return [{ tokens: selectTokensText, problem: slices }]
}
