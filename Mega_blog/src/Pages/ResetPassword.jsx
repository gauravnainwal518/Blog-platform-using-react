import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../appwrite/auth";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(null);
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const secretFromUrl = queryParams.get("secret");
    const userIdFromUrl = queryParams.get("userId");

    if (!secretFromUrl || !userIdFromUrl) {
      setError("Invalid reset link");
    } else {
      setSecret(secretFromUrl);
      setUserId(userIdFromUrl);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !secret) {
      setError("Missing reset information");
      return;
    }

    setLoading(true);
    try {
      await authService.confirmRecovery(userId, secret, password);
      toast.success("Password reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error("Password reset failed. Please try again.");
      setError("Password reset failed. Please try again.");
      console.error("Error resetting password", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:border-purple-500 bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
