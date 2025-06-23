import Sidebar from './Sidebar'

const ViewApplicant = () => {
  return (
     <>
    <Sidebar/>
    <div className="relative min-h-[140vh]  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
      <h1 className="text-5xl font-bold text-blue-900">View Applicants</h1>
      <p className="text-2xl mt-2">Fill out the form below to post a new job vacancy </p>
      <div className="w-full bg-white p-15 rounded mt-15">
        
      </div>
    </div>
    </>
  )
}

export default ViewApplicant