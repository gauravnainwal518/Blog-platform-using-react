import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import { toast } from "react-toastify";

function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (userId && secret) {
      authService
        .confirmEmailVerification(userId, secret)
        .then(() => {
          setStatus("Email successfully verified! Redirecting to login...");
          toast.success("Email successfully verified! Redirecting to login..."); // Success toast
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch(() => {
          setStatus("Verification failed. Please try again.");
          toast.error("Verification failed. Please try again.");
        });
    } else {
      setStatus("Invalid verification link.");
      toast.error("Invalid verification link.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
}

export default Verify;
