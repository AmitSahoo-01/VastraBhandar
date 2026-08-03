import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

// ── Currency symbol helper ────────────────────────────────────────────────────
const sym = (code) => ({ USD: '$', EUR: '€', GBP: '£' }[code] ?? '₹');

// ── Vertical Thumbnail Strip ─────────────────────────────────────────────────
const ThumbnailStrip = ({ images, activeIdx, onSelect }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', gap: '8px',
        width: '76px', flexShrink: 0,
        maxHeight: '520px', overflowY: 'auto',
        scrollbarWidth: 'none',
    }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {images.map((img, i) => (
            <button
                key={i}
                onClick={() => onSelect(i)}
                style={{
                    width: '76px', height: '76px', borderRadius: '10px', overflow: 'hidden',
                    border: `2px solid ${i === activeIdx ? '#E8490F' : '#2a2a2a'}`,
                    padding: 0, cursor: 'pointer', background: '#161616', flexShrink: 0,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: i === activeIdx ? '0 0 0 2px rgba(232,73,15,0.18)' : 'none',
                    outline: 'none',
                }}
                onMouseEnter={e => { if (i !== activeIdx) e.currentTarget.style.borderColor = 'rgba(232,73,15,0.45)'; }}
                onMouseLeave={e => { if (i !== activeIdx) e.currentTarget.style.borderColor = '#2a2a2a'; }}
                aria-label={`View image ${i + 1}`}
            >
                <img
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            </button>
        ))}
    </div>
);

// ── Main Image with hover prev/next arrows ────────────────────────────────────
const ImageGallery = ({ images, activeIdx, setActiveIdx }) => {
    const [hovered, setHovered] = useState(false);
    const total = images?.length || 0;

    const goPrev = (e) => {
        e.stopPropagation();
        setActiveIdx(i => (i === 0 ? total - 1 : i - 1));
    };
    const goNext = (e) => {
        e.stopPropagation();
        setActiveIdx(i => (i === total - 1 ? 0 : i + 1));
    };

    const src = images?.[activeIdx]?.url;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative', borderRadius: '16px', overflow: 'hidden',
                background: '#111111', aspectRatio: '3/4', width: '100%', minHeight: '420px',
            }}
        >
            {src ? (
                <img
                    src={src}
                    alt={`Product image ${activeIdx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            ) : (
                <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="48" height="48" fill="none" stroke="rgba(232,73,15,0.25)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                </div>
            )}

            {/* Prev / Next arrows — only when hovered and multiple images */}
            {total > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'rgba(13,13,13,0.72)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', backdropFilter: 'blur(6px)',
                            opacity: hovered ? 1 : 0,
                            transition: 'opacity 0.22s ease, background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,73,15,0.80)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(13,13,13,0.72)'}
                        aria-label="Previous image"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>

                    <button
                        onClick={goNext}
                        style={{
                            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'rgba(13,13,13,0.72)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', backdropFilter: 'blur(6px)',
                            opacity: hovered ? 1 : 0,
                            transition: 'opacity 0.22s ease, background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,73,15,0.80)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(13,13,13,0.72)'}
                        aria-label="Next image"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>

                    {/* Dot indicators */}
                    <div style={{
                        position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: '6px', alignItems: 'center',
                    }}>
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                                style={{
                                    width: i === activeIdx ? '18px' : '6px',
                                    height: '6px', borderRadius: '3px', border: 'none', padding: 0,
                                    background: i === activeIdx ? '#E8490F' : 'rgba(255,255,255,0.45)',
                                    cursor: 'pointer', transition: 'all 0.25s ease',
                                }}
                                aria-label={`Image ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Counter */}
                    <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(13,13,13,0.72)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.80)', fontSize: '11px', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px',
                    }}>
                        {activeIdx + 1}/{total}
                    </div>
                </>
            )}
        </div>
    );
};

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter', sans-serif" }}>
        <style>{`@keyframes skPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        <div style={{ maxWidth:'1100px', width:'100%', padding:'40px 24px', display:'flex', gap:'48px' }}>
            <div style={{ flex:'0 0 440px', borderRadius:'16px', background:'#1e1e1e', animation:'skPulse 1.6s ease-in-out infinite', minHeight:'520px' }} />
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'20px', paddingTop:'12px' }}>
                {[80, 220, 60, 100, 140, 52, 52].map((w, i) => (
                    <div key={i} style={{ height: i===1?'40px': i>=5?'52px':'16px', width:`${w}px`, maxWidth:'100%', borderRadius:'8px', background:'#1e1e1e', animation:'skPulse 1.6s ease-in-out infinite', animationDelay:`${i*0.1}s` }} />
                ))}
            </div>
        </div>
    </div>
);

// ── Not Found ─────────────────────────────────────────────────────────────────
const NotFound = ({ onBack }) => (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Inter', sans-serif", gap:'16px' }}>
        <svg width="48" height="48" fill="none" stroke="rgba(232,73,15,0.5)" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p style={{ color:'#ffffff', fontSize:'18px', fontWeight:700, margin:0 }}>Product Not Found</p>
        <p style={{ color:'rgba(255,255,255,0.40)', fontSize:'13px', margin:0 }}>This product may have been removed or doesn't exist.</p>
        <button onClick={onBack} style={{ marginTop:'8px', padding:'10px 24px', background:'#E8490F', border:'none', borderRadius:'10px', color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#c73a0a'}
            onMouseLeave={e => e.currentTarget.style.background = '#E8490F'}>
            ← Back to Shop
        </button>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ── ProductDetail Page ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductDetails } = useProduct();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [cartAdded, setCartAdded] = useState(false);

    // Button press animation state
    const [cartPressed, setCartPressed] = useState(false);
    const [buyPressed, setBuyPressed] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await handleGetProductDetails(productId);
            setProduct(data);
        } catch (error) {
            console.error('Error in fetchProduct:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = useCallback(() => {
        setCartPressed(true);
        setTimeout(() => setCartPressed(false), 120);
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2200);
    }, []);

    const handleBuyNow = useCallback(() => {
        setBuyPressed(true);
        setTimeout(() => setBuyPressed(false), 120);
        // placeholder — wire up to checkout when ready
    }, []);

    if (loading) return <LoadingSkeleton />;
    if (!product) return <NotFound onBack={() => navigate('/')} />;

    const { title, description, price, images, createdAt } = product;
    const currencySymbol = sym(price?.currency);
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
    }).format(price?.amount || 0);

    const listedDate = new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <div style={{ minHeight:'100vh', background:'#0d0d0d', fontFamily:"'Inter', sans-serif", color:'#ffffff' }}>

            {/* ── keyframes for button press ── */}
            <style>{`
                @keyframes btnPop {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
                @keyframes cartCheck {
                    0%   { opacity:0; transform:scale(0.5); }
                    60%  { transform:scale(1.15); }
                    100% { opacity:1; transform:scale(1); }
                }
            `}</style>

            {/* ── Top Nav Bar ── */}
            <header style={{
                position:'sticky', top:0, zIndex:50,
                background:'rgba(13,13,13,0.94)', backdropFilter:'blur(12px)',
                borderBottom:'1px solid #1e1e1e',
                padding:'0 32px', height:'60px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display:'flex', alignItems:'center', gap:'8px',
                        background:'none', border:'none', cursor:'pointer',
                        color:'rgba(255,255,255,0.55)', fontSize:'13px', fontWeight:600, padding:0,
                        transition:'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E8490F'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back to Shop
                </button>

                <div style={{ fontSize:'15px', fontWeight:900, letterSpacing:'2px' }}>
                    VASTRA <span style={{ color:'#E8490F' }}>BHANDAR</span>
                </div>

                <div style={{ width:'100px' }} />
            </header>

            {/* ── Page Body ── */}
            <main style={{ maxWidth:'1100px', margin:'0 auto', padding:'40px 24px 80px' }}>
                <div style={{ display:'flex', gap:'48px', alignItems:'flex-start' }}>

                    {/* ════ LEFT — Thumbnails + Main Image ════ */}
                    <div style={{ flex:'0 0 500px', width:'500px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                        {/* Vertical thumbnail strip — only if 2+ images */}
                        {images?.length > 1 && (
                            <ThumbnailStrip
                                images={images}
                                activeIdx={activeImg}
                                onSelect={setActiveImg}
                            />
                        )}
                        {/* Main image */}
                        <div style={{ flex: 1 }}>
                            <ImageGallery images={images} activeIdx={activeImg} setActiveIdx={setActiveImg} />
                        </div>
                    </div>

                    {/* ════ RIGHT — Product Info ════ */}
                    <div style={{ flex:1, display:'flex', flexDirection:'column', paddingTop:'4px' }}>

                        {/* NEW ARRIVAL badge */}
                        <div style={{
                            display:'inline-flex', alignItems:'center',
                            background:'rgba(232,73,15,0.10)', border:'1px solid rgba(232,73,15,0.25)',
                            color:'#E8490F', fontSize:'11px', fontWeight:700,
                            padding:'4px 12px', borderRadius:'20px', letterSpacing:'1px',
                            marginBottom:'14px', alignSelf:'flex-start',
                        }}>
                            NEW ARRIVAL
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize:'28px', fontWeight:900, color:'#ffffff',
                            margin:'0 0 8px', lineHeight:1.25, letterSpacing:'-0.3px',
                        }}>
                            {title}
                        </h1>

                        {/* Listed date */}
                        <p style={{ color:'rgba(255,255,255,0.30)', fontSize:'11.5px', margin:'0 0 18px', letterSpacing:'0.3px' }}>
                            Listed on {listedDate}
                        </p>

                        {/* Divider */}
                        <div style={{ height:'1px', background:'#1e1e1e', margin:'0 0 20px' }} />

                        {/* Price */}
                        <div style={{ display:'flex', alignItems:'baseline', gap:'10px', marginBottom:'20px' }}>
                            <span style={{ fontSize:'36px', fontWeight:900, color:'#E8490F', letterSpacing:'-0.5px' }}>
                                {currencySymbol}{formattedPrice}
                            </span>
                            <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>
                                {price?.currency || 'INR'}
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{
                            color:'rgba(255,255,255,0.60)', fontSize:'14px', lineHeight:1.75,
                            margin:'0 0 28px', whiteSpace:'pre-wrap',
                        }}>
                            {description}
                        </p>

                        {/* Divider */}
                        <div style={{ height:'1px', background:'#1e1e1e', margin:'0 0 24px' }} />

                        {/* ── CTA Buttons ── */}
                        <div style={{ display:'flex', gap:'12px', marginBottom:'28px' }}>

                            {/* Add to Cart */}
                            <button
                                id="btn-add-to-cart"
                                onClick={handleAddToCart}
                                style={{
                                    flex:1, height:'52px', borderRadius:'12px',
                                    background: cartAdded ? '#22c55e' : '#E8490F',
                                    border:'none', cursor:'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                                    color:'#ffffff', fontSize:'14px', fontWeight:700, letterSpacing:'0.3px',
                                    transition:'background 0.25s ease, transform 0.15s ease',
                                    animation: cartPressed ? 'btnPop 0.18s ease' : 'none',
                                    outline:'none',
                                }}
                                onMouseEnter={e => { if (!cartAdded) e.currentTarget.style.background = '#c73a0a'; }}
                                onMouseLeave={e => { if (!cartAdded) e.currentTarget.style.background = '#E8490F'; }}
                            >
                                {cartAdded ? (
                                    <>
                                        <svg
                                            width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                                            style={{ animation:'cartCheck 0.3s ease' }}
                                        >
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                                        </svg>
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            {/* Buy Now */}
                            <button
                                id="btn-buy-now"
                                onClick={handleBuyNow}
                                style={{
                                    flex:1, height:'52px', borderRadius:'12px',
                                    background:'transparent',
                                    border:'2px solid #E8490F',
                                    cursor:'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                                    color:'#E8490F', fontSize:'14px', fontWeight:700, letterSpacing:'0.3px',
                                    transition:'background 0.2s ease, color 0.2s ease',
                                    animation: buyPressed ? 'btnPop 0.18s ease' : 'none',
                                    outline:'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background='#E8490F'; e.currentTarget.style.color='#ffffff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#E8490F'; }}
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                </svg>
                                Buy Now
                            </button>
                        </div>

                        {/* ── Trust Badges ── */}
                        <div style={{
                            display:'flex', gap:'0',
                            border:'1px solid #1e1e1e', borderRadius:'12px', overflow:'hidden',
                        }}>
                            {[
                                { icon:<><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v3a2 2 0 01-2 2h-1"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>, label:'Fast Delivery', sub:'Ships within 3-5 days' },
                                { icon:<><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></>, label:'Easy Returns', sub:'7-day return policy' },
                                { icon:<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>, label:'Secure Payment', sub:'100% safe checkout' },
                            ].map(({ icon, label, sub }, i) => (
                                <div key={label} style={{
                                    flex:1, padding:'14px 12px',
                                    borderLeft: i > 0 ? '1px solid #1e1e1e' : 'none',
                                    display:'flex', alignItems:'center', gap:'10px',
                                }}>
                                    <div style={{ width:'32px', height:'32px', background:'rgba(232,73,15,0.08)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                        <svg width="15" height="15" fill="none" stroke="#E8490F" strokeWidth="1.8" viewBox="0 0 24 24">{icon}</svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize:'11.5px', fontWeight:700, color:'#ffffff' }}>{label}</div>
                                        <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'1px' }}>{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;