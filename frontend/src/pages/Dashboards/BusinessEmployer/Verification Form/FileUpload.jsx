import { useRef, forwardRef, useImperativeHandle } from 'react';
import icons from '../../../../assets/svg/Icons';

const BusinessFileUpload = forwardRef(({ label, description, setFile, preview, setPreview, id, allowPreview = false }, ref) => {
  const fileInputRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (allowPreview && setPreview) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleReuploadClick = () => fileInputRef.current?.click();

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='border-2 border-gray-400 rounded px-10 py-5 flex flex-col items-center justify-center text-center mb-5'>
      {!preview ? (
        <label htmlFor={id} className='cursor-pointer w-full'>
          <strong className='text-gray-400'>{label}</strong>
          <p className='pb-2'>{description}</p>
          <div className='border border-gray-400 rounded-xl flex items-center justify-center gap-5 p-2 w-120'>
            <img src={icons.attach_file} alt="" className='w-10' />
            <p className='text-gray-400 text-md'>Attach Files</p>
          </div>
        </label>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {allowPreview && preview && (
            <img
              src={preview}
              alt={`${label} Preview`}
              className="rounded shadow max-h-40 object-contain cursor-pointer mb-2"
              onClick={() => setPreview('modal')}
            />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReuploadClick}
              className="text-sm cursor-pointer bg-blue-900 px-5 py-2 rounded-xl text-white"
            >
              Reupload
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm cursor-pointer bg-red-500 px-5 py-2 rounded-xl text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        onChange={handleChange}
        type="file"
        name={id}
        id={id}
        accept="image/*"
        className='hidden'
        required
      />
    </div>
  );
});

export default BusinessFileUpload;
