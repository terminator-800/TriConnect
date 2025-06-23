import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import Agreement from '../Agreement';
import FileUpload from './FileUpload';
import PreviewImage from './PreviewImage';

const VerificationForm = ({ onClose, onSubmitSuccess }) => {
  // 🔒 Refs for file inputs
  const governmentIdRef = useRef();
  const selfieWithIdRef = useRef();
  const clearanceRef = useRef();

  // 🧠 State for agreement and preview modals
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const [governmentIdPreview, setGovernmentIdPreview] = useState(null);
  const [showGovernmentIdModal, setShowGovernmentIdModal] = useState(false);

  const [selfieWithIdPreview, setSelfieWithIdPreview] = useState(null);
  const [showSelfieWithIdModal, setShowSelfieWithIdModal] = useState(false);

  const [clearancePreview, setClearancePreview] = useState(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  // 📝 Text input states
  const [full_name, setFullName] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [present_address, setPresentAddress] = useState("");
  const [permanent_address, setPermanentAddress] = useState("");

  // 📁 File upload states
  const [government_id, setGovernmentId] = useState(null);
  const [selfie_with_id, setSelfieWithId] = useState(null);
  const [nbi_barangay_clearance, setClearance] = useState(null);

  // 🚀 Form submission handler
  const submitRequirements = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('full_name', full_name);
    formData.append('date_of_birth', date_of_birth);
    formData.append('phone', phone);
    formData.append('gender', gender);
    formData.append('present_address', present_address);
    formData.append('permanent_address', permanent_address);
    formData.append('government_id', government_id);
    formData.append('selfie_with_id', selfie_with_id);
    formData.append('nbi_barangay_clearance', nbi_barangay_clearance);

    try {
      const response = await axios.post(
        'http://localhost:3001/individual-employer/upload-requirements',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      alert('Requirements submitted successfully!');
      console.log("✅ Upload success:", response.data);
      onSubmitSuccess?.();
    } catch (error) {
      console.error("❌ Upload error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='fixed flex items-center justify-center z-50 inset-0'>
      {/* 📄 Main Verification Form */}
      <form
        onSubmit={submitRequirements}
        className='relative z-10 border-2 border-gray-300 bg-white rounded-xl p-6 h-[90vh] overflow-y-auto w-full max-w-2xl mt-20 hide-scrollbar'
      >
        {/* ❌ Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <h1 className='font-bold text-2xl'>Verification Form as Individual Employer</h1>
        <p className='mb-5'>Provide your details to verify your account!</p>

        {/* 🔤 Input Fields */}
        <div className='mb-3'>
          <input type="text" placeholder="Full Name" value={full_name} onChange={(e) => setFullName(e.target.value)} required className='border w-full mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        <div className='mb-3'>
          <input type="date" placeholder="Date of Birth" value={date_of_birth} onChange={(e) => setDateOfBirth(e.target.value)} required className='border w-full mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        <div className='mb-3'>
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className='border w-full mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        <div className='mb-3'>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full border p-2 rounded mb-2 outline-none">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className='mb-3'>
          <input type="text" placeholder="Present Address" value={present_address} onChange={(e) => setPresentAddress(e.target.value)} required className='border w-full mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        <div className='mb-3'>
          <input type="text" placeholder="Permanent Address" value={permanent_address} onChange={(e) => setPermanentAddress(e.target.value)} required className='border w-full mb-2 mt-2 p-2 rounded outline-none' />
        </div>

        {/* 📎 File Uploads */}
        <div className='mt-6'>
          <h2 className='font-bold text-2xl mb-3'>Verification Requirements</h2>

          <FileUpload
            ref={governmentIdRef}
            label="Government-issued ID"
            description="Upload a clear image of your valid ID (e.g., Passport, UMID)"
            file={government_id}
            setFile={setGovernmentId}
            preview={governmentIdPreview}
            setPreview={(value) => value === 'modal' ? setShowGovernmentIdModal(true) : setGovernmentIdPreview(value)}
            id="government_id"
            allowPreview
          />

          <FileUpload
            ref={selfieWithIdRef}
            label="Selfie with ID"
            description="Take a selfie holding your government-issued ID"
            file={selfie_with_id}
            setFile={setSelfieWithId}
            preview={selfieWithIdPreview}
            setPreview={(value) => value === 'modal' ? setShowSelfieWithIdModal(true) : setSelfieWithIdPreview(value)}
            id="selfie_with_id"
            allowPreview
          />

          <FileUpload
            ref={clearanceRef}
            label="NBI or Barangay Clearance"
            description="Upload a recent NBI or Barangay Clearance"
            file={nbi_barangay_clearance}
            setFile={setClearance}
            preview={clearancePreview}
            setPreview={(value) => value === 'modal' ? setShowClearanceModal(true) : setClearancePreview(value)}
            id="nbi_barangay_clearance"
            allowPreview
          />
        </div>

        {/* ✅ Agreement Checkbox */}
        <div className="mt-4">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <p className="text-sm">
              By continuing, you agree to TriConnect{' '}
              <span onClick={() => setShowAgreement(true)} className="text-blue-600 font-medium cursor-pointer underline">Terms of Service</span>{' '}
              and acknowledge you’ve read our{' '}
              <span onClick={() => setShowAgreement(true)} className="text-blue-600 font-medium cursor-pointer underline">Data Protection Agreement</span>.
            </p>
          </div>

          {showAgreement && <Agreement onClose={() => setShowAgreement(false)} />}
        </div>

        {/* 📨 Submit Button */}
        <button
          type='submit'
          disabled={!agreed}
          className={`w-full px-5 py-2 rounded mt-4 text-white ${agreed ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} cursor-pointer`}
        >
          Submit Requirements
        </button>
      </form>

      {/* 🔍 Preview Modals */}
      <PreviewImage show={showGovernmentIdModal} src={governmentIdPreview} alt="Government ID Preview" onClose={() => setShowGovernmentIdModal(false)} />
      <PreviewImage show={showSelfieWithIdModal} src={selfieWithIdPreview} alt="Selfie with ID Preview" onClose={() => setShowSelfieWithIdModal(false)} />
      <PreviewImage show={showClearanceModal} src={clearancePreview} alt="Clearance Preview" onClose={() => setShowClearanceModal(false)} />
    </div>
  );
};

export default VerificationForm;
