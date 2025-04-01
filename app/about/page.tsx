'use client'

import { Box, Typography, useTheme, alpha } from '@mui/material'
import Navbar from '@/components/nav-and-sidemenu/navbar'

const About = () => {
  const theme = useTheme()

  return (
    <>
      <Navbar displaySideMenu={false} isSideMenuOpen={false} handleMenuOpen={() => {}} />
      <Box
        component="main"
        aria-label="About {`<Insert New App Name Here>`}"
        sx={{
          marginTop: '70px',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4 },
          alignItems: 'center',
          minHeight: '100vh',
          padding: { xs: '1rem', sm: '2rem' },
          bgcolor: 'background.default',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            color: 'primary.main',
            marginBottom: '1rem',
            fontWeight: 600,
            textAlign: 'center',
            width: 'fit-content',
          }}
        >
          About {`<Insert New App Name Here>`}
        </Typography>

        <Box
          component="section"
          aria-labelledby="mission-title"
          sx={{
            width: { xs: '95%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
            padding: { xs: '1.5rem', sm: '2rem' },
            borderRadius: '8px',
            boxShadow: theme.shadows[1],
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme =>
              theme.palette.mode === 'dark' ? alpha(theme.palette.grey[700], 0.3) : 'transparent',
          }}
        >
          <Typography
            id="mission-title"
            variant="h5"
            sx={{ marginBottom: '1rem', color: 'primary.main' }}
          >
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            Students retain information best when they are consistently reviewing it and obtaining
            practice applying it through space-repetition exercises. {`<Insert New App Name Here>`}{' '}
            is an innovative educational platform designed to revolutionize how programming and
            computer science concepts are taught and learned. Our platform empowers professors to
            create tailored review lessons that adapt to each student&apos;s learning pace and
            style.
          </Typography>
        </Box>

        <Box
          component="section"
          aria-labelledby="technology-title"
          sx={{
            width: { xs: '95%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
            padding: { xs: '1.5rem', sm: '2rem' },
            borderRadius: '8px',
            boxShadow: theme.shadows[1],
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme =>
              theme.palette.mode === 'dark' ? alpha(theme.palette.grey[700], 0.3) : 'transparent',
          }}
        >
          <Typography
            id="technology-title"
            variant="h5"
            sx={{ marginBottom: '1rem', color: 'primary.main' }}
          >
            Knowledge Graph Technology
          </Typography>
          <Typography variant="body1" paragraph>
            At the heart of {`<Insert New App Name Here>`} is our innovative knowledge graph system.
            This powerful feature allows professors to create visual representations of course
            concepts and their interconnections. Each node represents a key concept, while edges
            show prerequisite relationships between topics. For instance, in an introductory
            computer science course, concepts like &apos;loops&apos; and &apos;arrays&apos; are
            connected to show their learning dependencies.
          </Typography>
        </Box>

        <Box
          component="section"
          aria-labelledby="ai-title"
          sx={{
            width: { xs: '95%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
            padding: { xs: '1.5rem', sm: '2rem' },
            borderRadius: '8px',
            boxShadow: theme.shadows[1],
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme =>
              theme.palette.mode === 'dark' ? alpha(theme.palette.grey[700], 0.3) : 'transparent',
          }}
        >
          <Typography
            id="ai-title"
            variant="h5"
            sx={{ marginBottom: '1rem', color: 'primary.main' }}
          >
            AI-Powered Learning Insights
          </Typography>
          <Typography variant="body1" paragraph>
            As students progress through lessons, our intelligent system tracks and analyzes their
            performance through the class&apos;s knowledge graph. This data helps professors
            identify learning patterns, pinpoint challenging concepts, and create targeted review
            materials. Our AI-driven insights provide valuable recommendations for curriculum
            adjustments and highlight areas where additional support may be needed.
          </Typography>
        </Box>

        <Box
          component="section"
          aria-labelledby="contact-title"
          sx={{
            width: { xs: '95%', sm: '80%', md: '60%' },
            bgcolor: 'background.paper',
            padding: { xs: '1.5rem', sm: '2rem' },
            borderRadius: '8px',
            boxShadow: theme.shadows[1],
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme =>
              theme.palette.mode === 'dark' ? alpha(theme.palette.grey[700], 0.3) : 'transparent',
          }}
        >
          <Typography
            id="contact-title"
            variant="h5"
            sx={{ marginBottom: '1rem', color: 'primary.main' }}
          >
            Get in Touch
          </Typography>
          <Typography variant="body1" paragraph>
            {`<Insert New App Name Here>`} is constantly evolving, and we value your input in
            shaping its future. If you have suggestions, feedback, or questions, please reach out to
            our team at{' '}
            <Box
              component="a"
              href="mailto:contact@{`<Insert New App Name Here>`}.edu"
              aria-label="Email {`<Insert New App Name Here>`} Support"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              contact@{`<Insert New App Name Here>`}.edu
            </Box>
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default About
