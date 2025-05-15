import React from 'react'
import BackButton from '../components/BackButton'

const Login = () => {

    const handleLogin =() => {

    }

    return (
        <div className='flex justify-center items-center h-screen flex-col bg-gray-500'>

            <h1 className='font-bold'>Login your account</h1>

            <form onSubmit={handleLogin} className='flex flex-col border rounded p-5 bg-blue-300 w-xl'>

                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" required className='border rounded outline-none p-2 mt-2 mb-2'/>

                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" required className='border rounded outline-none p-2'/>

                <button type="submit" className='bg-green-700 text-white mt-2 mb-2 rounded pt-2 pb-2 cursor-pointer'>Login</button>
            </form>


            <BackButton to='/' className='bg-blue-400 p-3 rounded mt-2 cursor-pointer'/>
        </div>
    )
}

export default Login