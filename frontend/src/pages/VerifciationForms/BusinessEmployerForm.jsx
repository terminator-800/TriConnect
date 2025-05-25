import React from 'react'
import { Link } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import { useState } from 'react'
import CreateAccountButton from '../../components/CreateAccountButton'
const EmployerForm = () => {

  const [employerType, setEmployerType] = useState("")
  const [employerBusinessName, setEmployerBusinessName] = useState("")
  const [employerBusinessAddress, setEmployerBusinessAddress] = useState("")
  const [employerBusinessType, setEmployerBusinessType] = useState("")
  const [employerContactName, setEmployerContactName] = useState("")
  const [employerPosition, setEmployerPosition] = useState("")
  const [employerContactNumber, setEmployerContactNumber] = useState("")
  const [employerEmailAddress, setEmployerEmailAddress] = useState("")
  const [employerContactImage, setEmployerContactImage] = useState(null)
  const [employerSelfieImage, setEmployerSelfieImage] = useState(null)
  const [employerBusinessImage, setEmployerBusinessImage] = useState(null)
  const [employerDTI, setEmployerDTI] = useState(null)

  const handleRegisterEmployer = (e) => {
    e.preventDefault()
    console.log(employerType);
    console.log(employerBusinessName);
    console.log(employerBusinessAddress);
    console.log(employerBusinessType);
    console.log(employerContactName);
    console.log(employerPosition);
    console.log(employerContactNumber);
    console.log(employerEmailAddress);
    console.log(employerContactImage);
    console.log(employerSelfieImage);
    console.log(employerBusinessImage);
    console.log(employerDTI);

    
  }

  return (

    <div className='flex justify-center items-center h-screen bg-gray-400 flex-col'>

      <form onSubmit={handleRegisterEmployer} className='border w-2xl p-5 bg-blue-300'>
        <h1 className='font-bold'>Create Account as Employer</h1>
        <p className='mb-5'>Provide your details to create an account!</p>

        <label htmlFor="employerType" className="sr-only">Employer Type</label>
        <select onChange={(e) => setEmployerType(e.target.value)} value={employerType} id="employerType" name="employerType" className="w-full border p-2 rounded mb-2 outline-none">
          <option value="">Select Employer Type</option>
          <option value="corporations">Corporations</option>
          <option value="smallBusinesses">Small Businesses</option>
          <option value="government">Government</option>
          <option value="freelanceAgencies">Freelance Agencies</option>
        </select>


        <div>
          <label htmlFor="employerBusinessName" className="sr-only">Business Name</label>
          <input
            onChange={(e) => setEmployerBusinessName(e.target.value)}
            value={employerBusinessName}
            type="text"
            id="employerBusinessName"
            name="employerBusinessName"
            placeholder="Business Name"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />

          <label  htmlFor="employerBusinessAddress" className="sr-only">Business Address</label>
          <input
            onChange={(e) => setEmployerBusinessAddress(e.target.value)}
            value={employerBusinessAddress}
            type="text"
            id="employerBusinessAddress"
            name="employerBusinessAddress"
            placeholder="Business Address"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />

          <label htmlFor="employerBusinessType" className="sr-only">Type of Business</label>
          <input
            onChange={(e) => setEmployerBusinessType(e.target.value)}
            value={employerBusinessType}
            type="text"
            id="employerBusinessType"
            name="employerBusinessType"
            placeholder="Type of Business"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />

          <label htmlFor="employerContactName" className="sr-only">Contact Person Name</label>
          <input
            onChange={(e) => setEmployerContactName(e.target.value)}
            value={employerContactName}
            type="text"
            id="employerContactName"
            name="employerContactName"
            placeholder="Contact Person Name"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />

          <label htmlFor="employerPosition" className="sr-only">Position</label>
          <select
            onChange={(e) => setEmployerPosition(e.target.value)}
            value={employerPosition}
            id="employerPosition"
            name="employerPosition"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          >
            <option value="">Select Position</option>
            <option value="owner">Owner</option>
            <option value="manager">Manager</option>
            <option value="hr">HR (Human Resources)</option>
            <option value="recruiter">Recruiter</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Administrator</option>
          </select>
        </div>


        <div className='flex'>
          <label htmlFor="employerContactNumber" className="sr-only">Contact Number</label>
          <input
            onChange={(e) => setEmployerContactNumber(e.target.value)}
            value={employerContactNumber}
            type="number"
            id="employerContactNumber"
            name="employerContactNumber"
            placeholder="Contact Number"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />

          <label htmlFor="employerEmailAddress" className="sr-only">Email Address</label>
          <input
            onChange={(e) => setEmployerEmailAddress(e.target.value)}
            value={employerEmailAddress}
            type="email"
            id="employerEmailAddress"
            name="employerEmailAddress"
            placeholder="Email Address"
            className="border w-full m-2 ml-0 rounded p-2 placeholder-black outline-none"
          />
        </div>


        <div>
          <h1 className='font-bold mt-2'>Verification Requirements</h1>
          <label htmlFor="employerContactImage" className="block mt-2 font-medium">Valid ID of Contact Person (upload)</label>
          <input onChange={(e) => setEmployerContactImage(e.target.files[0])} type="file" id="employerContactImage" name="employerContactImage" accept="image/*" className="border p-2 w-full m-2 ml-0" />
        </div>

        <div className='flex'>
          <label htmlFor="employerSelfieImage" className="block font-medium">Selfie with ID (upload)</label>
          <input onChange={(e) => setEmployerSelfieImage(e.target.files[0])} type="file" id="employerSelfieImage" name="employerSelfieImage" accept="image/*" className="border p-2 m-2 w-1/3" />

          <label htmlFor="employerBusinessImage" className="block font-medium">Photo of Business/Workplace</label>
          <input onChange={(e) => setEmployerBusinessImage(e.target.files[0])} type="file" id="employerBusinessImage" name="employerBusinessImage" accept="image/*" className="border p-2 m-2 w-1/3" />


        </div>

        <div className='mt-3'>
          <label htmlFor="employerDTI" className="block font-medium">DTI Certificate/Barangay Business Permit (optional) </label>
          <input onChange={(e) => setEmployerDTI(e.target.files[0])} type="file" id="employerDTI" name="employerDTI" accept="image/*" className="border p-2 m-2 w-full ml-0" />
        </div>

        <CreateAccountButton/>

        <div className='flex gap-2'>  
          <p>Already have an account?</p>
          <Link to={"/login"} className='text-blue-700'>Login</Link>
          
        </div>


      </form>
      <BackButton to={'/register'} className='p-5 text-white rounded bg-blue-600 m-2 cursor-pointer' />
    </div>
  )
}

export default EmployerForm