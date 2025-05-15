import React from 'react'
import { Link } from "react-router-dom"
import BackButton from '../../components/BackButton'
import { useState } from 'react'
import axios from "axios"
import CreateAccountButton from '../../components/CreateAccountButton'

const JobseekerForm = () => {

  const [jsFullname, setJsFullName] = useState("")
  const [jsDob, setJsDob] = useState("")
  const [jsContactNumber, setJsContactNumber] = useState("")
  const [jsGender, setJsGender] = useState("")
  const [jsEmailAddress, setJsEmailAddress] = useState("")
  const [jsPresentAddress, setJsPresentAddress] = useState("")
  const [jsPermanentAddress, setJsPermanentAddress] = useState("")
  const [jsEducationalAttainment, setJsEducationalAttainment] = useState("")
  const [jsSkills, setJsSkills] = useState("")
  const [jsPreferredJobType, setJsPreferredJobType] = useState("")
  const [jsGovernmentID, setJsGovernmentID] = useState(null)
  const [jsSelfieID, setJsSelfieID] = useState(null)
  const [jsNBIBarangayClearance, setJsNBIBarangayClearance] = useState("")

 
  
  const handleRegisterJobseeker = (e) => {

    e.preventDefault()

    
    
  
  }
  

  return (
    <div className='flex justify-center items-center h-screen bg-gray-400 flex-col'>

      <form onSubmit={handleRegisterJobseeker} className='border w-2xl p-5 flex flex-col bg-blue-300'>
        <h1 className='font-bold'>Create Account as Jobseeker</h1>
        <p className='mb-5'>Provide your details to create an account!</p>

        <div className='flex justify-between'>
          <label htmlFor="jsFullname" className='sr-only'>Full Name</label>
          <input onChange={(e) => setJsFullName(e.target.value)} value={jsFullname} type="text"  placeholder='Full Name' id='jsFullname' name='jsFullname' className='border w-1/3 mb-2 mt-2 p-2 rounded outline-none' />

          <label htmlFor="jsDob" className="block text-sm font-medium text-gray-700 sr-only">Date of Birth</label>
          <input onChange={(e) => setJsDob(e.target.value)} value={jsDob} type="date" id="jsDob" name="jsDob" className="border p-2 rounded outline-none w-1/3" placeholder="Date of Birth" />
        </div>


        <div>
          <label htmlFor="jsContactNumber" className='sr-only'>Jobseeker Contact Number</label>
          <input onChange={(e) => setJsContactNumber(e.target.value)} value={jsContactNumber} type="number" placeholder='Contact Number' id='jsContactNumber' name='jsContactNumber' className='border rounded p-2 mt-2 mb-2 w-1/3 outline-none' />
          
          <select onChange={(e) => setJsGender(e.target.value)} value={jsGender} id="jsGender" name="jsGender" className='border rounded p-2 mt-2 mb-2 w-1/3 float-end outline-none'>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="jsEmailAddress" className='sr-only'>Jobseeker Email Address</label>
          <input onChange={e => setJsEmailAddress(e.target.value)} value={jsEmailAddress} type="email" placeholder='Email Address' id='jsEmailAddress' name='jsEmailAddress' className='border rounded w-full p-2 mt-2 mb-2 outline-none' />
        </div>

        <div>
          <label htmlFor="jsPresentAddress" className='sr-only'>Jobseeker Present Address</label>
          <input onChange={e => setJsPresentAddress(e.target.value)} value={jsPresentAddress} type="text" placeholder='Present Address' id='jsPresentAddress' name='jsPresentAddress' className='border rounded w-full p-2 mt-2 mb-2 outline-none' />
        </div>

        <div>
          <label htmlFor="jsPermanentAddress" className='sr-only'>Jobseeker Permanent Address</label>
          <input onChange={e => setJsPermanentAddress(e.target.value)} value={jsPermanentAddress} type="text" placeholder='Permanent Address (optional if same as present)' id='jsPermanentAddress' name='jsPermanentAddress' className='border rounded w-full p-2 mt-2 mb-2 outline-none' />
        </div>

        <div>
          <select onChange={e => setJsEducationalAttainment(e.target.value)} value={jsEducationalAttainment} name="jsEducationalAttainment" id="jsEducationalAttainment" className="border p-2 rounded outline-none w-full">
            <option value="">Educational Attainment (optional)</option>
            <option value="elementary">Elementary Graduate</option>
            <option value="highschool">Highschool Graduate</option>
            <option value="college">College Graduate</option>
          </select>
        </div>

        <div>
          <select onChange={e => setJsSkills(e.target.value)} value={jsSkills} name="jsSkills" id="jsSkills" className="border p-2 rounded w-1/3 outline-none mb-2 mt-2">
            <option value="">Skills</option>
            <option value="graphicDesigner">Graphic Designer</option>
            <option value="frontendDeveloper">Frontend Developer</option>
            <option value="backendDeveloper">Backend Developer</option>
            <option value="fullstackDeveloper">Fullstack Developer</option>
            <option value="uiUxDesigner">UI/UX Designer</option>
          </select>


          <select onChange={e => setJsPreferredJobType(e.target.value)} value={jsPreferredJobType} name="jsPreferredJobType" id="jsPreferredJobType" className="border p-2 rounded w-1/3 float-end mt-2 mb-2 outline-none">
            <option value="">Preferred Job Type</option>
            <option value="labor">Labor</option>
            <option value="professional">Professional</option>
          </select>
        </div>


        <div>
          <h1 className='font-bold mt-3 mb-3'>Verifications Requirements</h1>

          <div>
            <label htmlFor="jsGovernmentID">Valid Government-issued ID (upload)</label>
            <input onChange={(e) => setJsGovernmentID(e.target.files[0])} type="file" name='jsGovernmentID' id='jsGovernmentID' className='w-full border rounded p-2 mt-2 mb-2' />
          </div>

          <div className='flex justify-between gap-2'>
            <label htmlFor="jsSelfieID">Selfie with ID (upload)</label>
            <input onChange={e => setJsSelfieID(e.target.files[0])} type="file" name='jsSelfieID' id='jsSelfieID' className='border rounded p-2 mt-2 mb-2 w-1/3' />

            <label htmlFor="jsNBIBarangayClearance">NBI or Barangay Clearance (optional)</label>
            <input onChange={e => setJsNBIBarangayClearance(e.target.files[0])} type="file" name='jsNBIBarangayClearance' id='jsNBIBarangayClearance' className='border rounded p-2 mt-2 mb-2 w-1/3' />
          </div>
        </div>


        <CreateAccountButton/>

        <div className='flex gap-2'>
          <p>Already have an account?</p>
          <Link to={"/login"} className='text-blue-700'>Login</Link>
         
        </div>


      </form>
      <BackButton to={'/register'} className='p-5 text-white rounded bg-blue-600 m-2' />
    </div>
  )
}

export default JobseekerForm