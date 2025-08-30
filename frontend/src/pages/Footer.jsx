import { Link } from "react-router-dom"

const Footer = () => {
  return (

    <div className="flex justify-between items-start bg-blue-900  pt-5 pb-5 pl-40 pr-40 border-t-2 border-gray-300 shadow-md text-gray-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Quick Links</h1>
        <Link>Features</Link>
        <Link>How it works</Link>
        <Link>Why us</Link>
      </div>

      <div className="gap-2 flex flex-col">
        <h1 className="text-2xl font-bold">User Types</h1>
        <p>Job Seekers</p>
        <p>Employers</p>
        <p>Manpower Providers</p>
      </div>

      <div className="gap-2 flex flex-col">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p>info@triconnect.com</p>
        <p>+639123456789</p>
        <p>City of Cabadbaran, Philippines</p>
      </div>

    </div>
  )
}

export default Footer