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
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>
                        {profileData.email}
                    </p>
                )}

                <p className='font-bold'>Agency Name</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.agency_name}
                        onChange={(e) => handleInputChange('agency_name', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>
                        {profileData.agency_name}
                    </p>
                )}

                <p className='font-bold'>Agency Services</p>
                {editMode ? (
                    <input
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none resize-none"
                        rows={4}
                        value={formData.agency_services}
                        onChange={(e) => handleInputChange('agency_services', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5 whitespace-pre-line'>
                        {profileData.agency_services}
                    </p>
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
                        value={formData.agency_authorized_person}
                        onChange={(e) => handleInputChange('agency_authorized_person', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>
                        {profileData.agency_authorized_person}
                    </p>
                )}

                <p className='font-bold'>Agency Address</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.agency_address}
                        onChange={(e) => handleInputChange('agency_address', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.agency_address}</p>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;
