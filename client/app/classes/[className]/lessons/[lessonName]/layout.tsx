import { Box } from '@mui/material'

const QuestionPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      {children}
    </Box>
  )
}

export default QuestionPageLayout
