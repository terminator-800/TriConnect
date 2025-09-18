import icons from "../../assets/svg/Icons";

export const ProfileImage = ({ profileData, fileInputRef, onClick, onFileChange, isLoading }) => (
    <div className="ml-6 relative w-32 h-32">
        {profileData?.profile ? (
            <div className="w-32 h-32 rounded-full overflow-hidden shadow border border-gray-300">
                <img
                    src={profileData.profile}
                    alt={`${profileData.full_name}'s profile`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={onClick}
                    onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                />
            </div>
        ) : (
            <div className="bg-gray-300 w-32 h-32 rounded-full flex justify-center items-center font-bold text-lg text-gray-800 shadow">
                PHOTO
            </div>
        )}

        <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
        />

        <button
            type="button"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-2 w-8 h-8 cursor-pointer disabled:opacity-50"
        >
            <img src={icons.change_profile} alt="change profile" className="w-full h-full" />
        </button>
    </div>
);
