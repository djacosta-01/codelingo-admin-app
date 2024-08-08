import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Select,
} from '@mui/material'
import { useState, useEffect } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { supabase } from '../../../../supabaseClient/supabaseClient'

const AnswerChoices = ({ answers, setAnswers }) => {
  const [answerOne, setAnswerOne] = useState('')
  const [answerTwo, setAnswerTwo] = useState('')
  const [answerThree, setAnswerThree] = useState('')
  const [answerFour, setAnswerFour] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')

  useEffect(() => {
    setAnswers({
      ...answers,
      options: [answerOne, answerTwo, answerThree, answerFour],
      correctAnswer,
    })
  }, [correctAnswer, answerOne, answerTwo, answerThree, answerFour, answers, setAnswers])

  return (
    <Box id="answer-choices-container">
      <FormControl>
        <RadioGroup
          id="answer-choices-radio-group"
          value={correctAnswer}
          onChange={event => setCorrectAnswer(event.target.value)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box id="answer-option-1" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Radio required value={answerOne} />
            <TextField
              required
              id="choice-1-input"
              label="Answer 1"
              value={answerOne}
              onChange={event => setAnswerOne(event.target.value)}
            />
          </Box>
          <Box id="answer-option-2" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Radio required value={answerTwo} />
            <TextField
              required
              id="choice-2-input"
              label="Answer 2"
              value={answerTwo}
              onChange={event => setAnswerTwo(event.target.value)}
            />
          </Box>
          <Box id="answer-option-3" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Radio required value={answerThree} />
            <TextField
              required
              id="choice-3-input"
              label="Answer 3"
              value={answerThree}
              onChange={event => setAnswerThree(event.target.value)}
            />
          </Box>
          <Box id="answer-option-4" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Radio required value={answerFour} />
            <TextField
              required
              id="choice-4-input"
              label="Answer 4"
              value={answerFour}
              onChange={event => setAnswerFour(event.target.value)}
            />
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

const MultipleChoice = ({ topics, prevData, setLessonData, resetQuestionFormat }) => {
  const [answers, setAnswers] = useState({
    options: [],
    correctAnswer: '',
  })
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    snippet: '',
    topicsCovered: [],
    // options: [],
    // correctAnswer: '',
  })

  const handleInputChange = _event => {
    const { name, value } = _event.target
    setNewQuestion(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveQuestion = async event => {
    event.preventDefault()
    const question = {
      prompt: newQuestion.prompt,
      snippet: newQuestion.snippet,
      topicsCovered: newQuestion.topicsCovered,
      options: answers.options,
      correctAnswer: answers.correctAnswer,
    }
    const { data, error } = await supabase
      .from('lessons')
      .update({ questions: [...prevData.lessonQuestions, question] })
      .eq('lesson_id', prevData.lessonID)
    if (error) {
      console.error('Error adding question: ', error)
      return
    } else {
      setLessonData(prev => ({
        ...prev,
        lessonQuestions: [...prev.lessonQuestions, question],
      }))
      alert('Question added to lesson')
    }
    resetQuestionFormat('')
  }

  return (
    <Box
      id="multiple-choice-container"
      sx={{
        width: '50vw',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={saveQuestion} style={{ width: 'inherit' }}>
        <TextField
          id="question-prompt-input"
          name="prompt"
          label="Question Prompt"
          value={newQuestion.prompt}
          onChange={handleInputChange}
          multiline
          rows={3}
          required
          fullWidth
        />
        <TextField
          id="code-snippet-input"
          name="snippet"
          label="Code Snippet"
          value={newQuestion.snippet}
          onChange={handleInputChange}
          multiline
          rows={3}
          // required
          fullWidth
        />
        <Select
          required
          id="relevant-topics-for-question-select"
          multiple
          displayEmpty
          name="topicsCovered"
          value={newQuestion.topicsCovered}
          renderValue={selected =>
            selected?.length === 0 ? 'Topics Covered' : selected?.join(', ')
          }
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MenuItem>
              <em>Select topics</em>
            </MenuItem>
            {topics.map((topic, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={newQuestion.topicsCovered.includes(topic)}
                    onChange={_event => {
                      if (newQuestion.topicsCovered.includes(topic)) {
                        setNewQuestion(prev => ({
                          ...prev,
                          topicsCovered: prev.topicsCovered.filter(id => id !== topic),
                        }))
                      } else {
                        setNewQuestion(prev => ({
                          ...prev,
                          topicsCovered: [...prev.topicsCovered, topic],
                        }))
                      }
                    }}
                    name={topic}
                  />
                }
                label={topic}
              />
            ))}
          </Box>
        </Select>
        <AnswerChoices answers={answers} setAnswers={setAnswers} />
        <Box id="save-button" sx={{ margin: 5 }}>
          <Tooltip title="Save Question" arrow>
            <IconButton type="submit">
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </form>
    </Box>
  )
}

export default MultipleChoice
