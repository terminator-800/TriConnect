import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import FileUpload from './FileUpload';
import PreviewImage from './PreviewImage';
import Agreement from '../../Agreement';

const ManpowerProviderForm = ({ onClose, onSubmitSuccess }) => {
  const DOLERef = useRef();
  const mayorBirRef = useRef();
  const agencyProofRef = useRef();
  const authAgenRef = useRef();

  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const [DOLEPreview, setDOLEPreview] = useState(null);
  const [showDoleModal, setShowDoleModal] = useState(false);
  const [mayor_birPrev, setMayor_birPrev] = useState(null);
  const [showMayor_BirModal, setShowMayor_BirModal] = useState(false);
  const [agency_proofPreview, setAgency_proofPreview] = useState(null);
  const [showAgency_ProofModal, setShowAgency_ProofModal] = useState(false);
  const [authorized_agencyPreview, setAuthorized_agencyPreview] = useState(null);
  const [showAuthorized_agencyPreview, setShowAuthorized_agencyPreview] = useState(false);

  const [agencyName, setAgencyName] = useState('');
  const [agencyServicesOffered, setAgencyServicesOffered] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyAuthorizedRepresentative, setAgencyAuthorizedRepresentative] = useState('');

  const [DOLE, setDOLE] = useState(null);
  const [mayor_permit_or_BIR, setMayor_permit_or_BIR] = useState(null);
  const [agency_proof, setAgency_proof] = useState(null);
  const [authorized_agency_id, setAuthorized_agency_id] = useState(null);

  // ✅ React Query mutation
  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await axios.post(
        `${import.meta.env.VITE_API_URL}/manpower-provider/upload-requirements`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      alert('Requirements submitted successfully!');
      console.log('✅ Upload success:', res.data);
      onSubmitSuccess?.();
    },
    onError: (error) => {
      console.error('❌ Upload error:', error.response?.data || error.message);
    },
  });

  const submitRequirements = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('agency_name', agencyName);
    formData.append('agency_address', agencyAddress);
    formData.append('agency_services', agencyServicesOffered);
    formData.append('agency_authorized_person', agencyAuthorizedRepresentative);
    if (DOLE) formData.append('dole_registration_number', DOLE);
    if (mayor_permit_or_BIR) formData.append('mayors_permit', mayor_permit_or_BIR);
    if (agency_proof) formData.append('agency_certificate', agency_proof);
    if (authorized_agency_id) formData.append('authorized_person_id', authorized_agency_id);

    mutation.mutate(formData);
  };

  return (
    <div className='fixed flex items-center justify-center z-50 inset-0'>
      <form onSubmit={submitRequirements} className='relative z-10 border-2 border-gray-300 bg-white rounded-xl p-6 h-[90vh] overflow-y-auto w-full max-w-2xl mt-20 hide-scrollbar'>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <h1 className='font-bold text-2xl'>Create Account as Manpower Provider</h1>
        <p>Provide agency details to create an account</p>

        <div>
          <label htmlFor="agencyName" className='sr-only'>Agency Name</label>
          <input onChange={(e) => setAgencyName(e.target.value)} required value={agencyName} type="text" name='agencyName' id='agencyName' placeholder='Agency Name' className='w-full border rounded p-2 mt-2 mb-2 outline-none' />
        </div>

        <div>
          <label htmlFor="agencyAddress" className='sr-only'>Agency Address</label>
          <input onChange={(e) => setAgencyAddress(e.target.value)} required value={agencyAddress} type="text" id='agencyAddress' name='agencyAddress' placeholder='Agency Address' className='outline-none border rounded p-2 mt-2 mb-2 w-full' />
        </div>

        <div>
          <select onChange={(e) => setAgencyServicesOffered(e.target.value)} required value={agencyServicesOffered} name="agencyServicesOffered" id="agencyServicesOffered" className='w-full p-2 mb-2 mt-2 outline-none border rounded'>
            <option value="">Type of Services Offered</option>
            <option value="Recruitment Hiring">Recruitment Hiring</option>
            <option value="Manpower Outsourcing">Manpower Outsourcing</option>
            <option value="Foreign Employment Assistance">Foreign Employment Assistance</option>
            <option value="HR Consultancy">HR Consultancy</option>
          </select>
        </div>

        <div>
          <label htmlFor="agencyAuthorizedRepresentative" className='sr-only'>Authorized Personnel</label>
          <input onChange={(e) => setAgencyAuthorizedRepresentative(e.target.value)} required value={agencyAuthorizedRepresentative} type="text" placeholder='Authorized Personel' id='agencyAuthorizedRepresentative' name='agencyAuthorizedRepresentative' className='outline-none p-2 mb-2 mt-2 border rounded w-full' />
        </div>

        {/* File Uploads */}
        <div className='mt-6'>
          <h2 className='font-bold text-2xl mb-3'>Verification Requirements</h2>

          <FileUpload ref={DOLERef} label="DOLE Certificate" description="Upload a clear image of your DOLE membership" file={DOLE} setFile={setDOLE} preview={DOLEPreview} setPreview={(v) => v === 'modal' ? setShowDoleModal(true) : setDOLEPreview(v)} id="DOLE" allowPreview />

          <FileUpload ref={mayorBirRef} label="Mayor’s Permit or BIR" description="Upload this document for enhanced verification" file={mayor_permit_or_BIR} setFile={setMayor_permit_or_BIR} preview={mayor_birPrev} setPreview={(v) => v === 'modal' ? setShowMayor_BirModal(true) : setMayor_birPrev(v)} id="mayor_permit_or_BIR" allowPreview />

          <FileUpload ref={agencyProofRef} label="Other Certifications" description="Upload recent certificates for enhanced verification" file={agency_proof} setFile={setAgency_proof} preview={agency_proofPreview} setPreview={(v) => v === 'modal' ? setShowAgency_ProofModal(true) : setAgency_proofPreview(v)} id="agency_proof" allowPreview />

          <FileUpload ref={authAgenRef} label="Authorized Representative Valid ID" description="Upload a clear image of your ID" file={authorized_agency_id} setFile={setAuthorized_agency_id} preview={authorized_agencyPreview} setPreview={(v) => v === 'modal' ? setShowAuthorized_agencyPreview(true) : setAuthorized_agencyPreview(v)} id="authorized_agency_id" allowPreview />
        </div>

        {/* Agreement */}
        <div className="mt-4">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <p className="text-sm">
              By continuing, you agree to TriConnect{' '}
              <span onClick={() => setShowAgreement(true)} className="text-blue-600 font-medium cursor-pointer underline">Terms of Service</span> and acknowledge you’ve read our{' '}
              <span onClick={() => setShowAgreement(true)} className="text-blue-600 font-medium cursor-pointer underline">Data Protection Agreement</span>.
            </p>
          </div>
          {showAgreement && <Agreement onClose={() => setShowAgreement(false)} />}
        </div>

        <button type='submit' disabled={!agreed || mutation.isLoading} className={`w-full px-5 py-2 rounded mt-4 text-white ${agreed ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} cursor-pointer`}>
          {mutation.isLoading ? 'Submitting...' : 'Submit Requirements'}
        </button>
      </form>

      {/* Image Modals */}
      <PreviewImage show={showDoleModal} src={DOLEPreview} alt="DOLE Certificate Preview" onClose={() => setShowDoleModal(false)} />
      <PreviewImage show={showMayor_BirModal} src={mayor_birPrev} alt="Mayor/BIR Preview" onClose={() => setShowMayor_BirModal(false)} />
      <PreviewImage show={showAgency_ProofModal} src={agency_proofPreview} alt="Agency Proof Preview" onClose={() => setShowAgency_ProofModal(false)} />
      <PreviewImage show={showAuthorized_agencyPreview} src={authorized_agencyPreview} alt="Authorized Agency ID Preview" onClose={() => setShowAuthorized_agencyPreview(false)} />
    </div>
  );
};

export default ManpowerProviderForm;
