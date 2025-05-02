import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import {jwtDecode} from "jwt-decode";
import {api} from './Components/Api/Data'


import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute'; 
import { useAuth } from './Components/AuthContext';

import Dashboard from './Components/Dashboard';
import Plots from './Components/Plots'
import Shop from './Components/Shop'



const router = createBrowserRouter([
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
    path: "/",
    element: (
      <PrivateRoute>
        <div className='container'>
          <Navbar />
          <Dashboard />
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
    path: '/plots',
    element : (
      <PrivateRoute>
        <div className='container'>
          <Navbar/>
          <Plots/>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: '/shop',
    element : (
      <PrivateRoute>
        <div className='container'>
          <Navbar/>
          <Shop/>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: "*", 
    element: <h1>404-Page Not Found</h1>,
  },

]);

export default function App() {

  const {token, user, setUser, setUserInfo} = useAuth();

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
  
  useEffect(()=>{
    if(user && token){
        async function fetch(){ 
          const response = await api.post('/user-info',user, {headers: {Authorization: `Bearer ${token}`}});
          setUserInfo(response.data);
        }
        fetch();            
    }
  },[user, token])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}



