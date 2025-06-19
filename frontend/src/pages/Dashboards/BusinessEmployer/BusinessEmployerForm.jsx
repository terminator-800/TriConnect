import axios from 'axios';
import { useState, useRef } from 'react';
import Agreement from '../Agreement';
import BusinessFileUpload from './BusinessFileUpload';
import PreviewImage from './BusinessPreviewImage';

const BusinessEmployerForm = ({ onClose, onSubmitSuccess }) => {
  // Refs for file uploads
  const authorizedRef = useRef();
  const businessBIRref = useRef();
  const dtiRef = useRef();
  const businessEstablishmentRef = useRef();

  // Agreement state
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  // Previews and modals
  const [authorizedPreview, setAuthorizedPreview] = useState(null);
  const [showAuthorizedModal, setShowAuthorizedModal] = useState(false);
  const [businessBIRPreview, setBusinessBIRPreview] = useState(null);
  const [showBusinessBIRModal, setShowBusinessBIRModal] = useState(false);
  const [dtiPreview, setDtiPreview] = useState(null);
  const [showDtiModal, setShowDtiModal] = useState(false);
  const [businessEstablishmentPreview, setBusinessEstablishmentPreview] = useState(null);
  const [showBusinessEstablishmentModal, setShowBusinessEstablishmentModal] = useState(false);

  // Form fields
  const [business_name, setBusinessName] = useState("");
  const [business_address, setBusinessAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [business_size, setBusinessSize] = useState("");
  const [authorized_person, setAuthorizedPerson] = useState("");

  // File fields
  const [authorized_person_id, setAuthorizedPersonID] = useState(null);
  const [business_permit_BIR, setBusinessPermitBIR] = useState(null);
  const [DTI, setDTI] = useState(null);
  const [business_establishment, setBusinessEstablishment] = useState(null);
  
  const submitRequirements = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('business_name', business_name);
    formData.append('business_size', business_size);
    formData.append('business_address', business_address);
    formData.append('industry', industry);
    formData.append('authorized_person', authorized_person);
    formData.append('authorized_person_id', authorized_person_id);
    formData.append('business_permit_BIR', business_permit_BIR);
    formData.append('DTI', DTI);
    formData.append('business_establishment', business_establishment);
 
    try {
      const response = await axios.post(
        'http://localhost:3001/business-employer/upload-requirements', 
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

  return (
    <div className='fixed flex items-center justify-center z-50 inset-0'>
      <form
        onSubmit={submitRequirements}
        className='relative z-10 border-2 border-gray-300 bg-white rounded-xl p-6 h-[90vh] overflow-y-auto w-full max-w-2xl mt-20 hide-scrollbar'
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <h1 className='font-bold text-2xl'>Verification Form as Employer</h1>
        <p className='mb-5'>Provide your details to verify your account!</p>

        {/* Business Name */}
        <div className='mb-3'>
          <input
            onChange={(e) => setBusinessName(e.target.value)}
            value={business_name}
            type="text"
            id="employerBusinessName"
            placeholder="Business Name"
            className='border w-full mb-2 mt-2 p-2 rounded outline-none'
            required
          />
        </div>

        {/* Business Address */}
        <div className='mb-3'>
          <input
            onChange={(e) => setBusinessAddress(e.target.value)}
            value={business_address}
            type="text"
            id="business_address"
            placeholder="Business Address"
            className='border w-full mb-2 mt-2 p-2 rounded outline-none'
            required
          />
        </div>

        {/* Industry */}
        <div className='mb-3'>
          <select
            onChange={(e) => setIndustry(e.target.value)}
            value={industry}
            className="w-full border p-2 rounded mb-2 outline-none"
            required
          >
            <option value="">Industry</option>
            <option value="Corporations">Corporations</option>
            <option value="Small Busines">Small Businesses</option>
            <option value="Government">Government</option>
            <option value="Freelance Agencies">Freelance Agencies</option>
          </select>
        </div>

        {/* Business Size */}
        <div className='mb-3'>
          <select
            onChange={(e) => setBusinessSize(e.target.value)}
            value={business_size}
            className="w-full border p-2 rounded mb-2 outline-none"
            required
          >
            <option value="">Business Size</option>
            <option value="Corporations">Corporations</option>
            <option value="Small Businesses">Small Businesses</option>
            <option value="Government">Government</option>
            <option value="Freelance Agencies">Freelance Agencies</option>
          </select>
        </div>

        {/* Authorized Person */}
        <div className='mb-3'>
          <input
            onChange={(e) => setAuthorizedPerson(e.target.value)}
            value={authorized_person}
            type="text"
            id="authorized_person"
            placeholder="Authorized Person (Full Name)"
            className='border w-full mb-2 mt-2 p-2 rounded outline-none'
            required
          />
        </div>

        {/* File Uploads */}
        <div className='mt-6'>
          <h2 className='font-bold text-2xl mb-3'>Verification Requirements</h2>

          <BusinessFileUpload
            ref={authorizedRef}
            label="Authorized Representative Valid ID (upload)"
            description="Upload a clear image of your (Passport, Driver’s License, etc.)"
            file={authorized_person_id}
            setFile={setAuthorizedPersonID}
            preview={authorizedPreview}
            setPreview={(value) => value === 'modal' ? setShowAuthorizedModal(true) : setAuthorizedPreview(value)}
            id="authorized_person_id"
            allowPreview
          />

          <BusinessFileUpload
            ref={businessBIRref}
            label="Business Permit or BIR Registration (upload)"
            description="Upload this document for enhanced verification"
            file={business_permit_BIR}
            setFile={setBusinessPermitBIR}
            preview={businessBIRPreview}
            setPreview={(value) => value === 'modal' ? setShowBusinessBIRModal(true) : setBusinessBIRPreview(value)}
            id="business_permit_BIR"
            allowPreview
          />

          <BusinessFileUpload
            ref={dtiRef}
            label="DTI Certificate (upload)"
            description="Upload recent certificates for enhanced verification"
            file={DTI}
            setFile={setDTI}
            preview={dtiPreview}
            setPreview={(value) => value === 'modal' ? setShowDtiModal(true) : setDtiPreview(value)}
            id="DTI"
            allowPreview
          />

          <BusinessFileUpload
            ref={businessEstablishmentRef}
            label="Business Establishment Proof (upload)"
            description="The photo should clearly show your business name or signage"
            file={business_establishment}
            setFile={setBusinessEstablishment}
            preview={businessEstablishmentPreview}
            setPreview={(value) => value === 'modal' ? setShowBusinessEstablishmentModal(true) : setBusinessEstablishmentPreview(value)}
            id="business_establishment"
            allowPreview
          />
        </div>

        {/* Agreement */}
        <div className="mt-4">
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

          {showAgreement && <Agreement onClose={() => setShowAgreement(false)} />}
        </div>

        {/* Submit */}
        <button
          type='submit'
          disabled={!agreed}
          className={`w-full px-5 py-2 rounded mt-4 text-white ${agreed ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'} cursor-pointer`}
        >
          Submit Requirements
        </button>
      </form>

      {/* Image Preview Modals */}
      <PreviewImage show={showAuthorizedModal} src={authorizedPreview} alt="Authorized Person ID Preview" onClose={() => setShowAuthorizedModal(false)} />
      <PreviewImage show={showBusinessBIRModal} src={businessBIRPreview} alt="BIR Registration Preview" onClose={() => setShowBusinessBIRModal(false)} />
      <PreviewImage show={showDtiModal} src={dtiPreview} alt="DTI Certificate Preview" onClose={() => setShowDtiModal(false)} />
      <PreviewImage show={showBusinessEstablishmentModal} src={businessEstablishmentPreview} alt="Business Establishment Preview" onClose={() => setShowBusinessEstablishmentModal(false)} />
    </div>
  );
};

export default BusinessEmployerForm;
