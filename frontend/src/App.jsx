import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'


import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        {/* <Home /> */}
      </>
    ),
    /* children: [{
        path:'courses',
        element:  
        },
        {
        path:'tests',
        element: 
        }
    ]*/ // we can create these nested paths as well note : dont use '/' in paths of childrens // also use <Outlet/> in your Home component
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: 'student/:id',
    element: 
      <>
        <Navbar />
       {/*  <ParamComp /> */}
      </>
  },
  {
    path: "*", 
    element: <h1>404-Page Not Found</h1>,
  },

]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}



