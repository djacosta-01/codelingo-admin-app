import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Select,
} from '@mui/material'
import { useState, useEffect } from 'react'
import CheckIcon from '@mui/icons-material/Check'

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
        {/* <FormLabel>Answer Options</FormLabel> */}
      </FormControl>
    </Box>
  )
}

const MultipleChoice = ({ setEnteredQuestions, topics, setQuestionData, resetQuestionFormat }) => {
  const [prompt, setPrompt] = useState('')
  const [snippet, setsnippet] = useState('')
  const [answers, setAnswers] = useState({
    options: [],
    correctAnswer: '',
  })

  const saveQuestion = event => {
    event.preventDefault()
    alert('functionality not implemented yet')
    // console.log('saving question')
    // console.log(answers.correctAnswer)
    // if (answers.correctAnswer === '') {
    //   alert('Please select a correct answer')
    //   return
    // }
    // setEnteredQuestions(prev => prev + 1)
    // setQuestionData(prevData => [
    //   ...prevData,
    //   {
    //     questionType: 'Multiple Choice',
    //     prompt,
    //     snippet,
    //     topicsCovered: topicsToDisplay,
    //     options: answers.options,
    //     answer: answers.correctAnswer,
    //   },
    // ])
    // setPrompt('')
    // setsnippet('')
    // setAnswers({
    //   options: [],
    //   correctAnswer: '',
    // })
    // setTopicsToDisplay([])
    // resetQuestionFormat('')
  }
  const [questionTopics, setQuestionTopics] = useState([])
  return (
    <Box
      sx={{
        width: '50vw',
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <form onSubmit={saveQuestion} style={{ width: 'inherit' }}>
        <TextField
          id="question-prompt-input"
          label="Question Prompt"
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          multiline
          rows={3}
          required
          fullWidth
        />
        <TextField
          id="code-snippet-input"
          label="Code Snippet"
          value={snippet}
          onChange={event => setsnippet(event.target.value)}
          multiline
          rows={3}
          required
          fullWidth
        />
        <Select
          required
          id="relevant-topics-for-question-select"
          multiple
          displayEmpty
          value={questionTopics}
          renderValue={selected => (selected.length === 0 ? 'Topics Covered' : selected.join(', '))}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
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
                    checked={questionTopics.includes(topic)}
                    onChange={_event => {
                      if (questionTopics.includes(topic)) {
                        setQuestionTopics(prev => prev.filter(id => id !== topic))
                      } else {
                        setQuestionTopics(prev => [...prev, topic])
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
        <Box id="save-button">
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
