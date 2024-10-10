import ContentDataGrid from '@/components/add-class-content/content-data-grid'

const About = () => {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page. You can find information about the app here.</p>
      <ContentDataGrid params={{ className: 'TEST CMSI' }} page={'lessons'} />
    </div>
  )
}

export default About
