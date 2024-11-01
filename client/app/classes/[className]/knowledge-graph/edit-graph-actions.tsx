import { Add, Save, ExitToApp, Edit } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  SpeedDial,
  SpeedDialAction,
} from '@mui/material'
import { type Node, type Edge } from '@xyflow/react'
import React, { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

const EditGraphActions = ({
  setInEditMode,
  setInteractionProps,
  initialReactFlowData,
  setReactFlowData,
}: {
  setInEditMode: Dispatch<SetStateAction<boolean>>
  setInteractionProps: Dispatch<
    SetStateAction<{
      nodesDraggable: boolean
      nodesConnectable: boolean
      elementsSelectable: boolean
    }>
  >
  initialReactFlowData: {
    reactFlowNodes: Node[]
    reactFlowEdges: Edge[]
  }
}) => {
  const [oldReactFlowData, setOldReactFlowData] = useState(initialReactFlowData)
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
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)

  const handleOpenDialog = () => setOpen(true)

  const handleCloseDialog = () => {
    setOpen(false)
    setInputState({ parentNodes: '', nodeTopic: '', targetNodes: '' })
  }
  const exitEditMode = () => {
    setOpenConfirmationDialog(true)
  }

  const handleExitWithoutSaving = () => {
    setReactFlowData(oldReactFlowData)
    setInEditMode(false)
    setInteractionProps({
      nodesDraggable: false,
      nodesConnectable: false,
      elementsSelectable: false,
    })
    setOpenConfirmationDialog(false)
  }
  const editActions = useMemo(
    () => [
      { icon: <Add />, name: 'Add Node', onClick: handleOpenDialog },
      { icon: <Save />, name: 'Save Changes', onClick: () => alert('will save graph later') },
      { icon: <ExitToApp />, name: 'Exit Edit Mode', onClick: exitEditMode },
    ],
    []
  )

  const addDataToGraph = (e: React.FormEvent<HTMLFormElement>) => {
    // TODO: rework this to use server side
    e.preventDefault()
    alert('will add node to graph later')
  }

  return (
    <>
      <SpeedDial ariaLabel="Graph Edit Actions" icon={<Edit />} direction="right">
        {editActions.map(({ icon, name, onClick }, index) => (
          <SpeedDialAction key={index} icon={icon} tooltipTitle={name} onClick={onClick} />
        ))}
      </SpeedDial>
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

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>Exit without saving?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)}>No</Button>
          <Button color="error" onClick={handleExitWithoutSaving}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditGraphActions
