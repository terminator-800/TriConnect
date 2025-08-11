import icons from '../../../../assets/svg/Icons';

const VerificationStatus = ({ profileData, openForm }) => {
  if (profileData.is_rejected) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="bg-yellow-100 p-6 rounded-md shadow-md flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <img src={icons.not_verified} alt="Not Verified" className="w-11" />
            <div>
              <h1 className="font-bold text-2xl text-yellow-900">Submitted Requirements Rejected</h1>
              <p className="text-yellow-900 max-w-3xl">
                Your verification details were rejected due to inaccurate information or invalid documents.
                Please review and resubmit the correct details and files.
              </p>
            </div>
          </div>

          <button className="bg-green-600 text-white px-5 py-2 rounded-2xl cursor-pointer" onClick={openForm}>
            Verify Now
          </button>
        </div>
      </div>
    );
  }

  if (profileData.is_submitted) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="bg-yellow-100 p-6 rounded-md shadow-md flex justify-between items-center w-full">
          <div className="flex gap-4 items-center">
            <img src={icons.not_verified} alt="Not Verified" className="w-11" />
            <div>
              <h1 className="font-bold text-2xl text-yellow-900">Waiting for verification...</h1>
              <p className="text-yellow-900 max-w-md">
                Wait 3 days for the administrator to verify.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-yellow-100 p-6 rounded-md shadow-md flex justify-between items-center w-full">
        <div className="flex gap-4 items-center">
          <img src={icons.not_verified} alt="Not Verified" className="w-11" />
          <div>
            <h1 className="font-bold text-2xl text-yellow-900">Account Not Verified</h1>
            <p className="text-yellow-900">
              Please verify your account and complete your profile to unlock all features.
            </p>
          </div>
        </div>

        <button className="bg-green-600 text-white px-5 py-2 rounded-2xl cursor-pointer" onClick={openForm}>
          Verify Now
        </button>
      </div>
    </div>
  );
};

export default VerificationStatus;
