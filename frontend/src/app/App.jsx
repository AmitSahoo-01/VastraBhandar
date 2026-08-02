import React from 'react'
import "./App.css";
import { RouterProvider } from 'react-router-dom';
import {routes} from './app.routes.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from '../features/auth/hook/useAuth.js';


const App = () => {

   const user = useSelector(state => state.auth.user);
   const {handleGetMe} = useAuth();
   
   useEffect(() => {
    handleGetMe();
   },[]);
   
    
  console.log(user);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App