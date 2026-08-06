import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../wishlist/hook/useWishlist.js';
import { useCart } from '../../cart/hook/useCart.js';

// Currency symbol helper
const currencySymbol = (code) => ({ USD: '$', EUR: '€', GBP: '£', IDR: 'Rp ' }[code] ?? '₹ ');

const ProductCard = ({ product, index = 0 }) => {
    const navigate = useNavigate();
    const { isWishlisted, handleToggleWishlist } = useWishlist();
    const { handleAddItem } = useCart();
    
    const [addingToCart, setAddingToCart] = useState(false);

    const { title, description, price, images, isNew } = product;
    const imgSrc = images?.[0]?.url;
    const sym = currencySymbol(price?.currency);
    const wishlisted = isWishlisted(product?._id);

    const onWishlistClick = (e) => {
        e.stopPropagation();
        handleToggleWishlist(product._id);
    };

    const onAddToCartClick = async (e) => {
        e.stopPropagation();
        setAddingToCart(true);
        try {
            await handleAddItem({ productId: product._id, quantity: 1 });
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div
            className="vb-ref-product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '12px 12px 20px 12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                animation: 'fadeUp 0.55s ease both',
                animationDelay: `${Math.min(index * 0.08, 0.6)}s`,
                userSelect: 'none',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.09)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
            }}
        >
            {/* Top Image Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4/4.8',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: '#f3f3f3',
                }}
            >
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={title}
                        loading="lazy"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="36" height="36" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                )}

                {/* Top-Left Badge (e.g. New) */}
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#f3f0e9',
                        color: '#2b2927',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '5px 14px',
                        borderRadius: '20px',
                        letterSpacing: '0.2px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        pointerEvents: 'none',
                    }}
                >
                    {isNew !== false ? 'New' : 'Featured'}
                </div>

                {/* Top-Right Heart Button Overlay */}
                <button
                    onClick={onWishlistClick}
                    aria-label="Wishlist"
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s',
                        color: wishlisted ? '#CA2945' : '#111827',
                        outline: 'none',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <svg
                        width="18"
                        height="18"
                        fill={wishlisted ? '#CA2945' : 'none'}
                        stroke={wishlisted ? '#CA2945' : 'currentColor'}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            </div>

            {/* Bottom Details Section */}
            <div style={{ padding: '16px 8px 4px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Title */}
                <h3
                    style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: '0 0 6px',
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {title}
                </h3>

                {/* Subtitle / Description */}
                <p
                    style={{
                        fontSize: '12.5px',
                        color: '#8e8e93',
                        margin: '0 0 16px',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '36px',
                    }}
                >
                    {description || 'Silk and linen blend polo shirt with stripes that fits slim'}
                </p>

                {/* Price & Circular Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
                        {sym}{(price?.amount || 0).toLocaleString('en-IN')}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Circle 1: Heart */}
                        <button
                            onClick={onWishlistClick}
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                border: `1px solid ${wishlisted ? '#CA2945' : '#e4e4e7'}`,
                                background: wishlisted ? 'rgba(202, 41, 69, 0.06)' : '#ffffff',
                                color: wishlisted ? '#CA2945' : '#3f3f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#CA2945';
                                e.currentTarget.style.color = '#CA2945';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = wishlisted ? '#CA2945' : '#e4e4e7';
                                e.currentTarget.style.color = wishlisted ? '#CA2945' : '#3f3f46';
                            }}
                        >
                            <svg width="17" height="17" fill={wishlisted ? '#CA2945' : 'none'} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>

                        {/* Circle 2: Shopping Bag */}
                        <button
                            onClick={onAddToCartClick}
                            disabled={addingToCart}
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                border: '1px solid #e4e4e7',
                                background: '#ffffff',
                                color: '#3f3f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#111827';
                                e.currentTarget.style.color = '#111827';
                                e.currentTarget.style.background = '#f4f4f5';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e4e4e7';
                                e.currentTarget.style.color = '#3f3f46';
                                e.currentTarget.style.background = '#ffffff';
                            }}
                        >
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Add to Cart Pill Button */}
                <button
                    onClick={onAddToCartClick}
                    disabled={addingToCart}
                    style={{
                        width: 'fit-content',
                        padding: '10px 24px',
                        borderRadius: '12px',
                        background: '#1c1917',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(28, 25, 23, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#CA2945';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(202, 41, 69, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1c1917';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(28, 25, 23, 0.2)';
                    }}
                >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
