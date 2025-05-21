import BackButton from '../components/BackButton'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const jobseeker = "jobseeker"
  const employer = "employer"
  const manpowerProvider = "manpowerProvider"

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

    <div className='flex justify-center items-center h-screen flex-col bg-gray-500'>

      <h1 className='text-center'>Register Page</h1>

      <div className='flex flex-col border p-5 mt-2  gap-3'>

        <div className={`p-5 cursor-pointer bg-red-300 rounded ${isSelected === jobseeker ? "bg-red-500" : "bg-red-300"}`}
          onClick={() => handleSelect(jobseeker)}>
          <h1>Job Seeker</h1>
        </div>

        <div className={`p-5 cursor-pointer bg-pink-300 rounded ${isSelected === employer ? "bg-pink-500" : "bg-pink300"}`}
          onClick={() => handleSelect(employer)}>
          <h1>Employer</h1>
        </div>

        <div className={`p-5 cursor-pointer bg-violet-300 rounded ${isSelected === manpowerProvider ? "bg-violet-500" : "bg-violet-300"}`}
          onClick={() => handleSelect(manpowerProvider)}>
          <h1>Manpower Provider</h1>
        </div>

        <div>
          <BackButton to='/' className='text-white rounded bg-blue-500 p-5 mr-2' />
          <button onClick={() => handleNext()} className='p-5 bg-green-300 rounded'>next</button>
        </div>

      </div>
    </div>
  )
}

export default Register