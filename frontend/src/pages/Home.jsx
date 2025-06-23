import Navbar from './Navbar'
import Footer from './Footer'
import icons from '../assets/svg/Icons'
import { Link } from 'react-router-dom'

const Home = () => {

  return (
    <div className='items-center'>
      <Navbar userType={'guest'} />
      <div className='flex pl-50 pr-0 mt-50 items-center'>
        <div>
          <h1 className='text-7xl font-bold'>Connecting Jobs, People, <br />And Oppurtunities</h1>
          <p className='mt-5 text-2xl text-gray-600 mb-15'>TriConnect is your all-in-one solution that seamlessly <br />
            connects job seekers, employers, and manpower <br />
            providers on a single, smart, and secure platform.</p>

          <Link to={"/register"} className='bg-blue-900 text-white pt-1 pb-1 pl-15 pr-15 rounded-3xl text-2xl cursor-pointer'>Get Started</Link>
        </div>

        <img src={icons.landing_page} alt="landing_page" className='pl-50 h-120' />
      </div>

      <div className='mt-60 mb-20'>
        <h1 className='text-6xl font-bold text-center'>Why Choose TriConnect</h1>

        <p className='mt-5 text-2xl text-gray-600 text-center'>Our platform offers a comprehensive suite of features designed to streamline the <br />
          hiring process and improve access to job opportunities for all.</p>
      </div>

      <div className='bg-cyan-200 ml-5 mr-5 p-10 flex flex-wrap justify-center items-center'>

        <div className='bg-white rounded-2xl w-md pb-15 pt-15 m-5 shadow-md text-center '>
          <h1 className='font-semibold text-3xl'>User Verification</h1>
          <p className='text-2xl text-gray-600 mt-5'>All users undergo a <br />verification process to <br /> ensure safety and trust <br /> within the platform.</p>
        </div>

        <div className='bg-white rounded-2xl w-md pb-15 pt-15 m-5 shadow-md text-center '>
          <h1 className='font-semibold text-3xl'>Document Validation</h1>
          <p className='text-2xl text-gray-600 mt-5'>All users undergo a <br />verification process to <br /> ensure safety and trust <br /> within the platform.</p>
        </div>

        <div className='bg-white rounded-2xl w-md pb-19 pt-19 m-5 shadow-md text-center'>
          <h1 className='font-semibold text-3xl'>Post Management</h1>
          <p className='text-2xl text-gray-600 mt-5'>Employers can easily <br /> create, manage with <br /> detailed information.</p>
        </div>

        <div className='bg-white rounded-2xl w-md pb-19 pt-19 m-5 shadow-md text-center'>
          <h1 className='font-semibold text-3xl'>Real-Time Notifications</h1>
          <p className='text-2xl text-gray-600 mt-5'>Receive instant updates <br /> about application status,<br /> job posts, and verification results.</p>
        </div>

        <div className='bg-white rounded-2xl w-md pb-15 pt-15 m-5 shadow-md text-center'>
          <h1 className='font-semibold text-3xl'>Agency Coordination</h1>
          <p className='text-2xl text-gray-600 mt-5'>Manpower providers can <br /> assist in matching job seekers <br />with employers for efficient <br /> job placement.</p>
        </div>
      </div>

      <div id='how_it_works' className='text-center mt-60'>
        <h1 className='text-7xl font-bold'>How TriConnect Works</h1>
        <p className='text-2xl text-gray-600 mt-10'>Our platform makes it easy to connect job opportunities with the right talent <br /> through a simple process.</p>
      </div>

      <div className='m-30 flex '>
        <div className=' bg-gray-200 rounded text-4xl w-35 text-center font-bold h-40 flex justify-center items-center mr-10 ml-20 shadow-xl'>
          <h1>1</h1>
        </div>

        <div className='flex flex-col justify-center items-start ml-5'>
          <h1 className='text-4xl font-semibold'>Register & Verify</h1>
          <p className='text-2xl text-gray-600 mt-5'>Create an account as a job seeker, employer, or agency and wait for the verification</p>
        </div>
      </div>

      <div className='m-30 flex '>
        <div className=' bg-gray-200 rounded text-4xl w-35 text-center font-bold h-40 flex justify-center items-center shadow-xl mr-10 ml-20 '>
          <h1>2</h1>
        </div>

        <div className='flex flex-col justify-center items-start ml-5'>
          <h1 className='text-4xl font-semibold'>Create Profile</h1>
          <p className='text-2xl text-gray-600 mt-5'>Build your profile with relevant information, skills, job needs, or agency services.</p>
        </div>
      </div>

      <div className='m-30 flex '>
        <div className=' bg-gray-200 rounded text-4xl w-35 text-center font-bold h-40 flex justify-center items-center shadow-xl mr-10 ml-20'>
          <h1>3</h1>
        </div>

        <div className='flex flex-col justify-center items-start ml-5'>
          <h1 className='text-4xl font-semibold'>Connect</h1>
          <p className='text-2xl text-gray-600 mt-5'>Browse jobs, post opportunities, or facilitate connections between employers and jobseekers.</p>
        </div>
      </div>

      <div className='m-30 flex '>
        <div className=' bg-gray-200 rounded text-4xl w-35 text-center font-bold h-40 flex justify-center items-center shadow-xl mr-10 ml-20'>
          <h1>4</h1>
        </div>

        <div className='flex flex-col justify-center items-start ml-5'>
          <h1 className='text-4xl font-semibold'>Communicate</h1>
          <p className='text-2xl text-gray-600 mt-5'>Use our secure messaging system to discuss details and finalize arrangements.</p>
        </div>
      </div>

      <div className='bg-cyan-200 h-100 text-center flex flex-col justify-center items-center mt-60 mb-20'>
        <h1 className='text-7xl font-bold mb-5'>Feedbacks From Satisfied Users</h1>
        <p className='text-2xl text-gray-600'>Hear from our users about how TriConnect has helped them find jobs and talent.</p>
      </div>

      <div className='m-10 drop-shadow-xl shadow-xl pt-10 pb-10 pl-30 rounded-2xl flex flex-col ml-20 mt-20'>
        <p className='text-gray-600 italic text-2xl'>
          "As a freelancer looking for short-term construction jobs, TriConnect has been a game-changer. I no longer have to rely on word-of-mouth to find work opportunities."
        </p>

        <div className='flex items-center gap-4 mt-5 mr-5'>
          <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center font-bold text-lg">
            LM
          </div>
          <div className='flex flex-col mt-2'>
            <h1 className='font-semibold text-2xl '>Lanlyn Mongado</h1>
            <p className='text-gray-600'>Jobseeker</p>
          </div>
        </div>
      </div>


      <div className='m-10 drop-shadow-xl shadow-xl pt-10 pb-10 pl-30 rounded-2xl flex flex-col ml-20 mt-20'>
        <p className='text-gray-600 italic text-2xl'>
          "Finding qualified workers for our small business used to be a challenge. With TriConnect, we can quickly post jobs and connect with potential candidates or agencies."
        </p>
        <div className='flex items-center gap-4 mt-5 mr-5'>
          <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center text-lg font-bold">
            SF
          </div>
          <div className='flex flex-col'>
            <h1 className='font-semibold mt-2 text-2xl'>Samantha Ferrer</h1>
            <p className='text-gray-600'>Employer</p>
          </div>
        </div>
      </div>

      <div className='m-10 drop-shadow-xl shadow-xl pt-10 pb-10 pl-30 rounded-2xl flex flex-col ml-20 mt-20'>
        <p className='text-gray-600 italic text-2xl'>
          "Our manpower agency has expanded our client base significantly since joining TriConnect. The platform makes it easy to connect job seekers with employers efficiently."
        </p>

        <div className='flex items-center gap-4 mt-5 mr-5'>
          <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center text-lg font-bold">
            DM
          </div>
          <div className='flex flex-col'>
            <h1 className='font-semibold mt-2 text-2xl'>Dennese Keith Membrano</h1>
            <p className='text-gray-600'>Manpower Provider</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home