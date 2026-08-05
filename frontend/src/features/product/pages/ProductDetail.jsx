import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sym = (code) => ({ USD: '$', EUR: '€', GBP: '£' }[code] ?? 'INR ');

const fmtPrice = (priceObj) => {
    if (!priceObj) return 'INR 0';
    const amount = typeof priceObj === 'number' ? priceObj : priceObj.amount || 0;
    const currency = typeof priceObj === 'object' ? priceObj.currency : 'INR';
    const formattedNum = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
    return `${currency} ${formattedNum}`;
};

// Normalize key name (e.g. "color" -> "Color")
const normalizeKey = (key) => {
    if (!key) return '';
    const str = String(key).trim();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Safely convert Mongoose Map, plain object, array of {key, value}, or JSON string → plain JS object with normalized keys
const toPlainObj = (attrs) => {
    if (!attrs) return {};
    let parsed = attrs;
    if (typeof attrs === 'string') {
        try { parsed = JSON.parse(attrs); } catch (e) { return {}; }
    }
    const obj = {};
    if (Array.isArray(parsed)) {
        parsed.forEach(item => {
            if (item && item.key && item.value !== undefined && item.value !== null) {
                obj[normalizeKey(item.key)] = String(item.value).trim();
            }
        });
    } else if (typeof parsed.get === 'function') {
        for (const [k, v] of parsed.entries()) {
            if (k && v !== undefined && v !== null) {
                obj[normalizeKey(k)] = String(v).trim();
            }
        }
    } else if (typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
            if (k && v !== undefined && v !== null) {
                obj[normalizeKey(k)] = String(v).trim();
            }
        });
    }
    return obj;
};

// All distinct attribute keys across all variants (normalized)
const allAttrKeys = (variants) => {
    const seen = new Set();
    variants.forEach(v => {
        const plain = toPlainObj(v.attributes);
        Object.keys(plain).forEach(k => seen.add(k));
    });
    return [...seen];
};

// Unique values for one attribute key across all variants
const uniqueAttrValues = (variants, key) => {
    const seen = new Set();
    variants.forEach(v => {
        const val = toPlainObj(v.attributes)[key];
        if (val) seen.add(val);
    });
    return [...seen];
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: "'Inter', sans-serif" }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '56px' }}>
            <div style={{ width: 480, height: 580, borderRadius: 20, background: 'linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 20 }}>
                <div style={{ width: '70%', height: 40, borderRadius: 8, background: '#1a1a1a' }} />
                <div style={{ width: '40%', height: 24, borderRadius: 8, background: '#1a1a1a' }} />
                <div style={{ width: '100%', height: 1, background: '#1e1e1e', margin: '10px 0' }} />
                <div style={{ width: '30%', height: 16, borderRadius: 6, background: '#1a1a1a' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ width: 70, height: 38, borderRadius: 8, background: '#1a1a1a' }} />)}
                </div>
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ProductDetail
// ═══════════════════════════════════════════════════════════════════════════════
const ProductDetail = () => {


    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductDetails } = useProduct();
    const { handleAddItem } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [cartAdded, setCartAdded] = useState(false);

    // Attribute selection state: e.g. { Color: 'BLACK', Size: 'LARGE' }
    const [sel, setSel] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await handleGetProductDetails(productId);
                setProduct(data);
            } catch (e) {
                console.error('ProductDetail fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId]);

    // ── Variant Processing ──
    const variants = useMemo(() => {
        if (!product) return [];
        return product.variants || [];
    }, [product]);

    const attrKeys = useMemo(() => allAttrKeys(variants), [variants]);

    const attrVals = useMemo(() => {
        const map = {};
        attrKeys.forEach(k => { map[k] = uniqueAttrValues(variants, k); });
        return map;
    }, [attrKeys, variants]);

    // Auto-select initial options if variants exist
    useEffect(() => {
        if (variants.length > 0 && Object.keys(sel).length === 0) {
            const initialSel = {};
            // Select the attributes of the first variant as default
            const firstVariantAttrs = toPlainObj(variants[0].attributes);
            attrKeys.forEach(key => {
                if (firstVariantAttrs[key]) {
                    initialSel[key] = firstVariantAttrs[key];
                } else if (attrVals[key]?.[0]) {
                    initialSel[key] = attrVals[key][0];
                }
            });
            if (Object.keys(initialSel).length > 0) {
                setSel(initialSel);
            }
        }
    }, [variants, attrKeys, attrVals]);


    // Match exact variant based on current selections
    const matchedVariant = useMemo(() => {
        const selectedEntries = Object.entries(sel).filter(([, v]) => !!v);
        if (!selectedEntries.length || !variants.length) return null;

        return variants.find(v => {
            const obj = toPlainObj(v.attributes);
            return selectedEntries.every(([k, sv]) => obj[k]?.toLowerCase() === sv?.toLowerCase());
        }) || null;
    }, [sel, variants]);

    // Fallback match if exact combination is not found (e.g. partial match on Color or Size)
    const partialVariant = useMemo(() => {
        if (matchedVariant || !variants.length) return null;

        // Try matching by Color first, then by any selected attribute
        if (sel['Color']) {
            const colorMatch = variants.find(v => toPlainObj(v.attributes)['Color']?.toLowerCase() === sel['Color']?.toLowerCase());
            if (colorMatch) return colorMatch;
        }

        const selectedEntries = Object.entries(sel).filter(([, v]) => !!v);
        if (selectedEntries.length > 0) {
            return variants.find(v => {
                const obj = toPlainObj(v.attributes);
                return selectedEntries.some(([k, sv]) => obj[k]?.toLowerCase() === sv?.toLowerCase());
            }) || null;
        }

        return null;
    }, [matchedVariant, sel, variants]);

    // Active Variant (Exact, Partial, or First Variant)
    const activeVariant = useMemo(() => {
        if (!variants.length) return null;
        return matchedVariant || partialVariant || variants[0] || null;
    }, [matchedVariant, partialVariant, variants]);

    // ── FALLBACK LOGIC ──
    // 1. Display Images: Variant images -> Partial Variant images -> Main Product images
    const displayImages = useMemo(() => {
        if (matchedVariant?.images?.length > 0) return matchedVariant.images;
        if (partialVariant?.images?.length > 0) return partialVariant.images;

        // If color selected, check any variant with that color for images
        if (sel['Color']) {
            const colorVar = variants.find(v => toPlainObj(v.attributes)['Color']?.toLowerCase() === sel['Color']?.toLowerCase() && v.images?.length > 0);
            if (colorVar) return colorVar.images;
        }

        return product?.images || [];
    }, [matchedVariant, partialVariant, sel, variants, product]);

    // Reset image index when image gallery changes
    useEffect(() => {
        setActiveImgIdx(0);
    }, [displayImages]);

    // 2. Display Price: Variant price -> Partial Variant price -> Main Product price
    const displayPrice = useMemo(() => {
        if (matchedVariant?.price?.amount !== undefined) return matchedVariant.price;
        if (partialVariant?.price?.amount !== undefined) return partialVariant.price;
        return product?.price || { amount: 0, currency: 'INR' };
    }, [matchedVariant, partialVariant, product]);

    // 3. Display Stock: Variant stock -> Partial Variant stock -> Main Product stock -> Variant Total Stock
    const displayStock = useMemo(() => {
        if (matchedVariant && matchedVariant.stock !== undefined && matchedVariant.stock !== null) {
            return matchedVariant.stock;
        }
        if (partialVariant && partialVariant.stock !== undefined && partialVariant.stock !== null) {
            return partialVariant.stock;
        }
        if (product?.stock !== undefined && product?.stock !== null) {
            return product.stock;
        }
        if (variants.length > 0) {
            return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        }
        return 0;
    }, [matchedVariant, partialVariant, product, variants]);

    // 4. Display Description: Variant description -> Main Product description
    const displayDescription = useMemo(() => {
        if (matchedVariant?.description) return matchedVariant.description;
        if (partialVariant?.description) return partialVariant.description;
        return product?.description || '';
    }, [matchedVariant, partialVariant, product]);

    // Check availability of an attribute value given current selections
    const isAvailable = (key, val) => {
        if (!variants.length) return true;
        const otherSelected = Object.entries(sel).filter(([k, v]) => k !== key && !!v);
        return variants.some(v => {
            const obj = toPlainObj(v.attributes);
            return obj[key]?.toLowerCase() === val?.toLowerCase() &&
                otherSelected.every(([k, sv]) => obj[k]?.toLowerCase() === sv?.toLowerCase());
        });
    };

    const toggleAttr = (key, val) => {
        setSel(prev => ({
            ...prev,
            [key]: prev[key]?.toLowerCase() === val?.toLowerCase() ? null : val
        }));
    };

    if (loading) return <LoadingSkeleton />;

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: "'Inter', sans-serif" }}>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Product not found</p>
                <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#E8490F', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>← Back to Shop</button>
            </div>
        );
    }

    const { title } = product;
    const currentImgUrl = displayImages[activeImgIdx]?.url || displayImages[0]?.url;

    return (
        <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
                
                .font-serif-title {
                    font-family: 'Playfair Display', Georgia, serif;
                }
                
                @keyframes fadeImg {
                    from { opacity: 0.35; transform: scale(0.995); }
                    to { opacity: 1; transform: scale(1); }
                }

                .animate-fade {
                    animation: fadeImg 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .attr-btn {
                    background: #141414;
                    border: 1px solid #2a2a2a;
                    color: #999999;
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: 1.5px;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                }

                .attr-btn:hover:not(:disabled) {
                    border-color: #666666;
                    color: #ffffff;
                }

                .attr-btn.active {
                    background: #ffffff !important;
                    color: #000000 !important;
                    border-color: #ffffff !important;
                    box-shadow: 0 4px 16px rgba(255,255,255,0.12);
                }

                .attr-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    text-decoration: line-through;
                }

                .thumb-box {
                    width: 72px;
                    height: 90px;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid #242424;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #141414;
                    flex-shrink: 0;
                }

                .thumb-box:hover {
                    border-color: #555555;
                }

                .thumb-box.active {
                    border-color: #ffffff;
                    box-shadow: 0 0 0 1px #ffffff;
                }

                .buy-btn-solid {
                    background: #000000;
                    color: #ffffff;
                    border: 1px solid #333333;
                }
                .buy-btn-solid:hover:not(:disabled) {
                    background: #ffffff;
                    color: #000000;
                    border-color: #ffffff;
                }
            `}</style>

            {/* ── Top Header ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1c1c1c', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '13px', fontWeight: 600, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E8490F'}
                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    Back to Store
                </button>
                <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '3px' }}>
                    VASTRA <span style={{ color: '#E8490F' }}>BHANDAR</span>
                </div>
                <div style={{ width: 100 }} />
            </header>

            {/* ── Main Layout ── */}
            <main style={{ maxWidth: '1160px', margin: '0 auto', padding: '48px 24px 100px' }}>
                {/* 2-Column Fixed Grid Layout so image size never changes on variant toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }}>

                    {/* ════ LEFT COLUMN: Gallery & Vertical Thumbnails (Stable dimensions) ════ */}
                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                        {displayImages.length > 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto', flexShrink: 0 }}>
                                {displayImages.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImgIdx(i)}
                                        className={`thumb-box ${i === activeImgIdx ? 'active' : ''}`}
                                    >
                                        <img src={img.url} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0, height: '520px', background: '#141414', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid #222' }}>
                            {currentImgUrl ? (
                                <img
                                    key={currentImgUrl}
                                    src={currentImgUrl}
                                    alt={title}
                                    className="animate-fade"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="48" height="48" fill="none" stroke="#333" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ════ RIGHT COLUMN: Details & Variant Selectors ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {/* Product Title */}
                        <h1 className="font-serif-title" style={{ fontSize: '38px', fontWeight: 400, color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '0.2px' }}>
                            {title}
                        </h1>

                        {/* Price */}
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#b0b0b0', margin: '0 0 28px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            {fmtPrice(displayPrice)}
                        </div>

                        {/* Dynamic Attribute Selectors (COLOR, SIZE, etc.) */}
                        {attrKeys.map(key => {
                            const values = attrVals[key] || [];
                            return (
                                <div key={key} style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#777777', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        {key}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {values.map(val => {
                                            const active = sel[key]?.toLowerCase() === val?.toLowerCase();
                                            const avail = isAvailable(key, val);
                                            return (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    disabled={!avail}
                                                    onClick={() => toggleAttr(key, val)}
                                                    className={`attr-btn ${active ? 'active' : ''}`}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Stock Count Indicator */}
                        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: displayStock > 0 ? '#00FF66' : '#ef4444', textTransform: 'uppercase', marginBottom: '24px' }}>
                            {displayStock > 0 ? `${displayStock} IN STOCK` : 'OUT OF STOCK'}
                        </div>

                        {/* Product / Variant Description */}
                        {displayDescription && (
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 800, color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    THE DETAILS
                                </div>
                                <div style={{ fontSize: '13px', color: '#999999', lineHeight: 1.7, fontWeight: 400 }}>
                                    {displayDescription}
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* ADD TO CART */}
                            <button
                                onClick={() => {
                                    console.log("Product Details:", product);
                                    console.log("Active Variant Details:", activeVariant);
                                    console.log("Matched Variant Details:", matchedVariant);
                                    setCartAdded(true);
                                    setTimeout(() => setCartAdded(false), 2000);
                                    handleAddItem({
                                        productId: product._id,
                                        variantId: activeVariant?._id || null,
                                        quantity: 1
                                    })
                                }}
                                disabled={displayStock <= 0}
                                style={{
                                    width: '100%',
                                    height: '52px',
                                    background: cartAdded ? '#22c55e' : displayStock <= 0 ? '#1f1f1f' : '#141414',
                                    color: cartAdded ? '#ffffff' : displayStock <= 0 ? '#555555' : '#ffffff',
                                    border: '1px solid #2c2c2c',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: displayStock <= 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    if (displayStock > 0 && !cartAdded) {
                                        e.currentTarget.style.background = '#222222';
                                        e.currentTarget.style.borderColor = '#444444';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (displayStock > 0 && !cartAdded) {
                                        e.currentTarget.style.background = '#141414';
                                        e.currentTarget.style.borderColor = '#2c2c2c';
                                    }
                                }}
                            >
                                {cartAdded ? '✓ ADDED TO CART' : displayStock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                            </button>

                            {/* BUY NOW */}
                            <button
                                disabled={displayStock <= 0}
                                style={{
                                    width: '100%',
                                    height: '52px',
                                    background: 'transparent',
                                    color: displayStock <= 0 ? '#444444' : '#ffffff',
                                    border: `1px solid ${displayStock <= 0 ? '#222222' : '#ffffff'}`,
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: displayStock <= 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    if (displayStock > 0) {
                                        e.currentTarget.style.background = '#ffffff';
                                        e.currentTarget.style.color = '#000000';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (displayStock > 0) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                }}
                            >
                                BUY NOW
                            </button>
                        </div>

                    </div>
                </div>

                {/* ── Features Bar in 1 Horizontal Line at the end (Matching Reference Image) ── */}
                <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '36px', marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                    {/* Column 1: SHIPPING */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderRight: '1px solid #1a1a1a', paddingRight: '24px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <svg width="32" height="32" fill="none" stroke="#ffffff" strokeWidth="1.4" viewBox="0 0 24 24">
                                <rect x="1" y="3" width="15" height="13" rx="1" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#888888', textTransform: 'uppercase' }}>SHIPPING</span>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#888888', textTransform: 'uppercase' }}>COMPLIMENTARY OVER INR 15,000</span>
                        </div>
                    </div>

                    {/* Column 2: RETURNS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderRight: '1px solid #1a1a1a', paddingRight: '24px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <svg width="32" height="32" fill="none" stroke="#ffffff" strokeWidth="1.4" viewBox="0 0 24 24">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#888888', textTransform: 'uppercase' }}>RETURNS</span>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#888888', textTransform: 'uppercase' }}>WITHIN 14 DAYS OF DELIVERY</span>
                        </div>
                    </div>

                    {/* Column 3: AUTHENTICITY */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ flexShrink: 0 }}>
                            <svg width="32" height="32" fill="none" stroke="#ffffff" strokeWidth="1.4" viewBox="0 0 24 24">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <polyline points="9 12 11 14 15 10" />
                            </svg>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#888888', textTransform: 'uppercase' }}>AUTHENTICITY</span>
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#888888', textTransform: 'uppercase' }}>100% GUARANTEED AUTHENTIC</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;