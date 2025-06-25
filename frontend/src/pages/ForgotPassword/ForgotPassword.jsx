import { useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, { email });
            setMessage('If this email exists, a reset link has been sent.');
            setEmail('');
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
        }

    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-500 p-4'>
            <div className='bg-gray-300 p-6 rounded shadow-md w-full max-w-md'>
                <h1 className='text-center font-bold'>Forgot Password</h1>
                <p>If you have forgotten your password, please enter your email address below. We will send you a link to reset your password.</p>
                <form onSubmit={handleSubmit}
                      className="flex flex-col mt-4">
                    <label htmlFor="email" className="font-bold mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border rounded p-2 w-full mb-2 outline-none"
                    />
                    <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Send Reset Link</button>
                    <BackButton className="bg-red-400 text-white rounded px-4 py-2 mt-2" to={`/login`}/>
                </form>
                {message &&  <p className='mt-5'>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;