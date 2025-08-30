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

                <p className='font-bold'>Full Name</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.full_name}</p>
                )}

                <p className='font-bold'>Phone</p>
                {editMode ? (
                    <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.phone}</p>
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
                <p className='font-bold'>Gender</p>
                {editMode ? (
                    <select
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>{profileData.gender}</p>
                )}

                <p className='font-bold'>Date of Birth</p>
                {editMode ? (
                    <input
                        type="date"
                        className="border border-gray-300 px-2 py-1 rounded w-full mb-5 outline-none"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                ) : (
                    <p className='border border-gray-300 rounded-md px-2 py-1 mt-1 mb-5'>
                        {profileData.date_of_birth}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;
