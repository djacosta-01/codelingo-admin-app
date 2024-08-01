import { useParams } from 'react-router-dom'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

export default function ClassroomSettings() {
  const { className } = useParams()
  return (
    <div id="classroomSettings">
      <NavbarWithSideMenu className={className} displaySideMenu={true} />
      <h1> Classroom Settings </h1>
    </div>
  )
}
