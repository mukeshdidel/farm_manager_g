import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import {jwtDecode} from "jwt-decode";


import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute'; 
import { useAuth } from './Components/AuthContext';

import Home from './Components/Home'


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <div className='container'>
          <Navbar />
          <Home />
        </div>
      </PrivateRoute>


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
      <PublicRoute>
        <div className='login-container'>
          <Navbar />
          <Login />
        </div>
      </PublicRoute>

    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <div className='login-container'>
          <Navbar />
          <Signup />
        </div>
      </PublicRoute>

    ),
  },
  {
    path: "*", 
    element: <h1>404-Page Not Found</h1>,
  },

]);

export default function App() {

  const {setUser} = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const user = jwtDecode(token);
        setUser(user); 
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("auth_token");
      }
    }
  }, []);
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}



