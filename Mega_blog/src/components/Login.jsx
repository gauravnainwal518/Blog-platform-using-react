import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { setPosts } from "../store/postSlice";
import { Button, Input } from "./index"; // Removed Logo import
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/config";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();

        dispatch(setPosts([])); // Clear previous posts
        const posts = await appwriteService.fetchUserPosts(userData.$id);

        if (userData) {
          dispatch(authLogin({ userData }));
          dispatch(setPosts(posts));
        }
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white rounded-xl p-10 shadow-2xl border border-gray-300 transform transition-all hover:scale-105 hover:shadow-3xl">
        <div className="mb-6 flex justify-center">
          <img
            src="/typenest.jpg" //
            alt="Logo"
            className="w-28 h-auto"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-4">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mt-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-6">
          <div className="space-y-4">
            <Input
              label="Email:"
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
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
            />
            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
