import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart.js';
import { useNavigate } from 'react-router-dom';

// ── Currency Symbol Helper ──────────────────────────────────────────────────
const formatCurrency = (amount, currency = 'INR') => {
    const sym = { USD: '$', EUR: '€', GBP: '£', INR: '₹' }[currency] || '₹';
    const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount || 0);
    return `${sym} ${num}`;
};

// ── Helper to extract variant attributes & details ──────────────────────────
const getItemInfo = (item) => {
    const product = (item.product && typeof item.product === 'object') ? item.product : {};
    const productId = product._id || (typeof item.product === 'string' ? item.product : item.product?.toString());

    let variantObj = null;
    const itemVariantId = item.variant
        ? (typeof item.variant === 'object' ? item.variant._id : item.variant)
        : null;

    if (itemVariantId && product.variants?.length) {
        variantObj = product.variants.find(v => String(v._id) === String(itemVariantId));
    }

    const image = variantObj?.images?.[0]?.url || product.images?.[0]?.url || '';

    let color = '-';
    let size = '-';

    if (variantObj?.attributes) {
        const attrs = variantObj.attributes;
        if (typeof attrs.get === 'function') {
            color = attrs.get('Color') || attrs.get('color') || color;
            size = attrs.get('Size') || attrs.get('size') || size;
        } else if (typeof attrs === 'object') {
            Object.entries(attrs).forEach(([k, v]) => {
                if (k.toLowerCase() === 'color') color = String(v);
                if (k.toLowerCase() === 'size') size = String(v);
            });
        }
    }

    if (color === '-' && product.color) color = product.color;
    if (size === '-' && product.size) size = product.size;

    const unitPrice = item.price?.amount ?? variantObj?.price?.amount ?? product.price?.amount ?? 0;
    const currency = item.price?.currency ?? variantObj?.price?.currency ?? product.price?.currency ?? 'INR';
    const totalPrice = unitPrice * (item.quantity || 1);

    return {
        image,
        color,
        size,
        unitPrice,
        totalPrice,
        currency,
        title: product.title || 'Product',
        description: product.description || '',
        productId,
        variantId: variantObj?._id || itemVariantId || null
    };
};

const Cart = () => {
    const navigate = useNavigate();
    const { items = [] } = useSelector((state) => state.cart);
    const { handleGetCart, handleAddItem } = useCart();

    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState('');

    const handleQtyUpdate = async (item, info, delta) => {
        if (updatingItemId) return;
        setUpdatingItemId(item._id);
        await handleAddItem({
            productId: info.productId,
            variantId: info.variantId,
            quantity: delta
        });
        setUpdatingItemId(null);
    };

    useEffect(() => {
        handleGetCart().finally(() => setLoading(false));
    }, []);

    // Calculate totals
    const { subtotal, currency, totalItemsCount } = useMemo(() => {
        let sum = 0;
        let count = 0;
        let curr = 'INR';

        items.forEach(item => {
            const info = getItemInfo(item);
            sum += info.totalPrice;
            count += item.quantity || 1;
            if (info.currency) curr = info.currency;
        });

        return { subtotal: sum, currency: curr, totalItemsCount: count };
    }, [items]);

    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (promoCode.trim().toUpperCase() === 'VASTRA10') {
            setPromoApplied(true);
            setPromoError('');
        } else {
            setPromoError('Invalid promo code. Try "VASTRA10"');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            color: '#111827',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: '40px 24px 80px',
            boxSizing: 'border-box'
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cart-row:hover {
                    background: #f9fafb !important;
                }
                .action-btn:hover {
                    color: #CA2945 !important;
                }
                .qty-btn:hover {
                    background: #e5e7eb !important;
                    color: #CA2945 !important;
                }
            `}</style>

            <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '36px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: 900,
                            letterSpacing: '1px',
                            margin: 0,
                            color: '#111827'
                        }}>
                            Shopping cart items
                        </h1>
                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#6b7280' }}>
                            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your bag
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            color: '#4b5563',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '18px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#CA2945';
                            e.currentTarget.style.color = '#CA2945';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.color = '#4b5563';
                        }}
                        title="Back to shop"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#9ca3af' }}>
                        <p style={{ fontSize: '14px', letterSpacing: '2px', fontWeight: 600 }}>LOADING CART...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '90px 24px',
                        background: '#f9fafb',
                        borderRadius: '16px',
                        border: '1px dashed #e5e7eb'
                    }}>
                        <svg width="56" height="56" fill="none" stroke="#CA2945" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.8 }}>
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>Your cart is empty</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px' }}>Looks like you haven't added any clothing pieces yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '14px 32px',
                                background: '#CA2945',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 800,
                                letterSpacing: '1.5px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                boxShadow: '0 8px 24px rgba(202,41,69,0.25)'
                            }}
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    /* Main Cart Content Grid */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 340px',
                        gap: '40px',
                        alignItems: 'start',
                        animation: 'fadeIn 0.4s ease forwards'
                    }}>
                        {/* Left Side: Items Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ padding: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Product</th>
                                        <th style={{ padding: '0 16px 16px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Color</th>
                                        <th style={{ padding: '0 16px 16px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Size</th>
                                        <th style={{ padding: '0 16px 16px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Amount</th>
                                        <th style={{ padding: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => {
                                        const info = getItemInfo(item);
                                        return (
                                            <tr key={item._id} className="cart-row" style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s ease' }}>
                                                {/* Product Info */}
                                                <td style={{ padding: '24px 0', verticalAlign: 'middle' }}>
                                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                        <img
                                                            src={info.image}
                                                            alt={info.title}
                                                            style={{
                                                                width: '72px',
                                                                height: '92px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                background: '#f3f4f6',
                                                                border: '1px solid #e5e7eb',
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                        <div>
                                                            <h3
                                                                onClick={() => navigate(`/product/${info.productId}`)}
                                                                style={{
                                                                    fontSize: '15px',
                                                                    fontWeight: 700,
                                                                    margin: '0 0 6px',
                                                                    color: '#111827',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {info.title}
                                                            </h3>
                                                            {info.description && (
                                                                <p style={{
                                                                    fontSize: '12px',
                                                                    color: '#6b7280',
                                                                    margin: '0 0 10px',
                                                                    maxWidth: '260px',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {info.description}
                                                                </p>
                                                            )}
                                                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                                                                <button
                                                                    className="action-btn"
                                                                    disabled={updatingItemId === item._id}
                                                                    onClick={() => handleQtyUpdate(item, info, -item.quantity)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#6b7280',
                                                                        cursor: updatingItemId === item._id ? 'not-allowed' : 'pointer',
                                                                        opacity: updatingItemId === item._id ? 0.5 : 1,
                                                                        padding: 0,
                                                                        fontSize: '12px',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                >
                                                                    ♡ Remove item
                                                                </button>
                                                                <button
                                                                    className="action-btn"
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#6b7280',
                                                                        cursor: 'pointer',
                                                                        padding: 0,
                                                                        fontSize: '12px',
                                                                        transition: 'color 0.2s'
                                                                    }}
                                                                >
                                                                    Move to favorite
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Color */}
                                                <td style={{ padding: '24px 16px', color: '#374151', fontSize: '14px', verticalAlign: 'middle', textTransform: 'capitalize' }}>
                                                    {info.color}
                                                </td>

                                                {/* Size */}
                                                <td style={{ padding: '24px 16px', color: '#374151', fontSize: '14px', verticalAlign: 'middle', textTransform: 'uppercase' }}>
                                                    {info.size}
                                                </td>

                                                {/* Quantity Amount Controls */}
                                                <td style={{ padding: '24px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        background: '#f9fafb',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '6px',
                                                        padding: '4px 8px',
                                                        opacity: updatingItemId === item._id ? 0.6 : 1
                                                    }}>
                                                        <button
                                                            className="qty-btn"
                                                            disabled={updatingItemId === item._id}
                                                            onClick={() => handleQtyUpdate(item, info, -1)}
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#111827',
                                                                cursor: updatingItemId === item._id ? 'not-allowed' : 'pointer',
                                                                fontSize: '14px',
                                                                borderRadius: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ fontSize: '14px', fontWeight: 700, width: '20px', textAlign: 'center', color: '#111827' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="qty-btn"
                                                            disabled={updatingItemId === item._id}
                                                            onClick={() => handleQtyUpdate(item, info, 1)}
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#111827',
                                                                cursor: updatingItemId === item._id ? 'not-allowed' : 'pointer',
                                                                fontSize: '14px',
                                                                borderRadius: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Total Price */}
                                                <td style={{ padding: '24px 0', fontSize: '15px', fontWeight: 800, color: '#111827', verticalAlign: 'middle', textAlign: 'right' }}>
                                                    {formatCurrency(info.totalPrice, info.currency)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div style={{
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '28px 24px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 24px', color: '#111827' }}>
                                Summary
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                    <span>Total products:</span>
                                    <span style={{ color: '#111827', fontWeight: 700 }}>{formatCurrency(subtotal, currency)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                                    <span>Shipping costs:</span>
                                    <span style={{ color: '#16a34a', fontWeight: 700 }}>Free</span>
                                </div>

                                {promoApplied && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                                        <span>Discount (10%):</span>
                                        <span style={{ fontWeight: 700 }}>-{formatCurrency(discount, currency)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Promocode form */}
                            <form onSubmit={handleApplyPromo} style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Enter VASTRA10"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            background: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            color: '#111827',
                                            fontSize: '12px',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '10px 16px',
                                            background: '#ffffff',
                                            color: '#111827',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoError && (
                                    <p style={{ color: '#ef4444', fontSize: '11px', margin: '6px 0 0' }}>{promoError}</p>
                                )}
                                {promoApplied && (
                                    <p style={{ color: '#16a34a', fontSize: '11px', margin: '6px 0 0' }}>Promo code applied!</p>
                                )}
                            </form>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Total:</span>
                                    <span style={{ fontSize: '22px', fontWeight: 900, color: '#CA2945' }}>
                                        {formatCurrency(finalTotal, currency)}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => alert('Proceeding to Checkout...')}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    background: '#CA2945',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: 900,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(202,41,69,0.25)',
                                    transition: 'transform 0.2s ease, background 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.background = '#b0203a';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = '#CA2945';
                                }}
                            >
                                CHECKOUT
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Feature Badges */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    marginTop: '60px',
                    paddingTop: '32px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: 600
                    }}>
                        <span style={{ fontSize: '18px' }}>🛡️</span>
                        Save payment
                    </div>
                    <div style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: 600
                    }}>
                        <span style={{ fontSize: '18px' }}>🚚</span>
                        Free delivery & returns*
                    </div>
                    <div style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: 600
                    }}>
                        <span style={{ fontSize: '18px' }}>💬</span>
                        Full support
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;