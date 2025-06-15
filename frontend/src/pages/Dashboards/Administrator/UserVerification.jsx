import React from 'react'

const UserVerification = () => {

     const users = [
        {
            id: 1,
            name: 'John Doe',
            type: 'Jobseeker',
            documents: 'ID, Resume',
            date: '2025-06-12',
        },
        {
            id: 2,
            name: 'Jane Smith',
            type: 'Employer',
            documents: 'Business Permit, ID',
            date: '2025-06-11',
        },
    ];

    return (
         <div className="pl-60 pr-60 pt-20">
            <h1 className="text-5xl font-bold text-blue-900">User Verification</h1>
            <p className="text-2xl mt-2">Review and verify users to allow platform access</p>

            <div className="mt-10">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User Details</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted Documents</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.documents}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserVerification