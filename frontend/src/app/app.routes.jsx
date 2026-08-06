import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/product/pages/Dashboard.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";
import Protected from "../features/auth/component/Protected.jsx";
import Home from "../features/product/pages/Home.jsx";
import ProductDetail from "../features/product/pages/ProductDetail.jsx";
import SellerDetailedPage from "../features/product/pages/SellerDetailedPage.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import Wishlist from "../features/wishlist/pages/Wishlist.jsx";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "product/:productId",
                element: <ProductDetail />
            },
            {
                path: "cart",
                element: <Protected><Cart /></Protected>
            },
            {
                path: "wishlist",
                element: <Protected><Wishlist /></Protected>
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "seller/dashboard",
        element: <Protected role="seller"><Dashboard /></Protected>
    },
    {
        path: "seller/create",
        element: <Protected role="seller"><CreateProduct /></Protected>
    },
    {
        path: "seller/product/:productId",
        element: <Protected role="seller"><SellerDetailedPage /></Protected>
    }
]);