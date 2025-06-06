import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
const Home = () => {

  return (
    <div className='flex justify-center items-center h-screen bg-gray-500'>
        <Navbar text="Home" className="text-black"/>
        <div className='flex justify-center items-center p-5 flex-col border'>
            <h1>This is the homepage</h1>
            <Link to={"/login"} className='bg-blue-300 p-5 rounded m-2'>Login</Link>
            <Link to={"/register"} className='bg-green-300 p-5 rounded m-2'>Sign Up</Link>
           
        </div>
        
    </div>
  )
}

export default Home