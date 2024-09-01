import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { supabase } from './supabaseClient/supabaseClient.js'
import Login from './Components/Authentication/Login/Login.jsx'
import Register from './Components/Authentication/Registration/Registration.jsx'
import Home from './Components/Homepage/Home.jsx'
import StudentPerformance from './Components/StudentPages/StudentPerformance.jsx'
import React from 'react'
import Lessons from './Components/Lessons/Lessons.jsx'
import AddLessons from './Components/Lessons/AddNewLesson/AddLessons.jsx'
import Roster from './Components/StudentPages/Roster.jsx'
import ClassroomSettings from './Components/StudentPages/ClassroomSettings.jsx'
import Lesson from './Components/Lessons/Lesson.jsx'
import AuthenticatedRoute from './Components/PrivateRoute.jsx'
import KnowledgeGraph from './Components/KnowledgeGraph/KnowledgeGraph.jsx'
import QrCode from './qrCode.jsx' // for testing purposes right now

function App() {
  // TODO: once user is authenticated, fetch user data and pass in relevant data to components as props?
  const [userSession, setUserSession] = useState(null)

  // authenticating user
  useEffect(() => {
    const currentSession = supabase.auth.getSession()
    // console.log(currentSession)
    if (currentSession) setUserSession(currentSession)

    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log(_event, session)
      setUserSession(session)
    })
  }, [])

  return (
    <Box className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <AuthenticatedRoute session={userSession}>
                <Home />
              </AuthenticatedRoute>
            }
          />
          {/* <Route
            path="/test-route"
            element={<h2>Welcome! Please check your email and verify your account</h2>}
          /> */}
          <Route
            path="/classes/:className/lessons"
            element={
              <AuthenticatedRoute session={userSession}>
                <Lessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/lessons/lesson/:lessonName"
            element={
              <AuthenticatedRoute session={userSession}>
                <Lesson />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/add-lessons"
            element={
              <AuthenticatedRoute session={userSession}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/add-lessons/:lessonName"
            element={
              <AuthenticatedRoute session={userSession}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/classes/:className/knowledge-graph"
            element={
              <AuthenticatedRoute session={userSession}>
                <KnowledgeGraph />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/roster"
            element={
              <AuthenticatedRoute session={userSession}>
                <Roster />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/class-performance"
            element={
              <AuthenticatedRoute session={userSession}>
                <StudentPerformance />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/class-settings"
            element={
              <AuthenticatedRoute session={userSession}>
                <ClassroomSettings />
              </AuthenticatedRoute>
            }
          />
          <Route path="/test-code" element={<QrCode />} />
        </Routes>
      </Router>
    </Box>
  )
}

export default App
