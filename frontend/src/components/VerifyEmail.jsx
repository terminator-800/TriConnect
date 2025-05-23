import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      axios.get(`/register/employer/business/verify?token=${token}`)
        .then(res => {
          // Show success message or redirect
          console.log(token);
          
        })
        .catch(err => {
          // Show error message
          console.log(err);
          
        });
    }
  }, [token]);

  return (
    <div>
      Verifying your email...
    </div>
  );
}

export default VerifyEmail;