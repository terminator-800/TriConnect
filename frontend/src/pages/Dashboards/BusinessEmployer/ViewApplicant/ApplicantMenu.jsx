const ApplicantMenu = ({ onRejectClick, onViewProfileClick }) => {
  
  return (
    <div className="absolute right-10 top-10 bg-white border border-gray-300 rounded-lg shadow-md z-10 p-2">
      <ul className="text-black">

        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
            onClick={onViewProfileClick}>
            View Profile
        </li>

        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">Message</li>

        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded text-red-600"
          onClick={onRejectClick}
        >
          Reject Applicant
        </li>

      </ul>
    </div>
  );
};

export default ApplicantMenu;
