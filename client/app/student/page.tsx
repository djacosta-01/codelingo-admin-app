'use client'

import NavbarWithSideMenu from '@/components/nav-and-sidemenu/navbar-with-sidemenu'

const MockStudentPage = () => {
  return (
    <div>
      <NavbarWithSideMenu className="student" displaySideMenu={false} />
      <h1>Student Page</h1>
    </div>
  )
}

export default MockStudentPage
