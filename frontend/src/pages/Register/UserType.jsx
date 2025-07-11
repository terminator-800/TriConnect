import BackButton from '../../components/BackButton'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import icons from '../../assets/svg/Icons'
import Navbar from '../Navbar'
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
    <>
      <Navbar userType={"register"} />
      <div className='flex justify-center items-center h-screen flex-col bg-gradient-to-b from-white to-cyan-400'>

        <div>
          <h1 className='text-center text-5xl'>SELECT USER TYPE</h1>
          <p className='text-blue-900 text-2xl mb-5'>Select your user type to get started</p>
        </div>

        <div className='flex p-5 gap-20 text-2xl'>
          <img
            src={icons.select_jobseeker}
            alt=""
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === jobseeker ? "scale-105 w-65" : "scale-100 w-60"}`}
            onClick={() => handleSelect(jobseeker)}
          />

          <img
            src={icons.select_employer}
            alt=""
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === employer ? "scale-105 w-65" : "scale-100 w-60"}`}
            onClick={() => handleSelect(employer)}
          />

          <img
            src={icons.select_manpower_provider}
            alt=""
            className={`cursor-pointer transform transition-transform duration-300 
             ${isSelected === manpower_provider ? "scale-105 w-65" : "scale-100 w-60"}`}
            onClick={() => handleSelect(manpower_provider)}
          />
        </div>

        <div className='flex justify-center items-center mt-5 gap-25'>
          <BackButton to='/login' className='bg-white text-blue-900 pt-1 pb-1 pl-15 pr-15 rounded-3xl mt-15 text-2xl cursor-pointer border border-blue-900' />
          <button onClick={() => handleNext()} className='bg-blue-900 text-white pt-1 pb-1 pl-10 pr-10 rounded-3xl mt-15 text-2xl cursor-pointer'>Next Step</button>
        </div>
      </div>
    </>
  )
}

export default Register