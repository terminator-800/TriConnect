const PersonalInfo = ({
    formData,
    profileData,
    editMode,
    handleInputChange,
    setEditMode,
    setFormData,
}) => {
    return (
        <div className='flex justify-between gap-5 mt-10'>
            <div className='w-full'>
                <p className='font-bold'>Email</p>
                {editMode ? (
                    <input
                        type="email"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.email}</p>
                )}

                <p className='font-bold'>Business Name</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.business_name}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.business_name}</p>
                )}

                <p className='font-bold'>Industry</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.industry}</p>
                )}

                {editMode ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditMode(false)}
                            className='bg-blue-900 text-white px-6 py-1 rounded cursor-pointer'
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setFormData(profileData); 
                                setEditMode(false);
                            }}
                            className='bg-gray-400 text-white px-6 py-1 rounded cursor-pointer'
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className='bg-blue-900 text-white px-10 py-1 rounded cursor-pointer'
                    >
                        Update Personal Information
                    </button>
                )}
            </div>

            <div className='w-full'>
                <p className='font-bold'>Authorized Person</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.authorized_person}
                        onChange={(e) => handleInputChange('authorized_person', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.authorized_person}</p>
                )}

                <p className='font-bold'>Business Address</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.business_address}
                        onChange={(e) => handleInputChange('business_address', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.business_address}</p>
                )}

                <p className='font-bold'>Business Size</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.business_size}
                        onChange={(e) => handleInputChange('business_size', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.business_size}</p>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;
