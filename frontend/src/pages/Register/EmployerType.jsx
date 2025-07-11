import { useState } from 'react'
import BackButton from '../../components/BackButton'
import Navbar from '../Navbar'
import { useNavigate, useParams } from 'react-router-dom'

const EmployerType = () => {
  const business = "business"
  const individual = "individual"
  const navigate = useNavigate()
  const { accountType } = useParams()
  const [isSelected, setSelectOption] = useState("")

  const handleSelect = (option) => {
    setSelectOption(option)
  }

  const handleNext = () => {
    navigate(`/register/${accountType}/${isSelected}/account`)
  }

  return (
    <>
      <Navbar userType={"register"} />
      <div className='flex justify-center items-center h-screen flex-col bg-gradient-to-b from-white to-cyan-400'>
        <h1 className='text-center text-5xl'>SELECT EMPLOYER TYPE</h1>
        <p className='text-blue-900 text-2xl mb-5'>Select your user type to get started</p>
        <div className='flex p-5 gap-20 text-2xl'>
          <div className={`rounded my-2 cursor-pointer ${isSelected === business ? "bg-red-500" : "bg-red-300"} w-60 text-center pt-60 pb-5 italic shadow-xl`}
            onClick={() => handleSelect(business)}
          >
            <h1>Business Type Employer</h1>
          </div>

          <div className={`rounded my-2 cursor-pointer ${isSelected === individual ? "bg-blue-500" : "bg-blue-300"} w-60 text-center pt-60 pb-5 italic shadow-xl`}
            onClick={() => handleSelect(individual)}
          >
            <h1>Individual Type Employer</h1>
          </div>
        </div>
        <div className='flex justify-center items-center mt-5 gap-25'>
          <BackButton to={`/register`} className='bg-white text-blue-900 pt-1 pb-1 pl-15 pr-15 rounded-3xl mt-15 text-2xl cursor-pointer border border-blue-900' />
          <button onClick={() => handleNext()} className='bg-blue-900 text-white pt-1 pb-1 pl-10 pr-10 rounded-3xl mt-15 text-2xl cursor-pointer'>Next Step</button>
        </div>
      </div>
    </>
  )
}

export default EmployerType