'use client'

const MultipleChoiceQuestion = () => {
  return <div>UNDER CONSTRUCTION</div>
}

// <TextField
//   autoFocus
//   required
//   multiline
//   rows={4}
//   placeholder="Enter your question prompt"
//   label="Question Prompt"
//   variant="standard"
//   value={questionPrompt}
//   onChange={e => setQuestionPrompt(e.target.value)}
//   sx={{ width: '30rem' }}
// />
// <Box
//   id="options"
//   sx={{
//     display: 'flex',
//     justifyContent: 'center',
//     gap: 3,
//     flexWrap: 'wrap',
//     width: '50%',
//   }}
// >
//   {Object.values(options).map((option, index) => {
//     const optionKey = `option${index + 1}`
//     return (
//       <Box key={index}>
//         <TextField
//           required
//           label={`Option ${index + 1}`}
//           name={optionKey}
//           variant="standard"
//           value={option}
//           onChange={handleOptionInput}
//         />
//         <IconButton
//           disabled={Object.values(options).length === 2}
//           color="error"
//           onClick={() => deleteAnswerFromForm(optionKey)}
//         >
//           <RemoveIcon />
//         </IconButton>
//       </Box>
//     )
//   })}
// </Box>
// <Box id="add-new-option-button">
//   <Button
//     variant="contained"
//     disabled={Object.values(options).length === 10}
//     onClick={() =>
//       setOptions(prev => {
//         return { ...prev, [`option${Object.keys(prev).length + 1}`]: '' }
//       })
//     }
//   >
//     Add Option
//   </Button>
// </Box>
// <FormControl>
//   <InputLabel id="correct-answer">Correct Answer</InputLabel>
//   <Select
//     required
//     labelId="correct-answer"
//     label="Correct Answer"
//     variant="standard"
//     sx={{ width: '15em' }}
//     value={Object.values(options).includes(correctAnswer) ? correctAnswer : ''}
//     onChange={handleCorrectAnswerSelect}
//   >
//     {Object.values(options).map((option, index) => (
//       <MenuItem key={index} value={option}>
//         {option}
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl>
export default MultipleChoiceQuestion
