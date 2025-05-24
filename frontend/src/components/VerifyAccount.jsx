import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";

function VerifyAccount() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

  // useEffect(() => {
  //   if (token) {
  //     axios.get(`/register/employer/business/verify?token=${token}`)
  //       .then(res => {
  //         // Show success message or redirect
  //         console.log(token);
          
  //       })
  //       .catch(err => {
  //         // Show error message
  //         console.log(err);
          
  //       });
  //   }
  // }, [token]);

  return (
    <div className="bg-gray-400 flex flex-col items-center justify-center h-screen">

      <div className="flex flex-col items-center justify-center h-40 rounded w-2xl bg-blue-300 shadow-lg">
        <p> Your account has been created successfully. Please check your email to verify your account.</p>
        <BackButton className="bg-blue-500 text-white p-5 rounded mt-3 cursor-pointer"/>
      </div>
      
    </div>
  );
}

export default VerifyAccount;