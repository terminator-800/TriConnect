import { useState } from 'react'
import BackButton from '../../components/BackButton'
import { useNavigate, useParams } from 'react-router-dom'

const EmployerType = () => {
  const business = "business"
  const individual = "individual"
  const navigate = useNavigate()
  const { accountType, type} = useParams()
  const [isSelected, setSelectOption] = useState("")

  const handleSelect = (option) => {
    setSelectOption(option)
  }

  const handleNext = () => {
      navigate(`/register/${accountType}/${isSelected}/register`)
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-500 flex-col'>
      <h1 className='text-center'>Employer Type</h1>

      <div className='flex flex-col border p-5 mt-2  gap-3'>

        <div className={`rounded p-5 my-2 cursor-pointer ${isSelected === business ? "bg-red-500" : "bg-red-300"}`}
          onClick={() => handleSelect(business)}
        >
          <h1>Business Type Employer</h1>
        </div>

        <div className={`rounded p-5 my-2 cursor-pointer ${isSelected === individual ? "bg-blue-500" : "bg-blue-300"}`}
          onClick={() => handleSelect(individual)}
        >
          <h1>Individual Type Employer</h1>
        </div>

        <div>
          <BackButton to={`/register`} className='text-white rounded bg-blue-500 p-5 mr-2' />
          <button onClick={() => handleNext()} className='p-5 bg-green-300 rounded'>next</button>
        </div>

      </div>
    </div>
  )
}

export default EmployerType