import React from 'react'
import "./App.css";
import { RouterProvider } from 'react-router-dom';
import {routes} from './app.routes.jsx';
import { useSelector } from 'react-redux';


const App = () => {

   const user = useSelector(state => state.auth.user);
    
  console.log(user);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App