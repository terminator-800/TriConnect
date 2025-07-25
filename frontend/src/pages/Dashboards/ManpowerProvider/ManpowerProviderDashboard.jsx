import { ROLE } from '../../../../utils/role';
import Navbar from '../../Navbar';
import Sidebar from './Sidebar';

const ManpowerProviderDashboard = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-cyan-400">

      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar userType={`${ROLE.MANPOWER_PROVIDER}`} />
      </div>
      <Sidebar />
    </div>
  )
}

export default ManpowerProviderDashboard