import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login as authLogin } from "../store/authSlice";
import { setPosts } from "../store/postSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

  const login = async (data) => {
    setIsEmailNotVerified(false);
    setIsLoading(true);

    try {
      const { user, posts } = await authService.login(data);

      if (user) {
        if (!user.emailVerification) {
          setIsEmailNotVerified(true);
          await authService.sendVerificationEmail();
        } else {
          dispatch(authLogin({ userData: user }));
          dispatch(setPosts(posts));
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Login failed.");
      console.error(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authService.sendVerificationEmail();
    } catch (error) {
      console.error("Failed to resend verification email.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = prompt("Enter your email for password recovery:");
      if (!email) return;

      await authService.sendRecoveryEmail(email);
      toast.success("Reset link sent to your email. Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send reset link.");
      console.error("Failed to send password reset email.");
    }
  };

  // Demo Login Function
  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const { user, posts } = await authService.login({
        email: import.meta.env.VITE_DEMO_EMAIL,
        password: import.meta.env.VITE_DEMO_PASSWORD,
      });

      if (user && user.emailVerification) {
        dispatch(authLogin({ userData: user }));
        dispatch(setPosts(posts));
        toast.success("Logged in as Demo User!");
        navigate("/");
      } else {
        toast.error("Demo email is not verified.");
      }
    } catch (error) {
      toast.error("Demo login failed.");
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 text-gray-900 transition-all duration-300">
      <div className="w-full max-w-md rounded-xl p-10 shadow-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-3xl">
        <div className="mb-6 flex justify-center">
          <img src="/typenest.png" alt="Logo" className="w-28 h-auto" />
        </div>
        <h2 className="text-center text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-center text-sm mb-4">
          Don’t have an account?
          <Link to="/signup" className="text-purple-600 hover:underline ml-1">
            Sign Up
          </Link>
        </p>

        {isEmailNotVerified && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm text-center">
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

        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">
          <div className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/*  Demo Login Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in as Demo..." : "Use Demo Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
