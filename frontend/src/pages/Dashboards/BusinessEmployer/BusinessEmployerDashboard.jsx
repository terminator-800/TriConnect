import Sidebar from './Sidebar';
import Navbar from '../../Navbar';
const BusinessEmployerDashboard = () => {


  return (
    <div className="relative min-h-[120vh] bg-gradient-to-b from-white to-cyan-400">

      {/* Navbar */}
      {/* <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={"business_employer"} />
      </div> */}

      {/* Sidebar */}
      <Sidebar />
    </div>
  )
}

export default BusinessEmployerDashboard