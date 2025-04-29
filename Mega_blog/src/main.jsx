import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import { AuthLayout, Login } from "./components/index.js";

import AddPost from "./Pages/AddPost.jsx";
import Signup from "./Pages/Signup.jsx";
import EditPost from "./Pages/EditPost.jsx";
import Post from "./Pages/Post.jsx";
import AllPosts from "./Pages/AllPosts";
import AiSearch from "./Pages/aisearch.jsx";

import Verify from "./Pages/Verify.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      {
        path: "/ai-search",
        element: (
          <AuthLayout authentication>
            <AiSearch />
          </AuthLayout>
        ),
      },
      {
        path: "/verify",
        element: <Verify />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <>
        <RouterProvider router={router} />
        <ToastContainer position="top-center" autoClose={3000} />
      </>
    </Provider>
  </React.StrictMode>
);
