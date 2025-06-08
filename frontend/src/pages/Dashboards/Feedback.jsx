import React from 'react';

const Feedback = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
            {/* Semi-transparent background overlay */}



            {/* Feedback modal */}
            <div className="relative bg-white pl-7 pr-7 pt-5 pb-5 rounded-xl shadow-lg w-[550px] z-10">


                <div className='border-b-4 border-gray-300 flex justify-between mb-3'>
                    <h2 className="text-2xl font-bold">Feedback Details</h2>
                    <button
                        onClick={onClose}
                        className=" text-blue-900 pl-4 font-bold text-2xl rounded cursor-pointer mb-2"
                    >
                        X
                    </button>
                </div>
                
                <p className='text-gray-500'>Your Feedback Message:</p>
                <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded pl-3 pr-3 pt-1 mb-4 h-[250px] outline-none"
                    placeholder="As a freelancer looking for short-term construction jobs, TriConnect has been a game-changer. I no longer have to rely on word-of-mouth to find work opportunities."
                ></textarea>

                <div className="flex justify-end gap-4">
                    <button className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer">
                        Submit Feedback
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Feedback;