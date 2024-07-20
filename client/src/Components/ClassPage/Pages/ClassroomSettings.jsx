import React from 'react'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

export default function ClassroomSettings() {
  return (
    <div className="classroomSettings">
      <NavbarWithSideMenu displaySideMenu={true} />
      <h1> Classroom Settings </h1>
    </div>
  )
}
