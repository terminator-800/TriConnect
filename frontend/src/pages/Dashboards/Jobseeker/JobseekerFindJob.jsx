const JobseekerFindJob = () => {
  return (
    <div className="pl-60 pr-60 pt-20">

      <h1 className="text-5xl font-bold text-blue-900">Browse Job</h1>
      <p className="text-2xl mt-2">Browse job openings and apply to positions that fit you</p>

      <div className="rounded-xl w-2xl bg-white pt-2 pb-2 pl-5 pr-5 shadow-md flex justify-between items-center mt-15">
        <input type="text" placeholder="Search job titles" className="outline-none"/>
        <button className="text-white bg-blue-900 rounded-xl pt-1 pb-1 pr-5 pl-5 cursor-pointer">Find jobs</button>
      </div>

      <div>
        
      </div>
    </div>
  )
}

export default JobseekerFindJob