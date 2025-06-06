import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Navbar from './Navbar';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/login',
                { email, password },
                { withCredentials: true });

            if (res.status === 200) {
                console.log('Login successful:', res.data);

                switch (res.data.role) {
                    case "jobseeker":
                        navigate("/jobseeker");
                        break;
                    case "business_employer":
                        navigate("/business-employer");
                        break;
                    case "individual_employer":
                        navigate("/individual-employer");
                        break;
                    case "manpower_provider":
                        navigate("/manpower-provider");
                        break;
                    case "admin":
                        navigate("/admin");
                        break;
                    default:
                        navigate("/");
                }
            }
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className='flex justify-center items-center h-screen flex-col bg-gray-500'>
            <Navbar text="Home" className="text-black" />
            <h1 className='font-bold'>Login your account</h1>
            <form onSubmit={handleLogin} className='flex flex-col border rounded p-5 bg-blue-300 w-xl'>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    className='border rounded outline-none p-2 mt-2 mb-2'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    className='border rounded outline-none p-2'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" className='bg-green-700 text-white mt-2 mb-2 rounded pt-2 pb-2 cursor-pointer'>Login</button>
                <button type="button" className='text-sm text-blue-800 underline self-start mt-1 hover:text-blue-600 cursor-pointer'
                    onClick={() => navigate('/forgot-password')}
                >Forgot password?</button>

            </form>

            <BackButton to='/' className='bg-blue-400 p-3 rounded mt-2 cursor-pointer' />
        </div>
    );
};

export default Login;