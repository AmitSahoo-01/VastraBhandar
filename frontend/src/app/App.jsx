import React from 'react'
import "./App.css";
import { RouterProvider } from 'react-router-dom';
import {routes} from './app.routes.jsx';
import { Provider } from 'react-redux';
  import { store } from './app.store.js';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </>
  )
}

export default App