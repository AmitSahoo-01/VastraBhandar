import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/state/auth.slice.js';
import { useWishlist } from '../features/wishlist/hook/useWishlist.js';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.items) || [];
    const wishlistItems = useSelector(state => state.wishlist.items) || [];
    const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const wishlistCount = wishlistItems.length;

    const { handleGetWishlist } = useWishlist();

    useEffect(() => {
        if (user) {
            handleGetWishlist();
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(setUser(null));
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
                boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.07)',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Brand Logo */}
            <Link
                to="/"
                style={{
                    textDecoration: 'none',
                    fontSize: '18px',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}
            >
                <span>VASTRA</span>
                <span style={{ color: '#CA2945' }}>BHANDAR</span>
            </Link>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link
                    to="/"
                    style={{
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive('/') ? 800 : 600,
                        color: isActive('/') ? '#CA2945' : '#4b5563',
                        transition: 'color 0.2s ease',
                    }}
                >
                    Home
                </Link>

                {/* Wishlist Link with Badge */}
                <Link
                    to="/wishlist"
                    style={{
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive('/wishlist') ? 800 : 600,
                        color: isActive('/wishlist') ? '#CA2945' : '#4b5563',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        position: 'relative',
                        transition: 'color 0.2s ease',
                    }}
                >
                    <svg width="16" height="16" fill={isActive('/wishlist') ? '#CA2945' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Wishlist
                    {wishlistCount > 0 && (
                        <span
                            style={{
                                background: '#CA2945',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '12px',
                                lineHeight: 1,
                                boxShadow: '0 2px 8px rgba(202, 41, 69, 0.3)',
                            }}
                        >
                            {wishlistCount}
                        </span>
                    )}
                </Link>

                {/* Cart Link with Badge */}
                <Link
                    to="/cart"
                    style={{
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: isActive('/cart') ? 800 : 600,
                        color: isActive('/cart') ? '#CA2945' : '#4b5563',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        position: 'relative',
                        transition: 'color 0.2s ease',
                    }}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Cart
                    {totalCartCount > 0 && (
                        <span
                            style={{
                                background: '#CA2945',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '12px',
                                lineHeight: 1,
                                boxShadow: '0 2px 8px rgba(202, 41, 69, 0.3)',
                            }}
                        >
                            {totalCartCount}
                        </span>
                    )}
                </Link>

                {/* Seller Portal link if seller */}
                {user?.role === 'seller' && (
                    <Link
                        to="/seller/dashboard"
                        style={{
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#CA2945',
                            background: 'rgba(202, 41, 69, 0.08)',
                            border: '1px solid rgba(202, 41, 69, 0.25)',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Seller Portal
                    </Link>
                )}
            </nav>

            {/* Auth / User Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                padding: '4px 12px 4px 6px',
                                borderRadius: '20px',
                            }}
                        >
                            <div
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: '#CA2945',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {(user?.fullname || user?.name)?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                                {user?.fullname || user?.name || 'User'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: '1px solid #e5e7eb',
                                color: '#6b7280',
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '6px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#111827',
                                padding: '7px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#ffffff',
                                background: '#CA2945',
                                padding: '7px 16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 14px rgba(202, 41, 69, 0.25)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
