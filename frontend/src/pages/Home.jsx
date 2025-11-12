import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import icons from "../assets/svg/Icons";

const Home = () => {
  return (
    <div className="">
      <Navbar userType={"guest"} />

      <section className="text-center">
        <div
          className="justify-center items-center 
                  xl:mt-40 lg:mt-30 md:mt-20 sm:mt-30 mb-20 px-4 sm:px-8 md:px-10
                  max-[720px]:mt-20
                  "
        >
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Connect Smarter With <br />
            <span className="text-[#003479]">TriConnect</span>
          </h1>

          <p className="mt-5 text-gray-600 mb-10 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
            An all-in-one job-matching platform that connects job seekers,
            employers, and manpower providers — designed to simplify your job
            search and hiring process with a clean, easy-to-use experience.
          </p>

          <Link
            to="/register"
            className="bg-gray-100 text-gray-500 text-lg sm:text-xl md:text-2xl 
                 px-6 sm:px-10 md:px-15 py-2 rounded-3xl cursor-pointer shadow-lg inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section
        className="
      bg-cyan-200 
      xl:pt-20 
      xl:pb-20
      xl:px-
      lg:px-20
      lg:py-15
      md:px-15
      md:py-10
      max-[769px]:px-10
      max-[769px]:py-10
      "
      >
        <div className="border-l-10 border-[#003479] xl:pl-5 lg:pl-5 md:pl-5 max-[769px]:pl-5">
          <h3 className="text-3xl">About Us</h3>
          <h1 className="font-bold text-3xl">
            WE BUILD CONNECTIONS <br /> THAT MATTER
          </h1>
        </div>
        <p className="mt-15 text-[#666666]">
          <span className="text-[#003479] font-bold">TriConnect</span> is built
          on the mission of bridging the gap between job seekers, employers, and
          manpower agencies. <br />
          Whether you're looking to hire, find work, or expand your recruitment
          reach, TriConnect provides a streamlined platform tailored to your
          needs.
        </p>
        <p className="mt-5 text-[#666666]">
          From posting jobs to finding the right match — we make the process
          efficient, reliable, and user-friendly.
        </p>
      </section>

      {/* WHY CHOOSE TRICONNECT */}
      <section id="how_it_works" className="mt-30">
        <h1 className="text-3xl font-bold text-center">
          WHY CHOOSE <span className="text-[#003479]">TriConnect</span>{" "}
        </h1>
        <p className="text-lg text-gray-600 mt-5 text-center">
          Our platform offers a comprehensive suite of features designed to
          streamline <br />
          the hiring process and improve access to job opportunities for all.
        </p>

        <div className="flex flex-wrap justify-center xl:gap-100 lg:gap-10 sm:gap-10 max-[769px]:gap-15 mt-20 mb-20 lg:px-15 md:px-10 sm: max-[796px]:px-5">
          {/* Column 1 */}
          <div className="flex flex-col w-full xl:w-[20%] gap-8">
            <div className="flex flex-col w-full gap-8">
              <div className="flex items-start gap-4">
                <img
                  src={icons.all_in_one_platform}
                  alt="all in one platform"
                  className="w-10 h-10 shrink-0"
                />

                <div>
                  <h1 className="text-lg font-semibold">All-in-One Platform</h1>
                  <p className="text-gray-700 mt-2">
                    TriConnect connects job seekers, employers, and manpower
                    agencies in one seamless system — making the hiring and
                    job-finding process faster and more convenient.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-8">
              <div className="flex items-start gap-4">
                <img
                  src={icons.user_friendly_interface}
                  alt="user friendly interface"
                  className="w-10 h-10 shrink-0"
                />

                <div>
                  <h1 className="text-lg font-semibold">All-in-One Platform</h1>
                  <p className="text-gray-700 mt-2">
                    Designed with simplicity in mind, TriConnect makes it easy
                    for anyone to post jobs, apply, and connect — even for
                    first-time users.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col w-full xl:w-[20%] gap-20">
            <div className="flex flex-col w-full gap-8">
              <div className="flex items-start gap-4">
                <img
                  src={icons.custom_tools_for_everyone}
                  alt="custom tools for everyone"
                  className="w-10 h-10 shrink-0"
                />

                <div>
                  <h1 className="text-lg font-semibold">All-in-One Platform</h1>
                  <p className="text-gray-700 mt-2">
                    All users undergo a verification process to ensure safety
                    and trust within the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-8">
              <div className="flex items-start gap-4">
                <img
                  src={icons.secure_reliable}
                  alt="secure and reliable"
                  className="w-10 h-10 shrink-0"
                />

                <div>
                  <h1 className="text-lg font-semibold">All-in-One Platform</h1>
                  <p className="text-gray-700 mt-2">
                    All users undergo a verification process to ensure safety
                    and trust within the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STARTER / PREMIUM */}
      <section>
        <div
          className="flex flex-col rounded-full justify-center items-center text-center
        xl:h-[70vh] 
        lg:h-[70vh] 
        md:h-[70vh] 
        sm:h-[70vh]
        max-[769px]:h-screen
        max-[769px]:bg-[radial-gradient(circle_at_50%_50%,var(--color-cyan-200)_0%,transparent_80%)]
        2xl:bg-[radial-gradient(circle_at_50%_20%,var(--color-cyan-200)_0%,transparent_50%)]
        xl:bg-[radial-gradient(circle_at_50%_40%,var(--color-cyan-200)_0%,transparent_60%)]
        lg:bg-[radial-gradient(circle_at_50%_40%,var(--color-cyan-200)_0%,transparent_60%)]
        md:bg-[radial-gradient(circle_at_50%_40%,var(--color-cyan-200)_0%,transparent_60%)]
        sm:bg-[radial-gradient(circle_at_50%_40%,var(--color-cyan-200)_0%,transparent_60%)]"
        >
          <h1 className="font-bold text-xl">Title</h1>

          <div
            className="flex 
          xl:gap-50 
          lg:gap-40 
          md:gap-30 
          sm:gap-20 
          mt-20
          max-[641px]:flex-col
          max-[769px]:gap-5
          "
          >
            {/* CARD 1 */}
            <div className="w-70 bg-white rounded-lg text-left px-10 py-5 shadow-[4px_4px_10px_rgba(0,0,0,0.15)]">
              <h1 className="font-semibold my-2">Starter</h1>
              <h1 className="text-[#5ED1D6] text-2xl">₱0 /month</h1>
              <h1 className="my-2 text-[#666666]">Features Included</h1>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>

              <button className="mx-auto block rounded-xl bg-[#EFF2F9] text-[#666666] px-15 py-1 mt-5 cursor-pointer shadow-[4px_4px_10px_rgba(0,0,0,0.15)]">
                Join Now
              </button>
            </div>

            {/* CARD 2 */}
            <div className="w-70 bg-white rounded-lg text-left px-10 py-5 shadow-[4px_4px_10px_rgba(0,0,0,0.15)]">
              <h1 className="font-semibold my-2">Premium</h1>
              <h1 className=" my-2 text-[#5ED1D6] text-2xl">₱0 /month</h1>
              <h1 className="my-2 text-[#666666]">Features Included</h1>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <div className="flex">
                <img src={icons.check} alt="" />
                <span className="text-[#666666]">text</span>
              </div>
              <button className="mx-auto block rounded-xl bg-[#EFF2F9] text-[#666666] px-6 py-2 mt-5 cursor-pointer shadow-[4px_4px_10px_rgba(0,0,0,0.15)] whitespace-nowrap text-center">
                Upgrade Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cyan-100 py-16 px-8 md:px-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          HOW IT WORKS
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white w-14 h-14 rounded-xl flex justify-center items-center shadow-md">
              <h1 className="text-[#003479] font-bold text-lg">1</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Register & Verify
            </h2>
            <p className="text-[#666666] text-sm leading-relaxed max-w-[220px]">
              Create an account as a job seeker, employer, or agency and wait
              for the verification.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white w-14 h-14 rounded-xl flex justify-center items-center shadow-md">
              <h1 className="text-[#003479] font-bold text-lg">2</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Create Profile
            </h2>
            <p className="text-[#666666] text-sm leading-relaxed max-w-[220px]">
              Build your profile with relevant information, skills, job needs,
              or agency services.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white w-14 h-14 rounded-xl flex justify-center items-center shadow-md">
              <h1 className="text-[#003479] font-bold text-lg">3</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Connect</h2>
            <p className="text-[#666666] text-sm leading-relaxed max-w-[220px]">
              Browse jobs, post opportunities, or facilitate connections between
              employers and job seekers.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white w-14 h-14 rounded-xl flex justify-center items-center shadow-md">
              <h1 className="text-[#003479] font-bold text-lg">4</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Communicate</h2>
            <p className="text-[#666666] text-sm leading-relaxed max-w-[220px]">
              Use our secure messaging system to discuss details and finalize
              arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="xl:mx-50 lg:mx-15 md:mx-10 sm:mx-10 mb-50">
        {/* Header Section */}
        <div className="bg-white text-center flex flex-col justify-center items-center mt-60 mb-20">
          <h1 className="text-5xl max-[769px]:text-3xl font-bold mb-5 text-[#003479] ">
            What Our Users Say
          </h1>
          <p className="text-lg text-[#666666]">
            Hear from our users about how TriConnect has helped them find jobs
            and talent.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-row justify-center items-stretch gap-6 max-[769px]:flex-col max-[769px]:mx-20 sm:mx-10">
          {/* Card 1 */}
          <div className="basis-1/3 m-5 drop-shadow-xl shadow-xl rounded-2xl flex flex-col items-center justify-between text-center p-6 h-[380px]">
            <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center font-bold">
              LM
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600">Jobseeker</p>
            </div>
            <p className="text-gray-600 italic mt-3 max-w-md text-left underline">
              "As a freelancer looking for short-term construction jobs,
              TriConnect has been a game-changer. I no longer have to rely on
              word-of-mouth to find work opportunities."
            </p>
            <h1 className="font-bold mt-2 text-[#003479]">Lanlyn Mongado</h1>
          </div>

          {/* Card 2 */}
          <div className="basis-1/3 m-5 drop-shadow-xl shadow-xl rounded-2xl flex flex-col items-center justify-between text-center p-6 h-[380px]">
            <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center font-bold">
              SF
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600">Employer</p>
            </div>
            <p className="text-gray-600 italic mt-3 max-w-md text-left underline">
              "Finding qualified workers for our small business used to be a
              challenge. With TriConnect, we can quickly post jobs and connect
              with potential candidates or agencies."
            </p>
            <h1 className="font-bold mt-2 text-[#003479]">Samantha Ferrer</h1>
          </div>

          {/* Card 3 */}
          <div className="basis-1/3 m-5 drop-shadow-xl shadow-xl rounded-2xl flex flex-col items-center justify-between text-center p-6 h-[380px]">
            <div className="bg-gray-300 w-16 h-16 rounded-full text-blue-900 flex justify-center items-center font-bold">
              DM
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600">Manpower Provider</p>
            </div>
            <p className="text-gray-600 italic mt-3 max-w-md text-left underline">
              "Our manpower agency has expanded our client base significantly
              since joining TriConnect. The platform makes it easy to connect
              job seekers with employers efficiently."
            </p>
            <h1 className="font-bold mt-2 text-[#003479]">
              Dennese Keith Membrano
            </h1>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
