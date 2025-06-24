import Sidebar from './Sidebar'

const ManpowerProviderMessage = () => {
  return (
    <>
      <Sidebar />
      <div className="relative min-h-[140vh]  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">
        <h1 className="text-5xl font-bold text-blue-900">Messages</h1>
        <p className="text-2xl mt-2">View and manage conversations with applicants and employers  </p>
        <div className="w-full bg-white p-15 rounded mt-15">
        </div>
      </div>
    </>
  )
}

export default ManpowerProviderMessage