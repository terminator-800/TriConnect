import BackButton from '../components/BackButton'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const jobseeker = "jobseeker"
  const employer = "employer"
  const manpower_provider = "manpower-provider"

  const [isSelected, setSelectOption] = useState(null)
  const navigate = useNavigate()

  const handleSelect = (option) => {
    setSelectOption(option)
  }

  const handleNext = () => {
      if (!isSelected) {
      alert("Please select a role before continuing.")
      return
    }
    navigate(`/register/${isSelected}`)
  }

  return (

    <div className='flex justify-center items-center h-screen flex-col bg-white'>
    
      <h1 className='text-center text-5xl'>SELECT USER TYPE</h1>
      <p className='text-blue-900 text-2xl mb-5'>Select your user type to get started</p>

      <div className='flex p-5 gap-20 text-2xl'>

        <div className={`cursor-pointer bg-red-300 rounded ${isSelected === jobseeker ? "bg-red-500" : "bg-red-300"} w-60 text-center pt-60 pb-5 italic shadow-xl`}
          onClick={() => handleSelect(jobseeker)}>
          <h1>Job Seeker</h1>
        </div>

        <div className={`cursor-pointer bg-pink-300 rounded ${isSelected === employer ? "bg-pink-500" : "bg-pink300"} w-60 text-center pt-60 pb-5 italic shadow-xl`}
          onClick={() => handleSelect(employer)}>
          <h1>Employer</h1>
        </div>

        <div className={`cursor-pointer bg-violet-300 rounded ${isSelected === manpower_provider ? "bg-violet-500" : "bg-violet-300"} w-60 text-center pt-60 pb-5 italic shadow-xl`}
          onClick={() => handleSelect(manpower_provider)}>
          <h1>Manpower Provider</h1>
        </div>

      </div>

      <div className='flex justify-center items-center mt-5 gap-25'>
          <BackButton to='/' className='bg-white text-blue-900 pt-1 pb-1 pl-15 pr-15 rounded-3xl mt-15 text-2xl cursor-pointer border border-blue-900' />
          <button onClick={() => handleNext()} className='bg-blue-900 text-white pt-1 pb-1 pl-10 pr-10 rounded-3xl mt-15 text-2xl cursor-pointer'>Next Step</button>
        </div>
    </div>
  )
}

export default Register