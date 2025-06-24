import Sidebar from './Sidebar'

const UserFeedback = () => {
  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

        <h1 className="text-5xl font-bold text-blue-900">User Feedback</h1>
        <p className="text-2xl mt-2">Review and manage feedback submitted by TriConnect users</p>

        <div className="w-full bg-white p-15 rounded mt-15">

        </div>

      </div>
    </>
  )
}

export default UserFeedback