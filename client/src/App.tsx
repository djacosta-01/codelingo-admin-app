import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient/supabaseClient.js'
import Login from './Components/Login/Login.jsx'
import Home from './Components/DashBoard/DashboardComponents/Home.tsx'
import StudentPerformance from './Components/ClassPage/Pages/StudentPerformance.jsx'
import Setting from './Components/DashBoard/DashboardComponents/Setting.js'
import React from 'react'
import Lessons from './Components/ClassPage/Lessons/Lessons.jsx'
import AddLessons from './Components/ClassPage/Lessons/AddNewLesson/AddLessons.jsx'
import EditKnowledgeGraph from './Components/ClassPage/KnowledgeGraph/EditKnowledgeGraph.jsx'
import Roster from './Components/ClassPage/Pages/Roster.jsx'
import ClassroomSettings from './Components/ClassPage/Pages/ClassroomSettings.jsx'
import Navbar from './Components/Navbar.jsx'
import Lesson from './Components/ClassPage/Lessons/Lesson.jsx'
import AuthenticatedRoute from './Components/PrivateRoute.jsx'

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

  // authenticating user
  useEffect(() => {
    const currentSession = supabase.auth.getSession()
    setSession(currentSession)

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="App">
      <Router>
        {!session ? '' : <Navbar />}
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
          ></Route>
          <Route
            path="/lesson"
            element={
              <AuthenticatedRoute session={session}>
                <Lesson />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/add-lessons"
            element={
              <AuthenticatedRoute session={session}>
                <AddLessons />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/class-performance"
            element={
              <AuthenticatedRoute session={session}>
                <StudentPerformance />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/knowledge-graph"
            element={
              <AuthenticatedRoute session={session}>
                <EditKnowledgeGraph />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/roster"
            element={
              <AuthenticatedRoute session={session}>
                <Roster />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/class-settings"
            element={
              <AuthenticatedRoute session={session}>
                <ClassroomSettings />
              </AuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/setting"
            element={
              <AuthenticatedRoute session={session}>
                <Setting />
              </AuthenticatedRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
