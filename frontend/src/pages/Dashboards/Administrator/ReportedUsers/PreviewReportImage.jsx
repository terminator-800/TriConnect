const PreviewReportImage = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 z-[60]">
      <div className="relative max-w-3xl w-full  border border-gray-300 rounded-lg">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 cursor-pointer text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Full Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
          onError={(e) => (e.target.src = '/placeholder.png')}
        />
      </div>
    </div>
  );
};

export default PreviewReportImage;
