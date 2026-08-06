import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWishlist } from '../hook/useWishlist.js';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../product/components/ProductCard.jsx';

const Wishlist = () => {
    const { wishlistItems, handleGetWishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetWishlist();
    }, []);

    // Filter valid product objects
    const products = wishlistItems.filter((item) => typeof item === 'object' && item !== null);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#ffffff', minHeight: '80vh', padding: '60px 40px 100px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{ color: '#CA2945', fontSize: '11px', letterSpacing: '4px', fontWeight: 700, margin: '0 0 10px' }}>
                        YOUR SAVED FAVORITES
                    </p>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
                        MY WISHLIST
                    </h1>
                </div>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fafafa', borderRadius: '24px', border: '1px solid #f0f0f0' }}>
                        <div style={{
                            width: '70px', height: '70px', borderRadius: '50%', background: '#fff0f2', color: '#CA2945',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                        }}>
                            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#18181b', margin: '0 0 8px' }}>Your wishlist is empty</h2>
                        <p style={{ color: '#71717a', fontSize: '14px', margin: '0 0 24px' }}>Explore our collection and save items you love!</p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: '#18181b', color: '#ffffff', border: 'none', padding: '12px 28px',
                                borderRadius: '30px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#CA2945'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#18181b'; }}
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '28px',
                    }}>
                        {products.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
