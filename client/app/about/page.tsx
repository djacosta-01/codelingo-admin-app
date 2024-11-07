'use client'

import { Box, Typography } from '@mui/material'
import Navbar from '@/components/nav-and-sidemenu/navbar'

const About = () => {
  return (
    <>
      <Navbar displaySideMenu={false} isSideMenuOpen={false} handleMenuOpen={() => {}} />
      <Box
        sx={{
          marginTop: '70px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
          minHeight: '100vh',
          // backgroundColor: 'pink',
        }}
      >
        <Typography variant="h3" sx={{ textDecoration: 'underline' }}>
          About {`<insert name here>`}
        </Typography>
        <Box sx={{ width: '60%' }}>
          Students retain information best when they are consistently reviewing it and obtaining
          practice applying it through space-repetion exercises. {`<insert name here>`} is a tool
          for professors that attempts to help students do just that. Inspired by other learning
          platforms such as Duolingo, {`<insert name here>`} has professors create mini review
          lessons that are tailored to their specific course material, and students can complete
          these lessons to help reinforce their understanding at their own pace.
        </Box>
        <Box sx={{ width: '60%' }}>
          The main feature of {`<insert name here>`} is the ability for professors to also create a
          knowledge graph that visually represents the connections between different concepts in
          their course. Each node in the graph represents a concept, and each edge represents a
          prerequisite link between two concepts. For example, in an intro to computer science
          course, a possible node could be {'loops'} and a possible edge could be {'loops'} {`--->`}{' '}
          {'arrays'}. This signifies that students should ideally understand loops before they can
          understand arrays.
        </Box>
        <Box sx={{ width: '60%' }}>
          As students complete lessons, the {`class's`} knowledge graph will update to reflect the
          {`student's`} progress. This can help professors identify which concepts students are
          struggling with and which concepts they are excelling in. Professors can then use this
          information to adjust their teaching methods accordingly, and create more targeted review
          lessons for their students. To assist in this process, {`<insert name here>'s`} knowledge
          graph feature also uses AI driven insights to help professors identify which concepts are
          most important to review.
        </Box>
        <Box sx={{ width: '60%' }}>
          {`<insert name here>`} is a work in progress, and we are constantly looking for ways to
          improve the platform. If you have any feedback or suggestions, please feel free to reach
          out to us at {`<insert email here>`}.
        </Box>
      </Box>
    </>
  )
}

export default About
