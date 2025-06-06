const Navbar = ({ text, className, onClick }) => {
  return (
    <div
      className={`
        fixed top-0 left-0 right-0 h-16 bg-blue-300 flex items-center px-6 shadow z-40
        transition-all duration-300 ${className}
      `}
    >
      <span className="text-lg font-semibold">Navbar</span>

      {/* Dynamic Text with Button */}
      {text && (
        <button
          onClick={onClick}
          className="ml-auto text-lg font-semibold cursor-pointer hover:underline"
        >
          {text}
        </button>
      )}
    </div>
  );
};

export default Navbar;