import { useParams } from 'react-router-dom'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

export default function Roster() {
  const { className } = useParams()
  return (
    <div id="roster">
      <NavbarWithSideMenu className={className} displaySideMenu={true} />
      <h1>Roster</h1>
    </div>
  )
}
