import { useParams } from 'react-router-dom'
import NavbarWithSideMenu from '../NavbarAndSideMenu/NavbarWithSideMenu'

const StudentPerformance = () => {
  const { className } = useParams()
  return (
    <div>
      <NavbarWithSideMenu className={className} displaySideMenu={true} />
      <h1> Student Performance</h1>
    </div>
  )
}

export default StudentPerformance
