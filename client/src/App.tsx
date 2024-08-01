import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { supabase } from './supabaseClient/supabaseClient.js'
import Login from './Components/Login/Login.jsx'
import Home from './Components/Homepage/Home.tsx'
import StudentPerformance from './Components/StudentPages/StudentPerformance.jsx'
import React from 'react'
import Lessons from './Components/Lessons/Lessons.jsx'
import AddLessons from './Components/Lessons/AddNewLesson/AddLessons.jsx'
import Roster from './Components/StudentPages/Roster.jsx'
import ClassroomSettings from './Components/StudentPages/ClassroomSettings.jsx'
import Lesson from './Components/Lessons/Lesson.jsx'
import AuthenticatedRoute from './Components/PrivateRoute.jsx'
import KnowledgeGraph from './Components/KnowledgeGraph/KnowledgeGraph.jsx'

const items = [
  {
    id: 'cmsi-1010',
    title: 'CMSI 1010 - 02',
    backgroundImage: 'class1.jpg',
  },
  {
    id: 'cmsi-2120',
    title: 'CMSI 2120 - 01',
    backgroundImage: 'class2.jpg',
  },
  {
    id: 'cmsi-3801',
    title: 'CMSI 3801 - 01',
    backgroundImage: 'class3.jpg',
  },
]
const handleSelectItem = (item: { id: string; title: string; backgroundImage: string }) => {
  console.log('item', item)
}

function App() {
  // TODO: once user is authenticated, fetch user data and pass in relevant data to components as props?
  const [session, setSession] = useState(null)

  // TODO: have a className state to store the class name and pass it to the Lessons component

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
                  <Home items={items} heading="My Classes" onSelectItem={handleSelectItem} />
                </AuthenticatedRoute>
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/lessons"
            element={
              <AuthenticatedRoute session={session}>
                <Lessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/lesson/:lessonName"
            element={
              <AuthenticatedRoute session={session}>
                <Lesson />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-lessons"
            element={
              <AuthenticatedRoute session={session}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-lessons/:lessonName"
            element={
              <AuthenticatedRoute session={session}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/class-performance"
            element={
              <AuthenticatedRoute session={session}>
                <StudentPerformance />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/knowledge-graph"
            element={
              <AuthenticatedRoute session={session}>
                <KnowledgeGraph />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/roster"
            element={
              <AuthenticatedRoute session={session}>
                <Roster />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/class-settings"
            element={
              <AuthenticatedRoute session={session}>
                <ClassroomSettings />
              </AuthenticatedRoute>
            }
          />
        </Routes>
      </Router>
    </Box>
  )
}

export default App
