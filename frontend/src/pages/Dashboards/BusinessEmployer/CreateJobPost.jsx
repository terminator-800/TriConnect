import { useState } from "react";
import axios from "axios";

const CreateJobPost = () => {
  const [job_title, setJobTitle] = useState("");
  const [job_type, setJobType] = useState("");
  const [salary_range, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [required_skill, setRequiredSkill] = useState("");
  const [job_description, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToReview, setAgreeToReview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    const data = {
      job_title,
      job_type,
      salary_range,
      location,
      required_skill,
      job_description
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/job-post",
        data,
        {
          withCredentials: true, // Include cookies in the request
          headers: {
            'Content-Type': 'application/json' // ✅ This tells the server to expect JSON
          }
        }
      );

      if (response.status === 201) {
        console.log("this is line 38: ", data)
        alert("Job post created successfully!");
        // Reset form fields
        setJobTitle("");
        setJobType("");
        setSalaryRange("");
        setLocation("");
        setRequiredSkill("");
        setJobDescription("");
        setAgreeToReview(false)
      }

    } catch (error) {
      console.error("Error creating job post:", error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <div className="pl-60 pr-60 pt-20">
      <h1 className="text-5xl font-bold text-blue-900">Create Job Post</h1>
      <p className="text-2xl mt-2">Fill out the form below to post a new job vacancy</p>

      <div className="w-full bg-white p-15 rounded mt-15">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="job_title" className="block text-lg font-medium">Job Title</label>
            <input
              id="job_title"
              type="text"
              className="border border-gray-300 rounded p-2 w-full outline-none"
              placeholder="Enter the job title"
              value={job_title}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="job_type" className="font-medium">Job Type</label>
            <select
              name="job_type"
              id="job_type"
              className="outline-none border border-gray-300 rounded py-2 px-2"
              value={job_type}
              onChange={(e) => setJobType(e.target.value)}
              required
            >
              <option value="">Select Job Type</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="salary_range" className="font-medium">Salary Range</label>
            <input
              type="text"
              placeholder="Min - Max (PHP)"
              className="border border-gray-300 outline-none w-1/2 px-2 py-2 rounded"
              value={salary_range}
              onChange={(e) => setSalaryRange(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="location" className="font-medium">Location</label>
            <input
              type="text"
              className="border border-gray-300 outline-none w-1/2 px-2 py-2 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 flex flex-col">
            <label htmlFor="required_skill" className="font-medium">Required Skill</label>
            <input
              type="text"
              placeholder="e.g., Carpentry, Driving, MS Office"
              className="p-2 outline-none rounded border border-gray-300"
              value={required_skill}
              onChange={(e) => setRequiredSkill(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="job_description" className="font-medium">Job Description</label>
            <textarea
              id="job_description"
              className="border border-gray-300 rounded p-2 w-full h-32 outline-none"
              placeholder="Provide a detailed and clear description of the job you are offering."
              value={job_description}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex mb-10">
            <input
              type="checkbox"
              className="mr-3"
              checked={agreeToReview}
              onChange={(e) => setAgreeToReview(e.target.checked)}
            />
            <p>By selecting <strong>Confirm</strong>, you agree that this job post will be reviewed by the system administrator. You will be notified once the job post is verified.</p>
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white rounded-xl px-10 shadow-md py-2 text-2xl cursor-pointer"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Submitting..." : "Confirm"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateJobPost;