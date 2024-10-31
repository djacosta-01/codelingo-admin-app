import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from '@mui/material'
import React, { useState } from 'react'

const Buttons = ({ handleOpenDialog }: { handleOpenDialog: () => void }) => {
  return (
    <Box
      id="add-save-buttons"
      sx={{
        display: 'flex',
        gap: 2,
        position: 'fixed',
        bottom: 45,
        right: 20,
      }}
    >
      <Button variant="contained" onClick={handleOpenDialog}>
        Add
      </Button>
      <Button variant="contained" color="success" onClick={() => alert('will save graph later')}>
        Save
      </Button>
    </Box>
  )
}

export const AddNodeForm = () => {
  /**
   * ----------------------------------------------
   * Input states and functions
   * ----------------------------------------------
   * */
  const [inputState, setInputState] = useState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  const handleInputChange = (_event: React.ChangeEvent<HTMLInputElement>) =>
    setInputState({
      ...inputState,
      [_event.target.name]: _event.target.value,
    })

  /**
   * ----------------------------------------------
   * Dialog state and functions
   * ----------------------------------------------
   * */
  const [open, setOpen] = useState(false)
  const handleOpenDialog = () => setOpen(true)

  const handleCloseDialog = () => {
    setOpen(false)
    setInputState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  }

  /**
   * ----------------------------------------------
   * Form submission function
   * ----------------------------------------------
   * */
  const addDataToGraph = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: rework this to use server side
  }

  // TODO: move this to server side
  //   const saveGraphData = async () => {
  //     // TODO: use upsert instead of update
  //     const { data, error } = await supabase.from('class_knowledge_graph').update({
  //       nodes,
  //       edges,
  //       react_flow_data: [
  //         {
  //           reactFlowNodes: reactFlowData.reactFlowNodes,
  //           reactFlowEdges: reactFlowData.reactFlowEdges,
  //         },
  //       ],
  //     })
  //     if (error) {
  //       console.error('Error saving graph data: ', error)
  //     } else {
  //       alert('Graph data saved successfully')
  //     }
  //   }

  return (
    <>
      <Buttons handleOpenDialog={handleOpenDialog} />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        PaperProps={{ component: 'form', onSubmit: addDataToGraph }}
      >
        <DialogTitle>Adding Node</DialogTitle>
        <DialogContent>
          <Box>THIS IS UNDER CONSTRUCTION</Box>
          <TextField
            required
            variant="standard"
            type="search"
            name={'nodeTopic'}
            label="Node Name"
            value={inputState.nodeTopic}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button type="submit">Add Node</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
