import { useState, useRef, useEffect } from 'react'
import axios from "axios"
import Agreement from '../Agreement'
import FileUpload from './FileUpload'
import PreviewImage from './PreviewImage'

const Form = ({ onClose, onSubmitSuccess }) => {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // useRef
  const govIDRef = useRef();
  const selfieRef = useRef();
  const clearanceRef = useRef();

  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  // preview
  const [jsGovernmentIDPreview, setJsGovernmentIDPreview] = useState(null);
  const [showGovIDModal, setShowGovIDModal] = useState(false);

  const [selfieIDPreview, setSelfieIDPreview] = useState(null);
  const [showSelfieModal, setShowSelfieModal] = useState(false);

  const [clearancePreview, setClearancePreview] = useState(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  const [jsFullname, setJsFullName] = useState("")
  const [jsDob, setJsDob] = useState("")
  const [jsContactNumber, setJsContactNumber] = useState("")
  const [jsGender, setJsGender] = useState("")
  const [jsPresentAddress, setJsPresentAddress] = useState("")
  const [jsPermanentAddress, setJsPermanentAddress] = useState("")
  const [jsEducationalAttainment, setJsEducationalAttainment] = useState("")
  const [jsSkills, setJsSkills] = useState("")
  const [jsGovernmentID, setJsGovernmentID] = useState(null)
  const [jsSelfieID, setJsSelfieID] = useState(null)
  const [jsNBIBarangayClearance, setJsNBIBarangayClearance] = useState("")


  const submitRequirements = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", jsFullname);
    formData.append("date_of_birth", jsDob);
    formData.append("contact_number", jsContactNumber);
    formData.append("gender", jsGender);
    formData.append("present_address", jsPresentAddress);
    formData.append("permanent_address", jsPermanentAddress);
    formData.append("education", jsEducationalAttainment);
    formData.append("skills", jsSkills);

    // ✅ Append the file objects
    if (jsGovernmentID) formData.append("government_id", jsGovernmentID);
    if (jsSelfieID) formData.append("selfie_with_id", jsSelfieID);
    if (jsNBIBarangayClearance) formData.append("nbi_barangay_clearance", jsNBIBarangayClearance);

    const jobSeekerData = {
      full_name: jsFullname,
      date_of_birth: jsDob,
      contact_number: jsContactNumber,
      gender: jsGender,
      present_address: jsPresentAddress,
      permanent_address: jsPermanentAddress,
      education: jsEducationalAttainment,
      skills: jsSkills,
      government_id: jsGovernmentID,
      selfie_with_id: jsSelfieID,
      nbi_barangay_clearance: jsNBIBarangayClearance
    };

    try {
      const response = await axios.post(
        'http://localhost:3001/jobseeker/upload-requirements',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("using axios: ", formData);
      console.log('Submission successful:', formData);
      alert('Requirements submitted successfully!');
      if (typeof onSubmitSuccess === 'function') {
        onSubmitSuccess();
      }
      setJsFullName("");
      setJsDob("");
      setJsContactNumber("");
      setJsGender("");
      setJsPresentAddress("");
      setJsPermanentAddress("");
      setJsEducationalAttainment("");
      setJsSkills("");
      setJsGovernmentID(null);
      setJsSelfieID(null);
      setJsNBIBarangayClearance(null);
      setAgreed(false)
      govIDRef.current?.reset();
      selfieRef.current?.reset();
      clearanceRef.current?.reset();
    } catch (error) {
      console.error('Error submitting requirements:', error);
      alert('Failed to submit requirements. Please try again.');
    }
  };

  return (
    <div className='fixed flex items-center justify-center z-50 inset-0'>
      <form onSubmit={submitRequirements} className='relative z-10 border-2 border-gray-300 bg-white rounded-xl p-6 h-[90vh] overflow-y-auto w-full max-w-2xl mt-20 hide-scrollbar'>

        {/* ✅ Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>


        <h1 className='font-bold text-2xl'>Verification Form as Job Seeker</h1>
        <p className='mb-5'>Provide your details to verify your account!</p>

        <div className='mb-3'>
          <label htmlFor="jsFullname" className='sr-only'>Full Name</label>
          <input onChange={(e) => setJsFullName(e.target.value)} required value={jsFullname} type="text" placeholder='Full Name' id='jsFullname' name='jsFullname' className='border w-full  mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        <div className='mb-3'>
          <label htmlFor="jsDob" className="block text-sm font-medium text-gray-700 sr-only">Date of Birth</label>
          <input onChange={(e) => setJsDob(e.target.value)} required value={jsDob} type="date" id="jsDob" name="jsDob" className="border p-2 rounded outline-none w-1/2" placeholder="Date of Birth" />
        </div>

        <div className='mb-3'>
          <label htmlFor="jsContactNumber" className='sr-only'>Jobseeker Contact Number</label>
          <input onChange={(e) => setJsContactNumber(e.target.value)} required value={jsContactNumber} type="number" placeholder='Contact Number' id='jsContactNumber' name='jsContactNumber' className='border rounded p-2 mt-2 mb-2 w-1/2 outline-none' />
        </div>

        <div className='mb-3'>
          <select onChange={(e) => setJsGender(e.target.value)} required value={jsGender} id="jsGender" name="jsGender" className='border rounded p-2 mt-2 mb-2 w-1/2 outline-none'>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className='mb-3'>
          <label htmlFor="jsPresentAddress" className='sr-only'>Jobseeker Present Address</label>
          <input onChange={e => setJsPresentAddress(e.target.value)} required value={jsPresentAddress} type="text" placeholder='Present Address' id='jsPresentAddress' name='jsPresentAddress' className='border rounded w-full p-2 mt-2 mb-2 outline-none' />
        </div>

        <div className='mb-3'>
          <label htmlFor="jsPermanentAddress" className='sr-only'>Jobseeker Permanent Address</label>
          <input onChange={e => setJsPermanentAddress(e.target.value)} value={jsPermanentAddress} type="text" placeholder='Permanent Address (optional if same as present)' id='jsPermanentAddress' name='jsPermanentAddress' className='border rounded w-full p-2 mt-2 mb-2 outline-none' />
        </div>

        <div className='mb-3'>
          <select onChange={e => setJsEducationalAttainment(e.target.value)} required value={jsEducationalAttainment}
            name="jsEducationalAttainment" id="jsEducationalAttainment"
            className="border p-2 rounded outline-none w-full"
          >
            <option value="">Educational Attainment (optional)</option>
            <option value="elementary">Elementary Graduate</option>
            <option value="highschool">Highschool Graduate</option>
            <option value="college">College Graduate</option>
          </select>
        </div>

        <div className='mb-3'>
          <input onChange={e => setJsSkills(e.target.value)} required value={jsSkills} name="jsSkills" id="jsSkills"
            placeholder='Skills (separate with commas)'
            className="border p-2 rounded w-full outline-none mb-2 mt-2 ">
          </input>
        </div>

        <div className='mt-15'>
          <h1 className='font-bold text-2xl mt-3 mb-3'>Verifications Requirements</h1>

          {/* File Upload */}
          <FileUpload
            ref={govIDRef}
            label="Valid Government-issued ID (upload)"
            description="Upload a clear image of your (Passport, Driver’s License, etc.)"
            file={jsGovernmentID}
            setFile={setJsGovernmentID}
            preview={jsGovernmentIDPreview === 'modal' ? jsGovernmentIDPreview : jsGovernmentIDPreview}
            setPreview={(value) => value === 'modal' ? setShowGovIDModal(true) : setJsGovernmentIDPreview(value)}
            id="jsGovernmentID"
            allowPreview
          />

          <FileUpload
            ref={selfieRef}
            label="Selfie with Government-issued ID (upload)"
            description="Upload a selfie holding your government-issued ID"
            file={jsSelfieID}
            setFile={setJsSelfieID}
            preview={selfieIDPreview === 'modal' ? selfieIDPreview : selfieIDPreview}
            setPreview={(value) => value === 'modal' ? setShowSelfieModal(true) : setSelfieIDPreview(value)}
            id="selfieID"
            allowPreview
          />

          <FileUpload
            ref={clearanceRef}
            label="NBI or Barangay Clearance (upload)"
            description="Upload a clear image of your NBI Clearance or Barangay Clearance"
            file={jsNBIBarangayClearance}
            setFile={setJsNBIBarangayClearance}
            preview={clearancePreview === 'modal' ? clearancePreview : clearancePreview}
            setPreview={(value) => value === 'modal' ? setShowClearanceModal(true) : setClearancePreview(value)}
            id="clearanceFile"
            allowPreview
          />
        </div>

        {/* Agreement and Policy */}
        <div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <p className="text-sm">
              By continuing, you agree to TriConnect{' '}
              <span
                onClick={() => setShowAgreement(true)}
                className="text-blue-600 font-medium cursor-pointer underline"
              >
                Terms of Service
              </span>{' '}
              and acknowledge you’ve read our{' '}
              <span
                onClick={() => setShowAgreement(true)}
                className="text-blue-600 font-medium cursor-pointer underline"
              >
                Data Protection Agreement
              </span>.
            </p>
          </div>

          {/* Render modal conditionally */}
          {showAgreement && <Agreement onClose={() => setShowAgreement(false)} />}
        </div>

        <button
          type='submit'
          disabled={!agreed}
          className={`w-full px-5 py-2 rounded mt-2 cursor-pointer text-white ${agreed ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Submit Requirements
        </button>

      </form>

      {/* Previewing the uploaded image */}
      <PreviewImage
        show={showGovIDModal}
        src={jsGovernmentIDPreview}
        alt="Government ID Full Preview"
        onClose={() => setShowGovIDModal(false)}
      />

      <PreviewImage
        show={showSelfieModal}
        src={selfieIDPreview}
        alt="Selfie with Government ID Preview"
        onClose={() => setShowSelfieModal(false)}
      />

      <PreviewImage
        show={showClearanceModal}
        src={clearancePreview}
        alt="NBI or Barangay Clearance Preview"
        onClose={() => setShowClearanceModal(false)}
      />
    </div>

  )
}

export default Form