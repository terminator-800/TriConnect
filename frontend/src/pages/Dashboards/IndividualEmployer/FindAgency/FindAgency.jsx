import { useUncontactedAgencies } from "../../../../../hooks/useUncontactedAgencies";
import { useUserProfile } from "../../../../../hooks/useUserProfiles";
import { useState } from "react";
import { ROLE } from "../../../../../utils/role";
import VerificationStatus from "../../../../pages/Dashboards/IndividualEmployer/Verification Form/VerificationStatus";
import MessageAgency from "../../../../components/MessageAgency";
import Pagination from "../../../../components/Pagination";
import Sidebar from "../Sidebar";
import Form from "../../../../pages/Dashboards/IndividualEmployer/Verification Form/Form";

const FindAgency = () => {
  // Individual Employer Profile
  const {
    data: profileData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useUserProfile(ROLE.INDIVIDUAL_EMPLOYER);

  // Uncontacted Agencies
  const {
    agencies = [],
    isLoading: isAgenciesLoading,
    error: agencyError,
  } = useUncontactedAgencies(ROLE.INDIVIDUAL_EMPLOYER);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const agenciesPerPage = 4;
  const totalPages = agencies.length > 0
    ? Math.ceil(agencies.length / agenciesPerPage)
    : 1;
  const startIndex = (currentPage - 1) * agenciesPerPage;
  const currentAgencies = agencies.slice(startIndex, startIndex + agenciesPerPage);

  const [showApply, setShowApply] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openApply = (agency) => {
    setSelectedAgency(agency);
    setShowApply(true);
  };

  const openForm = () => {
    document.body.style.overflow = 'hidden';
    setShowForm(true);
  };

  if (loading || !profileData) {
    return (
      <>
        <Sidebar />
        <div className="pl-110 pr-50 pt-50 p-10 min-h-screen text-xl">Loading profile...</div>
      </>
    );
  }

  if (isError || agencyError) {
    return (
      <>
        <Sidebar />
        <div className="pl-110 pr-50 pt-50 p-10 text-red-600">
          An error occurred: {error?.message || agencyError?.message || "Unknown error."}
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      {showApply && selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <MessageAgency
            sender={profileData}
            receiver={selectedAgency}
            role={ROLE.INDIVIDUAL_EMPLOYER}
            onClose={() => setShowApply(false)}
          />
        </div>
      )}

      {showForm && (
        <Form
          profileData={profileData}
          onClose={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
          }}
          onSubmitSuccess={() => {
            setShowForm(false);
            document.body.style.overflow = 'auto';
            refetch();
          }}
        />
      )}

      <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400 pl-110 pr-50 pt-50 pb-32">
        {profileData?.is_verified ? (
          <>
            <h1 className="text-5xl font-bold text-blue-900">
              Search for Manpower Provider
            </h1>
            <p className="text-2xl mt-2">
              Find agencies to help with your recruitment needs
            </p>

            {isAgenciesLoading ? (
              <p className="mt-10 text-lg">Loading agencies...</p>
            ) : agencies.length === 0 ? (
              <p className="mt-10 text-lg italic text-gray-500">No manpower providers found.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 mt-15">
                  {currentAgencies.map((agency) => (
                    <div
                      key={agency.user_id}
                      className="flex flex-col bg-white rounded-xl border border-gray-300 p-6 shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-800">
                          {(agency.agency_name || "").substring(0, 2).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-semibold">
                          {agency.agency_name}
                        </h2>
                      </div>
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => openApply(agency)}
                          className="bg-blue-900 text-white px-10 py-2 rounded-md cursor-pointer"
                        >
                          Message
                        </button>
                        <button className="border border-gray-400 px-4 py-2 rounded-md cursor-pointer">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </>
        ) : (
          <div className="bg-white shadow-md rounded-3xl p-6 w-full max-w-7xl border border-gray-300 px-20">
            <VerificationStatus profileData={profileData} openForm={openForm} />
            <p className="mt-4 text-sm text-gray-600">
              {profileData?.is_rejected
                ? "Your verification request was rejected. Please review and resubmit the form."
                : profileData?.is_submitted
                  ? "Your verification is under review. Please wait for approval."
                  : "You need to submit verification before accessing this feature."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FindAgency;
