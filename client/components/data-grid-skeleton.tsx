import { Box } from '@mui/material'
import { GridColDef, DataGrid } from '@mui/x-data-grid'

const TestSkeleton = ({ columns }: { columns: GridColDef[] }) => {
  return (
    <Box
      id="test-skeleton"
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
      }}
    >
      <DataGrid
        columns={columns}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
      />
    </Box>
  )
}
