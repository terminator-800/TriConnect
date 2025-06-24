const Agreement = ({ onClose }) => {

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>
        <p className="text-gray-700  leading-relaxed text-justify space-y-4">
          Welcome to TriConnect, a platform designed to connect Jobseekers, Employers, and Agencies with <br />
          meaningful work opportunities. Your privacy matters to us. This Privacy Policy explains how we collect,
          use, and protect your information.
        </p>
      </div>
    </div>
  );
};

export default Agreement;
