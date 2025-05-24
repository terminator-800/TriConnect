import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import axios from 'axios'

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


    <div className='flex justify-center items-center h-screen bg-gray-400 flex-col'>

      {(type === business || type === individual) ?
        (
          <h1 className="font-bold">
            Create an account as {type === business ? "Business Type Employer" : "Individual Type Employer"}
          </h1>
        ) :
        (
          <h1 className="font-bold">
            Create an account as
            {
              accountType === "jobseeker" ? " Job Seeker" :
                accountType === "manpowerProvider" ? " Manpower Provider" : ""
            }
          </h1>
        )}


      <form onSubmit={handleRegister} className='flex justify-center items-center p-5 rounded bg-blue-300 flex-col w-2xl '>

        <label htmlFor="email" className='mt-2'>User Name</label>
        <input onChange={(e) => setName(e.target.value)} value={email} name='email' id='name' type="email" className='outline-none border' />

        <label htmlFor="password" className='mt-2'>Enter password</label>
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='outline-none border' />

        <label htmlFor="confirmpassword" className='mt-2'>Confirm password</label>
        <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className='outline-none border' />

        <button type='submit' className='bg-green-600 text-white p-2 mt-2 rounded cursor-pointer'>Create Account</button>
      </form>

      <BackButton to='/register' className='p-5 bg-blue-600 text-white rounded mt-5 cursor-pointer' />

    </div>

  )
}

export default RegisterAccount