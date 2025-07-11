import { useEffect } from "react";

const PreviewImage = ({ show, src, alt, onClose }) => {
  if (!show) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-opacity-75 flex items-center justify-center">
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-screen rounded-lg shadow-lg"
        />
        <button
          className="absolute top-2 right-2 text-3xl font-bold text-blue-500 cursor-pointer"
          onClick={onClose}
          aria-label="Close Modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PreviewImage
