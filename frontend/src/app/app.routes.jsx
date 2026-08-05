import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/product/pages/Dashboard.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";
import Protected from "../features/auth/component/Protected.jsx";
import Home from "../features/product/pages/Home.jsx";
import ProductDetail from "../features/product/pages/ProductDetail.jsx";
import SellerDetailedPage from "../features/product/pages/SellerDetailedPage.jsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    }, {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/product/:productId",
        element: <ProductDetail />
    },
    {
        path: "seller/dashboard",
        element: <Protected role="seller" ><Dashboard /></Protected>
    },
    {
        path: "seller/create",
        element: <Protected role="seller" ><CreateProduct /></Protected>
    }, {
        path: "seller/product/:productId",
        element: <Protected role="seller" ><SellerDetailedPage /></Protected>
    }
])