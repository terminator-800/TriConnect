import Cropper from "react-easy-crop";

export const ProfileCropperModal = ({
    isOpen,
    imageSrc,
    crop,
    zoom,
    onCropChange,
    onZoomChange,
    onCropComplete,
    onCancel,
    onSave
}) => {
    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="relative w-full max-w-md h-96 bg-white rounded-lg overflow-hidden border border-gray-300 flex flex-col items-center justify-center">

                <div className="relative w-64 h-64">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropComplete}
                    />

                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => onZoomChange(Number(e.target.value))}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-40"
                    />

                    <button
                        className="absolute bottom-2 right-2 w-10 h-10 z-50 text-white rounded-full bg-blue-900"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>

                <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
