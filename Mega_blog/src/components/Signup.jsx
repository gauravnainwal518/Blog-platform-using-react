import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        setError("Invalid email format");
        return;
      }

      if (data.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }

      const newUserData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (newUserData.success) {
        navigate("/login");
      } else {
        setError(newUserData.message || "Account creation failed. Try again.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-lg rounded-2xl p-10 border border-gray-300 text-gray-800 bg-white shadow-xl transition-transform hover:scale-[1.01]">
        <div className="mb-6 flex justify-center">
          <img src="/typenest.png" alt="TypeNest" className="w-24 h-auto" />
        </div>
        <h2 className="text-center text-3xl font-extrabold">
          Create your account
        </h2>
        <p className="mt-2 text-center text-base text-gray-600">
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
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="w-full text-lg py-3 bg-purple-600 text-white"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
