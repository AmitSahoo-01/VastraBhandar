# Vastra Bhandar — Frontend Application

**Vastra Bhandar** is a modern, high-performance luxury clothing e-commerce web application frontend built with **React 19**, **Vite 7**, **Redux Toolkit**, **React Router v7**, and **Tailwind CSS v4**.

It provides a rich, responsive user experience for customers to explore fashion collections, manage cart and wishlist items, and interact with a full-featured seller management portal.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Interactive Hero Carousel**: Auto-sliding 3D-styled image carousel featuring drag, swipe, wheel touchpad gesture support, and seamless no-blink crossfading transitions.
- **Editorial Fashion Story Section**: Interactive stacked card showcase with progress tracking for editorial fashion features.
- **Product Catalog & Dynamic Variants**: Full support for single & multi-variant products (Colors, Sizes, Custom Attributes) with dynamic price, image, and stock resolution.
- **Wishlist Integration**: Real-time wishlist toggling with live badge counters on the navbar.
- **Shopping Cart System**: Real-time cart updating, quantity modification, price subtotals, and checkout preparation.
- **Sticky Glassmorphism Navbar**: Dynamic scroll-responsive header with backdrop blur, multi-layered ambient drop shadow, and a subtle glowing crimson bottom gradient edge.

### 👔 Seller Portal
- **Seller Dashboard**: Comprehensive inventory management overview displaying all created products, variant breakdown, stock levels, and quick management links.
- **Multi-Variant Product Creator**: Advanced product creation suite supporting single-variant and multi-variant matrix configurations (multiple colors, sizes, attributes, images, stock, and pricing).
- **Seller Product Inspector**: Detailed view for sellers to inspect product variants, attribute trees, and inventory status.

### 🔒 Authentication & Role Security
- **JWT Auth & Session Management**: Secure user authentication with cookie-based session checking (`getMe`).
- **Role-Based Protected Routes**: Route wrapper (`Protected.jsx`) enforcing authorization for authenticated users and specific roles (`seller` vs `customer`).

---

## 📁 Complete File Structure

```
frontend/
├── public/                     # Static assets (background images, logos, favicons)
│   └── background.png
├── src/                        # Main source code directory
│   ├── app/                    # Core application setup & routing
│   │   ├── App.css             # Global styles, typography, scrollbars & Tailwind imports
│   │   ├── App.jsx             # Main App root component & router provider
│   │   ├── app.routes.jsx      # React Router v7 route definitions & layout structure
│   │   └── app.store.js        # Central Redux Toolkit store configuration
│   │
│   ├── components/             # Shared layout components
│   │   ├── Footer.jsx          # Multi-column luxury footer with newsletter & brand links
│   │   ├── MainLayout.jsx      # Primary route layout wrapper (Navbar + Outlet + Footer)
│   │   └── Navbar.jsx          # Sticky glassmorphic navbar with badge counters & bottom effect
│   │
│   ├── features/               # Domain-driven feature modules
│   │   ├── auth/               # User Authentication & Security
│   │   │   ├── component/
│   │   │   │   └── Protected.jsx   # Role-based route protection guard
│   │   │   ├── hook/
│   │   │   │   └── useAuth.js      # Custom hook for login, register, logout & user state
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx       # Customer & Seller login page with custom UI
│   │   │   │   └── Register.jsx    # User registration page with role selection
│   │   │   ├── services/
│   │   │   │   └── auth.api.js     # Axios API service endpoints for authentication
│   │   │   └── state/
│   │   │       └── auth.slice.js   # Redux slice for user auth state
│   │   │
│   │   ├── cart/               # Cart Management Feature
│   │   │   ├── hook/
│   │   │   │   └── useCart.js      # Hook for fetching, adding, updating & deleting cart items
│   │   │   ├── pages/
│   │   │   │   └── Cart.jsx        # Shopping cart details & summary view
│   │   │   ├── service/
│   │   │   │   └── cart.api.js     # Axios API services for cart management
│   │   │   └── state/
│   │   │       └── cart.slice.js   # Redux slice for cart items state
│   │   │
│   │   ├── product/            # Product Catalog & Seller Management
│   │   │   ├── components/
│   │   │   │   └── ProductCard.jsx # Reusable product card component with wishlist & cart actions
│   │   │   ├── hook/
│   │   │   │   └── useProduct.js   # Hook for product fetching & creation operations
│   │   │   ├── pages/
│   │   │   │   ├── CreateProduct.jsx     # Seller multi-variant product creation suite
│   │   │   │   ├── Dashboard.jsx         # Seller product inventory dashboard
│   │   │   │   ├── Home.jsx              # Landing page with hero carousel & featured products
│   │   │   │   ├── ProductDetail.jsx     # Detailed product view with attribute matrix selector
│   │   │   │   └── SellerDetailedPage.jsx # Seller detailed product inspection page
│   │   │   ├── services/
│   │   │   │   └── product.api.js  # Axios API services for product CRUD operations
│   │   │   └── state/
│   │   │       └── product.slice.js # Redux slice for product state
│   │   │
│   │   └── wishlist/           # Wishlist Management Feature
│   │       ├── hook/
│   │       │   └── useWishlist.js  # Hook for fetching & toggling wishlist items
│   │       ├── pages/
│   │       │   └── Wishlist.jsx    # Wishlist collection page
│   │       ├── service/
│   │       │   └── wishlist.api.js # Axios API services for wishlist endpoints
│   │       └── state/
│   │           └── wishlist.slice.js # Redux slice for wishlist state
│   │
│   └── main.jsx                # Application entry point (ReactDOM mount)
│
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry template
├── package.json                # Project dependencies & scripts
├── README.md                   # Project documentation
└── vite.config.js              # Vite & Tailwind CSS build configuration
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | User interface component architecture |
| **Vite 7** | Lightning-fast frontend build tool & development server |
| **Redux Toolkit 2** | Centralized predictable state management |
| **React Router DOM 7** | Dynamic client-side routing & route guards |
| **Tailwind CSS v4** | Utility-first styling & custom CSS design tokens |
| **Axios** | HTTP client for backend REST API integration |
| **Sonner** | Toast notifications for user feedback |

---

## 🚦 Application Routes Overview

| Path | Component | Protected | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Home.jsx` | No | Main storefront with hero carousel, editorial story & featured collection |
| `/product/:productId` | `ProductDetail.jsx` | No | Detailed product overview with interactive variant selection |
| `/cart` | `Cart.jsx` | Yes | Shopping cart item list & subtotal calculations |
| `/wishlist` | `Wishlist.jsx` | Yes | User saved wishlist collection |
| `/login` | `Login.jsx` | No | User login portal |
| `/register` | `Register.jsx` | No | User registration page |
| `/seller/dashboard` | `Dashboard.jsx` | Yes (Seller) | Seller inventory management panel |
| `/seller/create` | `CreateProduct.jsx` | Yes (Seller) | Form & matrix builder to publish new products |
| `/seller/product/:productId` | `SellerDetailedPage.jsx` | Yes (Seller) | Detailed seller inspection view of published product |

---

## 💻 State Management & API Architecture

The application uses a **Feature-Driven Architecture**:
1. **API Layer (`*.api.js`)**: Encapsulates raw Axios HTTP requests with base configuration (`withCredentials: true`).
2. **Redux Slices (`*.slice.js`)**: Manages normalized state for `auth`, `product`, `cart`, and `wishlist`.
3. **Custom Hooks (`use*.js`)**: Connects components to Redux state and dispatches API actions effortlessly.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server
Start the Vite development server:
```bash
npm run dev
```

### Production Build
Build the production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```