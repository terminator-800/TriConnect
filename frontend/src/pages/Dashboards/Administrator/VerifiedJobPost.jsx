import Sidebar from './Sidebar'

const VerifiedJobPost = () => {
  return (
    <>
      <Sidebar />
      <div className="relative min-h-screen  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

        <h1 className="text-5xl font-bold text-blue-900">Verified Job Post</h1>
        <p className="text-2xl mt-2">Browse and see job posts who have been verified on the platform</p>

        <div className="w-full bg-white p-15 rounded mt-15">

        </div>

      </div>
    </>
  )
}

export default VerifiedJobPost