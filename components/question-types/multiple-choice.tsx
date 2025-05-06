'use client'

import {
  type SelectChangeEvent,
  Box,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
} from '@mui/material'
import { RemoveCircleOutline as RemoveIcon } from '@mui/icons-material'
import { use, useEffect, useRef, useState } from 'react'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'
import { useQuestionContext } from '@/contexts/question-context'
import { getLessonTopics } from '@/app/classes/[className]/lessons/actions'

const mockTopics = ['topic 1', 'topic 2', 'topic 3', 'topic 4', 'topic 5', 'topic 6', 'topic 7']

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const convertToObject = (values: string[]) => {
  return values.reduce((acc: Record<string, string>, option, index) => {
    acc[`option${index + 1}`] = option
    return acc
  }, {})
}

const MultipleChoiceQuestion = () => {
  const editorRef = useRef<EditorView | null>(null)

  const [snippetIncluded, setSnippetIncluded] = useState(false)
  const [questionTopics, setQuestionTopics] = useState<string[]>([])
  const {
    questionPrompt,
    setQuestionPrompt,
    questionType,
    setQuestionType,
    questionSnippet,
    setQuestionSnippet,
    questionOptions,
    setQuestionOptions,
    correctAnswer,
    setCorrectAnswer,
    topicsCovered,
    setTopicsCovered,
  } = useQuestionContext()

  const handleEditorLoad = (view: EditorView) => {
    editorRef.current = view
  }

  const handleQuestionPromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionPrompt(e.target.value)
  }

  const handleSnippetInput = (value: string) => {
    setQuestionSnippet(value)
  }

  const showSnippet = () => {
    setSnippetIncluded(true)
  }

  const hideSnippet = () => {
    setQuestionSnippet('')
    setSnippetIncluded(false)
  }

  const handleOptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // TODO: convert this to be a list of objects and update it accordingly
    // setQuestionOptions({ ...questionOptions, [name]: value })

    const inputToUpdate = questionOptions.find(option => Object.keys(option)[0] === name)
    const index = questionOptions.indexOf(inputToUpdate)
    const updatedOptions = [...questionOptions]
    updatedOptions[index] = { [name]: value }
    setQuestionOptions(updatedOptions)
  }

  const handleAddNewOption = () => {
    setQuestionOptions(prev => {
      return [...prev, { [`option${prev.length + 1}`]: '' }]
    })
  }

  const deleteQuestionOption = (key: string) => {
    const isKeyCorrectAnswer = questionOptions.some(option => Object.keys(option)[0] === key)
    setCorrectAnswer(isKeyCorrectAnswer ? '' : correctAnswer)

    // this is to remap the options to be in the format of [{option1: 'value'}, {option2: 'value'}]
    // if we don't do this, it's possible that the options will be in the format of [{option1: 'value'}, {option3: 'value'},..]
    // and this messes up the correct answer select
    const remappedOptions = questionOptions
      .filter(option => Object.keys(option)[0] !== key)
      .map((option, index) => {
        return { [`option${index + 1}`]: Object.values(option)[0] }
      })
    setQuestionOptions(remappedOptions)
  }

  const handleCorrectAnswerSelect = (e: SelectChangeEvent<string>) => {
    setCorrectAnswer(e.target.value)
  }

  const handleTopicsCovered = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e
    setTopicsCovered(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    // Case: where user is editing a multiple choice question
    if (
      questionOptions.length > 0 &&
      questionOptions.every(option => typeof Object.values(option)[0] === 'string')
    ) {
      const optionValues = questionOptions.map((option, index) => ({
        [`option${index + 1}`]: option,
      }))
      setQuestionOptions(optionValues)
    }
    // Case: where user is creating a new multiple choice question OR user is switching from another question type
    else if (
      questionOptions.length === 0 ||
      !questionOptions.every(option => typeof Object.values(option)[0] === 'string')
    ) {
      setQuestionOptions([{ option1: '' }, { option2: '' }])
    }
  }, [])

  // useEffect(() => {
  //   const fetchLessonTopics = async () => {
  //     const response = await getLessonTopics('className')
  //     if (response.success) {
  //       const { topics } = response
  //       setQuestionOptions(topics ?? [])
  //     }
  //   }
  //   fetchLessonTopics()
  // }, [])

  return (
    <>
      <TextField
        autoFocus
        required
        multiline
        rows={4}
        placeholder="Enter your question prompt"
        label="Question Prompt"
        variant="standard"
        value={questionPrompt}
        onChange={handleQuestionPromptInput}
        sx={{ width: '30rem' }}
      />
      {snippetIncluded || questionSnippet !== '' ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <CodeMirror
            value={questionSnippet}
            onChange={handleSnippetInput}
            height="300px"
            width="700px"
            extensions={[python()]}
            theme={oneDark}
            onUpdate={(viewUpdate: { view: EditorView }) => handleEditorLoad(viewUpdate.view)}
          />

          <IconButton color="error" onClick={hideSnippet}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ) : (
        <Button onClick={showSnippet}>Add Snippet</Button>
      )}

      <Box
        id="options"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          flexWrap: 'wrap',
          width: '50%',
        }}
      >
        {questionOptions.map((option, index) => {
          const optionKey = `option${index + 1}`
          return (
            <Box key={index}>
              <TextField
                required
                label={`Option ${index + 1}`}
                name={optionKey}
                variant="standard"
                value={option[optionKey]}
                onChange={handleOptionInput}
              />
              <IconButton
                disabled={Object.values(questionOptions).length === 2}
                color="error"
                onClick={() => deleteQuestionOption(optionKey)}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          )
        })}
      </Box>
      <Box id="add-new-option-button">
        <Button
          variant="contained"
          disabled={questionOptions.length === 10}
          onClick={handleAddNewOption}
        >
          Add Option
        </Button>
      </Box>
      <FormControl>
        <InputLabel id="correct-answer">Correct Answer</InputLabel>
        <Select
          required
          labelId="correct-answer"
          label="Correct Answer"
          variant="standard"
          value={correctAnswer}
          onChange={handleCorrectAnswerSelect}
          sx={{ width: '15em' }}
        >
          {questionOptions.map((option, index) => (
            <MenuItem key={index} value={option[`option${index + 1}`]}>
              {option[`option${index + 1}`]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="topics-covered">Topics Covered</InputLabel>
        <Select
          required
          label="topics-covered"
          variant="standard"
          multiple
          value={topicsCovered}
          onChange={handleTopicsCovered}
          renderValue={(selected: string[]) => selected.join(', ')}
          sx={{ width: '15em' }}
          MenuProps={MenuProps}
        >
          {questionTopics.map((topic, index) => (
            <MenuItem key={index} value={topic}>
              <Checkbox checked={topicsCovered.includes(topic)} />
              {topic}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default MultipleChoiceQuestion
