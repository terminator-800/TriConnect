import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import axios from 'axios'
import Navbar from '../Navbar'

const RegisterAccount = () => {

  const { accountType, type } = useParams()
  const navigate = useNavigate()
  const [email, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const individual = "individual"
  const business = "business"



  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      if (accountType === "employer") {
        if (type === business) {
          try {
            const businessRes = await axios.post(
              `http://localhost:3001/register/${accountType}/${type}/account`,
              data
            );
            console.log(data);
            if (businessRes.status === 201) {
              navigate('/register/employer/business/account/verify');
              alert("Business employer account created successfully");
            } else {
              console.log(businessRes.status);
              alert("Business employer account creation failed");
            }
          } catch (error) {
            console.error("Business registration failed:", error);

            if (error.response && error.response.status === 409) {
              alert("Username already exists. Please choose a different one.");
            } else {
              alert("Business employer registration failed");
            }
          }

          // For individual-type employer
        } else if (type === individual) {
          try {
            const individualRes = await axios.post(
              `http://localhost:3001/register/${accountType}/${type}/account`,
              data
            );
            console.log(data);

            if (individualRes.status === 201) {
              alert("Individual employer account created successfully");
              navigate('/register/employer/business/account/verify');
            } else {
              alert("Individual employer account creation failed");
            }
          } catch (error) {
            console.error("Individual registration failed:", error);

            if (error.response && error.response.status === 409) {
              alert("Username already exists. Please choose a different one.");
            } else {
              alert("Individual employer registration failed");
            }
          }
        }
      } else {
        try {
          const res = await axios.post(`http://localhost:3001/register/${accountType}`, data);
          console.log(data);
          if (res.status === 201) {
            alert(
              accountType === "jobseeker"
                ? "Jobseeker account created successfully"
                : "Manpower Provider account created successfully"
            );
            navigate(`/register/${accountType}/verify`);
          } else {
            alert("Account creation failed");
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            alert("Username already exists. Please choose a different one.");
          } else {
            console.error("Registration failed:", error);
            alert("Account creation failed");
          }
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(error);
      } else {
        console.error(error);
        alert("Account creation failed");
      }
    }
  };

  return (
    <>
      <Navbar userType={"register"}/>
      <div className='flex justify-center items-center h-screen bg-gradient-to-b from-white to-cyan-400 flex-col'>
        {type === business || type === individual ? (
          <h1 className="font-bold text-3xl text-left mb-5">
            Create an account as ({type === business ? "Business Type Employer" : "Individual Type Employer"})
          </h1>
        ) : (
          <h1 className="font-bold text-2xl text-left mb-5">
            Create an account as ({
              accountType === "jobseeker" ? "Job Seeker" :
                accountType === "manpower-provider" ? "Manpower Provider" : ""
            })
          </h1>
        )}

        <div className='border pt-10 pb-10 pl-15 pr-15 rounded-md flex flex-col bg-white'>
          <form onSubmit={handleRegister} className='flex  rounded-md bg-white flex-col w-3xl'>

            <label htmlFor="email" className='mt-2 font-bold '>Email Address</label>
            <input onChange={(e) => setName(e.target.value)} value={email} required name='email' id='name' type="email" placeholder='Enter your email address' className='outline-none border border-gray-400 rounded p-1 pl-3' />

            <label htmlFor="password" className='mt-2 font-bold'>Enter password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} required type="password" placeholder='Enter your password' className='outline-none border border-gray-400 rounded p-1 pl-3' />

            <label htmlFor="confirmpassword" className='mt-2 font-bold'>Confirm password</label>
            <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required type="password" placeholder='Enter your password again' className='outline-none border border-gray-400 rounded p-1 pl-3' />

            <div className="flex justify-center mt-5 gap-10">
              <button type='submit' className='bg-blue-900 text-white pt-1 pb-1 pl-10 pr-10 rounded-3xl w-50 text-2xl cursor-pointer'>Proceed</button>
            </div>

          </form>


          <div className="flex justify-center mt-5 gap-10">
            <BackButton to='/register' className='bg-white text-blue-900 pt-1 pb-1 pl-10 pr-10 rounded-3xl w-50 text-2xl cursor-pointer border border-blue-900' />
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterAccount