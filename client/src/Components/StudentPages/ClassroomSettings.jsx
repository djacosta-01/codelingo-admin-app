import { useParams } from 'react-router-dom'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

export default function ClassroomSettings() {
  const { className } = useParams()
  return (
    <div id="classroomSettings">
      <NavbarWithSideMenu
        className={className}
        displaySideMenu={true}
        currentPage={'Class Settings'}
      />
      <h1> Classroom Settings </h1>
    </div>
  )
}
