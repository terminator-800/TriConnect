const Security = () => {
  
  return (
    <div className="mt-10">
          <label className="block font-bold mb-1">Current Password</label>
          <input type="password" placeholder='current password' className="border border-gray-300 outline-none px-2 py-1 rounded w-full mb-5"/>
          <label className="block font-bold mb-1">New Password</label>
          <input type="password" placeholder='new password' className="border border-gray-300 outline-none px-2 py-1 rounded w-full mb-5"/>
          <label className="block font-bold mb-1">Confirm New Password</label>
          <input type="password" placeholder='confirm password' className="border border-gray-300 outline-none px-2 py-1 rounded w-full mb-5"/>
        <button  className='bg-blue-900 text-white px-10 py-1 rounded cursor-pointer'>Update Password</button>
    </div>
  );
};

export default Security;