import {createBrowserRouter} from "react-router-dom";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/product/pages/Dashboard.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";


export const routes = createBrowserRouter([
    {
        path:"/",
        element: <h1 className="text-red-500">Home Page</h1>
    },{
        path:"/login",
        element: <Login/>
    },
    {
        path:"/register",
        element: <Register/>
    },
    {
        path:"seller/dashboard",
        element: <Dashboard/>
    },
    { 
        path:"seller/create",
        element: <CreateProduct/>
    }
])