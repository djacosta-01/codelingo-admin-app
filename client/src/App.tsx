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
import QrCode from './qrCode.jsx'

// const items = [
//   {
//     id: 'cmsi-1010',
//     title: 'CMSI 1010 - 02',
//     backgroundImage: 'class1.jpg',
//   },
//   {
//     id: 'cmsi-2120',
//     title: 'CMSI 2120 - 01',
//     backgroundImage: 'class2.jpg',
//   },
//   {
//     id: 'cmsi-3801',
//     title: 'CMSI 3801 - 01',
//     backgroundImage: 'class3.jpg',
//   },
// ]
// const handleSelectItem = (item: { id: string; title: string; backgroundImage: string }) => {
//   console.log('item', item)
// }

function App() {
  // TODO: once user is authenticated, fetch user data and pass in relevant data to components as props?
  const [session, setSession] = useState(null)

  // authenticating user
  useEffect(() => {
    const currentSession = supabase.auth.getSession()
    setSession(currentSession)

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Box className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              session ? (
                <AuthenticatedRoute session={session}>
                  <Home />
                </AuthenticatedRoute>
              ) : (
                <Login />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          {/* <Route
            path="/test-route"
            element={<h2>Welcome! Please check your email and verify your account</h2>}
          /> */}
          <Route
            path="/classes/:className/lessons"
            element={
              <AuthenticatedRoute session={session}>
                <Lessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/lessons/lesson/:lessonName"
            element={
              <AuthenticatedRoute session={session}>
                <Lesson />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/add-lessons"
            element={
              <AuthenticatedRoute session={session}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/add-lessons/:lessonName"
            element={
              <AuthenticatedRoute session={session}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/classes/:className/knowledge-graph"
            element={
              <AuthenticatedRoute session={session}>
                <KnowledgeGraph />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/roster"
            element={
              <AuthenticatedRoute session={session}>
                <Roster />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/class-performance"
            element={
              <AuthenticatedRoute session={session}>
                <StudentPerformance />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/classes/:className/class-settings"
            element={
              <AuthenticatedRoute session={session}>
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
