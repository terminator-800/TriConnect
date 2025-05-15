import React from 'react'
import { Link } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import CreateAccountButton from '../../components/CreateAccountButton'
import { useState } from 'react'

const ManpowerProviderForm = () => {

  const [agencyName, setAgencyName] = useState("")
  const [agencyServicesOffered, setAgencyServicesOffered] = useState("")
  const [agencyContactNumber, setAgencyContactNumber] = useState("")
  const [agencyEmailAddress, setAgencyEmailAddress] = useState("")
  const [agencyAddress, setAgencyAddress] = useState("")
  const [agencyDtiSECNumber, setAgencyDtiSECNumber] = useState(null)
  const [agencyBusinessPermitNumber, setAgencyBusinessPermitNumber] = useState(null)
  const [agencyAuthorizedRepresentative, setAgencyAuthorizedRepresentative] = useState("")
  const [agencyPosition, setAgencyPosition] = useState("")
  const [agencyGovernmentID, setAgencyGovernmentID] = useState(null)
  const [agencySelfieID, setAgencySelfieID] = useState(null)
  
  const handleRegisterAgency = (e) => {
    e.preventDefault()

    console.log(agencyName);
    console.log(agencyServicesOffered);
    console.log(agencyContactNumber);
    console.log(agencyEmailAddress);
    console.log(agencyAddress);
    console.log(agencyDtiSECNumber);
    console.log(agencyBusinessPermitNumber);
    console.log(agencyAuthorizedRepresentative);
    console.log(agencyPosition);
    console.log(agencyGovernmentID);
    console.log(agencySelfieID);

    
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-400 flex-col'>

      <form onSubmit={handleRegisterAgency} className='bg-blue-300 p-5 border rounded'>

        <h1 className='font-bold'>Create Account as Manpower Provider</h1>
        <p>Provide agency details to create an account</p>

        <div>
          <label htmlFor="agencyName" className='sr-only'>Agency Name</label>
          <input onChange={(e) => setAgencyName(e.target.value)} value={agencyName} type="text" name='agencyName' id='agencyName' placeholder='Agency Name' className='border rounded p-2 mt-2 mb-2 outline-none' />

          <select onChange={(e) => setAgencyServicesOffered(e.target.value)} value={agencyServicesOffered} name="agencyServicesOffered" id="agencyServicesOffered" className='w-1/3 float-end p-2 mb-2 mt-2 outline-none border rounded'>
            <option value="">Type of Services Offered</option>
            <option value="recruitmentHiring">Recruitment Hiring</option>
            <option value="manpowerOutsourcing">Manpower Outsourcing</option>
            <option value="foreignEmploymentAssistance">Foreign Employment Assistance</option>
            <option value="hrConsultancy">HR Consultancy</option>
          </select>
        </div>

        <div>
          <label htmlFor="agencyContactNumber" className='sr-only'>Agency Contact Number</label>
          <input onChange={(e) => setAgencyContactNumber(e.target.value)} value={agencyContactNumber} type="number" id='agencyContactNumber' name='agencyContactNumber' placeholder='Contact Number' className='border rounded outline-none mt-2 mb-2 p-2 w-full' />
        </div>


        <div>
          <label htmlFor="agencyEmailAddress" className='sr-only'>Agency Email Address</label>
          <input onChange={(e) => setAgencyEmailAddress(e.target.value)} value={agencyEmailAddress} type="email" id='agencyEmailAddress' name='agencyEmailAddress' placeholder='Email Address' className='outline-none border rounded p-2 mt-2 mb-2 w-full' />
        </div>

        <div>
          <label htmlFor="agencyAddress" className='sr-only'>Agency Address</label>
          <input onChange={(e) => setAgencyAddress(e.target.value)} value={agencyAddress} type="text" id='agencyAddress' name='agencyAddress' placeholder='Agency Address' className='outline-none border rounded p-2 mt-2 mb-2 w-full' />
        </div>


        <h1 className='font-bold mt-2 mb-2'>Legal and Business Verification</h1>

        <div className='flex flex-col'>
          <label htmlFor="agencyDtiSECNumber">DTI or SEC Registration Number (Upload certificate)</label>
          <input onChange={(e) => setAgencyDtiSECNumber(e.target.files[0])} type="file" id='agencyDtiSECNumber' name='agencyDtiSECNumber' className='outline-none mt-2 mb-2 p-2 border rounded' />
        </div>

        <div className='flex flex-col mt-2'>
          <label htmlFor="agencyBusinessPermitNumber">Business Permit Number (Upload permit)</label>
          <input onChange={(e) => setAgencyBusinessPermitNumber(e.target.files[0])} type="file" id='agencyBusinessPermitNumber' name='agencyBusinessPermitNumber' className='outline-none mt-2 mb-2 p-2 border rounded' />
        </div>

        <h1 className='font-bold'>Authorized Representative</h1>

        <div>
          <label htmlFor="agencyAuthorizedRepresentative" className='sr-only'>Authorized Personnel</label>
          <input onChange={(e) => setAgencyAuthorizedRepresentative(e.target.value)} value={agencyAuthorizedRepresentative} type="text" placeholder='Full Name' id='agencyAuthorizedRepresentative' name='agencyAuthorizedRepresentative' className='outline-none p-2 mb-2 mt-2 border rounded w-1/3' />

          <select onChange={(e) => setAgencyPosition(e.target.value)} value={agencyPosition} name="agencyPosition" id="agencyPosition" className="border p-2 rounded w-1/2 float-end outline-none mt-2 mb-2">
            <option value="">Position in the Agency</option>
            <option value="ownerDirector">Agency Owner / Director</option>
            <option value="operationsManager">Operations Manager</option>
            <option value="hrManager">HR Manager</option>
            <option value="recruitmentManager">Recruitment Manager</option>
          </select>
        </div>

        <div className='flex flex-col mt-2'>
          <label htmlFor="agencyGovernmentID">Valid Government-issued ID (upload)</label>
          <input onChange={(e) => setAgencyGovernmentID(e.target.files[0])} type="file" id='agencyGovernmentID' name='agencyGovernmentID' className='border rounded outline-none p-2 mb-2 mt-2' />
        </div>

        <div className='flex flex-col mt-2'>
          <label htmlFor="agencySelfieID">Selfie with ID (upload)</label>
          <input onChange={(e) => setAgencySelfieID(e.target.files[0])} type="file" id='agencySelfieID' name='agencySelfieID' className='border rounded outline-none p-2 mb-2 mt-2' />
        </div>


          <CreateAccountButton/>

        <div className='flex gap-2'>
          <p>Already have an account?</p>
          <Link to={"/login"} className='text-blue-700'>Login</Link>
        </div>


      </form>

      <BackButton to={'/register'} className='p-5 text-white rounded  bg-blue-600 m-2' />
    </div>
  )
}

export default ManpowerProviderForm