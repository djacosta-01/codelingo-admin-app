import React from 'react'
import './Home.css'
import NewClass from './NewClass.js'
import { useState } from 'react'
import Navbar from '../../Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import NavbarWithSideMenu from '../../ClassPage/NavbarAndSideMenu/NavbarWithSideMenu.jsx'
// import { handle } from "express/lib/application";

interface Props {
  items: { id: string; title: string; backgroundImage: string }[]
  heading: string
  onSelectItem: (item: { id: string; title: string; backgroundImage: string }) => void
}

export default function Home({ items, heading, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isNewClassActive, setIsNewClassActive] = useState(false)
  const [newItems, setNewItems] = useState(items) // State for managing updated items list
  const navigate = useNavigate()

  const handleNewClass = newItem => {
    // Function to handle creating a new class
    setNewItems([...newItems, newItem]) // Add new item to the list
    setIsNewClassActive(false) // Close the NewClass form after creation
  }

  const navigateToLessonsPage = query => {
    // console.log('Navigating to lessons for class:', query)
    const className = query.toLowerCase().replace(/\s+/g, '')
    // console.log('className:', className)
    navigate(`/lessons?class=${className}`)
  }

  return (
    <>
      <NavbarWithSideMenu displaySideMenu={false} />
      <h1>{heading}</h1>
      <div className="container">
        {items.map((item, index) => (
          // Make this a paper component
          <a
            // href={`/class/${item.id}`}
            className={`list-group-item ${selectedIndex === index ? 'active' : ''}`}
            key={item.id}
            onClick={() => {
              // setSelectedIndex(index)
              // onSelectItem(item)
              // navigate(`/lessons?query=${item.title}`)
              navigateToLessonsPage(item.title)
            }}
            style={{ backgroundImage: `url(${item.backgroundImage})` }}
          >
            <span>{item.title}</span>
          </a>
        ))}
        {isNewClassActive && <NewClass onSubmit={handleNewClass} />}{' '}
        {/* Pass handleNewClass as a prop */}
        <a href="#" className="new-class-button" onClick={() => setIsNewClassActive(true)}>
          New Class
        </a>
      </div>
    </>
  )
}
