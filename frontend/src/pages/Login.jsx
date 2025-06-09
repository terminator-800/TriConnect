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

        <>
        <Navbar userType={"login"}/>
        <div className='flex justify-center items-center h-[85vh] bg-white'>
            <div className='w-xl h-[576px] bg-gradient-to-b from-cyan-400 to-gray-100 p-15 border border-blue-900 '>

                <h1 className='text-white text-5xl font-bold mb-2'>Welcome to TriConnect Portal</h1>
                <p className='text-blue-900 text-[20px]'>Login to access your account</p>
            </div>

            <div>
                <form onSubmit={handleLogin} className='flex flex-col border border-blue-900 p-15 bg-white w-xl h-[576px]'>
                    <h1 className='font-bold text-5xl text-blue-900'>Login</h1>
                    <p className='text-[20px] text-blue-900 mb-10 mt-2'>Enter your account details</p>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        required
                        className='border rounded outline-none p-2 mb-5 border-gray-400'
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
                        className='border rounded outline-none p-2 mb-5 border-gray-400'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className='bg-blue-900 text-white mt-2 mb-2 rounded pt-2 pb-2 cursor-pointer text-[20px]'>Login</button>
                    <button type="button" className='text-[20px] text-gray-600 self-start mt-1 hover:text-blue-600 cursor-pointer '
                        onClick={() => navigate('/forgot-password')}
                    >Forgot password?</button>

                    <div className='mt-25'>
                        <p className='text-gray-600 text-[20px]'>Don't have an account?
                            <button className='text-blue-900 cursor-pointer ml-3 text-[20px]'>Sign up</button>
                        </p>
                    </div>

                </form>
            </div>
        </div>
        </>
    );
};

export default Login;