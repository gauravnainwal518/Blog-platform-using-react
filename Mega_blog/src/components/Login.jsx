import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index";
import { useDispatch, useSelector } from "react-redux";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";
import { setPosts } from "../store/postSlice";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const login = async (data) => {
    setIsEmailNotVerified(false);
    setIsLoading(true);

    try {
      const { user, posts } = await authService.login(data);

      if (user) {
        if (!user.emailVerification) {
          setIsEmailNotVerified(true);
          await authService.sendVerificationEmail();
          toast.info("Verification email sent. Please check your inbox.");
        } else {
          dispatch(authLogin({ userData: user }));
          dispatch(setPosts(posts));
          toast.success("Logged in successfully!");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      toast.info("Sending verification email...");
      await authService.sendVerificationEmail();
      toast.success("Verification email resent successfully!");
    } catch (error) {
      toast.error("Failed to resend verification email.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = prompt("Please enter your email for password recovery:");
      if (!email) return;

      await authService.sendRecoveryEmail(email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl p-10 shadow-2xl border transition-all hover:scale-105 hover:shadow-3xl ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-800"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <img src="/typenest.png" alt="Logo" className="w-28 h-auto" />
        </div>
        <h2
          className={`text-center text-3xl font-extrabold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Sign in to your account
        </h2>
        <p
          className={`mt-2 text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

        {/* Email not verified message */}
        {isEmailNotVerified && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mt-4 text-center">
            Your email is not verified. Please check your inbox.
            <div className="mt-2">
              <Button
                onClick={handleResendVerification}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-6">
          <div className="space-y-4">
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`p-4 rounded-lg border-2 focus:outline-none focus:border-purple-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`p-4 rounded-lg border-2 focus:outline-none focus:border-purple-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Button
              type="submit"
              className="w-full text-lg py-3 bg-purple-600 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-purple-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
