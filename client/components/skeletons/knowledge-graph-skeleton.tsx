import { Box, Skeleton, IconButton, Typography, Paper } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import EditableNode from '../custom-graph-nodes/editable-node'

// import {
//   type Node,
//   type Edge,
//   ReactFlow,
//   Controls,
//   Background,
//   useReactFlow,
//   ReactFlowProvider,
// } from '@xyflow/react'
// const skeletonNodes = [
//   {
//     id: '1',
//     type: 'editableNode',
//     position: { x: 100, y: 100 },
//     data: { label: 'Node 1' },
//   },
//   {
//     id: '2',
//     type: 'editableNode',
//     position: { x: 200, y: 200 },
//     data: { label: 'Node 2' },
//   },
// ]

// const skeletonEdges = [
//   {
//     id: 'e1-2',
//     source: '1',
//     target: '2',
//   },
// ]

const KnowledgeGraphSkeleton = () => {
  return (
    <>
      <Box id="button" sx={{ paddingTop: 1, paddingLeft: 1 }}>
        <Skeleton variant="circular">
          <IconButton>
            <HelpIcon id="help-button" color="info" fontSize="large" />
          </IconButton>
        </Skeleton>
      </Box>

      <Box
        id="knowledge-graph"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* <Skeleton variant="rectangular" width={500} height={500} /> */}
        <Box
          sx={{
            // backgroundColor: 'pink',
            height: '80vh',
            width: '80vw',
          }}
        >
          <Skeleton>
            <Paper
              elevation={8}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '3em',
                width: '10em',
                outline: 'solid 1px',
              }}
            >
              <Typography variant="h6" />
            </Paper>
          </Skeleton>
        </Box>
      </Box>
    </>
  )
}

export default KnowledgeGraphSkeleton
