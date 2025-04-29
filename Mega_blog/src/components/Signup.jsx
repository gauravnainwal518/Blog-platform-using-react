import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const create = async (data) => {
    setError("");
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Invalid email format");
        return;
      }

      if (data.password.length < 8) {
        toast.error("Password is too short. Minimum length is 8 characters.");
        return;
      }

      const newUserData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (newUserData.success) {
        toast.success(newUserData.message || "Account created successfully!");
        navigate("/login");
      } else {
        toast.error(
          newUserData.message || "Account creation failed. Try again."
        );
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <ToastContainer />
      <div
        className={`w-full max-w-lg rounded-2xl p-10 border shadow-xl transition-transform hover:scale-[1.01] ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-800"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <img src="/typenest.png" alt="TypeNest" className="w-24 h-auto" />
        </div>
        <h2
          className={`text-center text-3xl font-extrabold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Create your account
        </h2>
        <p
          className={`mt-2 text-center text-base ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && (
          <p className="text-red-600 mt-6 text-center text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("name", { required: "Full name is required" })}
            className={`rounded-md border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
            }`}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Enter a valid email address",
              },
            })}
            className={`rounded-md border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
            }`}
          />
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
            className={`rounded-md border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
            }`}
          />
          <Button
            type="submit"
            className={`w-full text-lg py-3 ${
              isDarkMode
                ? "bg-purple-600 text-white"
                : "bg-purple-600 text-white"
            }`}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
