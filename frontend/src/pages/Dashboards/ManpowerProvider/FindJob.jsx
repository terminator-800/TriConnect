import Sidebar from "./Sidebar"

const ManpowerProviderFindJob = () => {
  return (
   <>
      <Sidebar/>
    <div className="relative min-h-[140vh]  bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50">

      <h1 className="text-5xl font-bold text-blue-900">Browse Job</h1>
      <p className="text-2xl mt-2">Browse job openings and apply to positions that fit you</p>

      <div className="rounded-xl w-2xl bg-white pt-2 pb-2 pl-5 pr-5 shadow-md flex justify-between items-center mt-15">
        <input type="text" placeholder="Search job titles" className="outline-none"/>
        <button className="text-white bg-blue-900 rounded-xl pt-1 pb-1 pr-5 pl-5 cursor-pointer">Find jobs</button>
      </div>

       <div className="w-full bg-white p-15 rounded mt-15">

        </div>
    </div>
    </>
  )
}

export default ManpowerProviderFindJob