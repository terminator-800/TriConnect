import Sidebar from '../Sidebar';
import BarChart from './BarChart';

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen flex flex-col justify-between 
               bg-linear-to-b from-white to-cyan-400
                xl:px-50 xl:pt-50
                xl:ml-50
                lg:ml">

        <div>
          <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-700">Gain insights into job post trends, user engagement, and overall platform growth.</p>

          {/* Cards */}
          <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start">
            {/* Card Template */}
            {[
              { title: 'Total Job Seekers', value: 0 },
              { title: 'Total Employers', value: 0 },
              { title: 'Total Agencies', value: 0 },
              { title: 'Hired Job Seekers', value: 0 },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white shadow-md rounded-lg 
                           flex flex-col justify-center items-center 
                           flex-1 min-w-[200px] max-w-[250px] h-32"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className='bg-white p-5 rounded-lg mt-8 mb-20'>
            <BarChart />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
