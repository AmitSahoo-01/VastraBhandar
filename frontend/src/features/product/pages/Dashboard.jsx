import React, { useEffect, useState, useCallback } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ── Image Carousel inside each card ──────────────────────────────────────────
const ImageCarousel = ({ images = [] }) => {
    const [current, setCurrent] = useState(0);

    const prev = useCallback((e) => {
        e.stopPropagation();
        setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
    }, [images.length]);

    const next = useCallback((e) => {
        e.stopPropagation();
        setCurrent(c => (c === images.length - 1 ? 0 : c + 1));
    }, [images.length]);

    if (!images.length) {
        return (
            <div style={{ width:'100%', height:'224px', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="32" height="32" fill="none" stroke="rgba(232,73,15,0.20)" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
        );
    }

    return (
        <div style={{ position:'relative', width:'100%', height:'224px', overflow:'hidden', background:'#0d0d0d' }}
            className="group">
            {/* Slide track */}
            <div style={{ display:'flex', height:'100%', transition:'transform 0.3s ease', transform:`translateX(-${current * 100}%)` }}>
                {images.map((img, i) => (
                    <img key={i} src={img.url} alt={`img-${i + 1}`}
                        style={{ minWidth:'100%', height:'100%', objectFit:'cover', flexShrink:0 }}
                        draggable={false} />
                ))}
            </div>

            {images.length > 1 && (
                <>
                    {/* Prev */}
                    <button onClick={prev} aria-label="Previous"
                        style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(13,13,13,0.70)', border:'1px solid rgba(232,73,15,0.25)', color:'#E8490F', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity 0.2s', zIndex:2 }}
                        className="carousel-arrow">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>

                    {/* Next */}
                    <button onClick={next} aria-label="Next"
                        style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(13,13,13,0.70)', border:'1px solid rgba(232,73,15,0.25)', color:'#E8490F', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity 0.2s', zIndex:2 }}
                        className="carousel-arrow">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>

                    {/* Dots */}
                    <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px', zIndex:2 }}>
                        {images.map((_, i) => (
                            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                                style={{ width: i === current ? '16px' : '6px', height:'6px', borderRadius:'3px', border:'none', cursor:'pointer', background: i === current ? '#E8490F' : 'rgba(232,73,15,0.30)', transition:'all 0.25s', padding:0 }}
                                aria-label={`Image ${i + 1}`} />
                        ))}
                    </div>

                    {/* Counter */}
                    <div style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(13,13,13,0.75)', border:'1px solid rgba(232,73,15,0.20)', color:'rgba(232,73,15,0.90)', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'20px', zIndex:2, letterSpacing:'1px' }}>
                        {current + 1}/{images.length}
                    </div>
                </>
            )}

            {/* Inline hover style for arrows */}
            <style>{`
                .group:hover .carousel-arrow { opacity: 1 !important; }
                .carousel-arrow:hover { background: rgba(232,73,15,0.15) !important; }
            `}</style>
        </div>
    );
};

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
    const { title, description, price, images, createdAt } = product;
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: price?.currency || 'INR', maximumFractionDigits: 0,
    }).format(price?.amount || 0);

    const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

    return (
        <div
            onClick={()=>{
                navigate(`/seller/product/${product._id}`)
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#161616',
                border: `1px solid ${hovered ? 'rgba(232,73,15,0.45)' : '#1e1e1e'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,73,15,0.08)' : 'none',
            }}
        >
            <ImageCarousel images={images} />

            <div style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
                {/* Title */}
                <h3 style={{ fontSize:'13px', fontWeight:700, color: hovered ? '#E8490F' : '#ffffff', margin:0, letterSpacing:'0.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.25s', fontFamily:"'Inter', sans-serif" }}>
                    {title}
                </h3>

                {/* Description */}
                <p style={{ color:'rgba(255,255,255,0.40)', fontSize:'12px', lineHeight:1.6, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>
                    {description}
                </p>

                {/* Footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:'4px' }}>
                    <span style={{ color:'#E8490F', fontSize:'16px', fontWeight:700, fontFamily:"'Inter', sans-serif" }}>
                        {formattedPrice}
                    </span>
                    <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'10px', letterSpacing:'0.5px' }}>
                        {formattedDate}
                    </span>
                </div>

                {/* Photo count */}
                {images?.length > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'2px' }}>
                        <svg width="11" height="11" fill="none" stroke="rgba(232,73,15,0.4)" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span style={{ color:'rgba(255,255,255,0.30)', fontSize:'10px' }}>
                            {images.length} {images.length === 1 ? 'photo' : 'photos'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:'20px', textAlign:'center' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'16px', border:'1px solid rgba(232,73,15,0.15)', background:'rgba(232,73,15,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="28" height="28" fill="none" stroke="rgba(232,73,15,0.5)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        </div>
        <div>
            <p style={{ fontSize:'15px', fontWeight:700, color:'#ffffff', margin:'0 0 6px', letterSpacing:'1px', fontFamily:"'Inter', sans-serif" }}>NO PRODUCTS YET</p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>Your listed products will appear here.</p>
        </div>
    </div>
);

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div style={{ background:'#161616', border:'1px solid #1e1e1e', borderRadius:'14px', overflow:'hidden', animation:'skeletonPulse 1.5s ease-in-out infinite' }}>
        <div style={{ width:'100%', height:'224px', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ height:'13px', background:'rgba(255,255,255,0.07)', borderRadius:'4px', width:'65%' }} />
            <div style={{ height:'11px', background:'rgba(255,255,255,0.04)', borderRadius:'4px' }} />
            <div style={{ height:'11px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', width:'50%' }} />
            <div style={{ height:'16px', background:'rgba(232,73,15,0.10)', borderRadius:'4px', width:'35%', marginTop:'6px' }} />
        </div>
        <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </div>
);

// ── Dashboard Page ────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        handleGetSellerProducts().finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ minHeight:'100vh', background:'#0d0d0d', fontFamily:"'Inter', sans-serif" }}>

            {/* ── Header ── */}
            <header style={{ position:'sticky', top:0, zIndex:20, background:'rgba(13,13,13,0.94)', backdropFilter:'blur(12px)', borderBottom:'1px solid #1e1e1e', padding:'0 24px', height:'64px', display:'flex', alignItems:'center' }}>
                <div style={{ maxWidth:'1280px', width:'100%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                        <h1 style={{ fontSize:'18px', fontWeight:900, color:'#ffffff', letterSpacing:'2px', margin:0, lineHeight:1, fontFamily:"'Inter', sans-serif" }}>
                            MY <span style={{ color:'#E8490F' }}>PRODUCTS</span>
                        </h1>
                        <p style={{ color:'rgba(255,255,255,0.30)', fontSize:'9.5px', letterSpacing:'2px', margin:'3px 0 0', fontWeight:600 }}>
                            SELLER DASHBOARD
                        </p>
                    </div>

                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        {!loading && (
                            <span style={{ background:'rgba(232,73,15,0.10)', border:'1px solid rgba(232,73,15,0.25)', color:'#E8490F', fontSize:'11px', fontWeight:700, padding:'4px 12px', borderRadius:'20px', letterSpacing:'0.5px' }}>
                                {sellerProducts?.length || 0} listed
                            </span>
                        )}
                        <a href="/seller/create"
                            style={{ display:'flex', alignItems:'center', gap:'6px', background:'#E8490F', color:'#fff', fontSize:'12px', fontWeight:700, padding:'8px 16px', borderRadius:'10px', textDecoration:'none', letterSpacing:'0.5px', transition:'all 0.2s', boxShadow:'0 4px 16px rgba(232,73,15,0.25)' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#c73a0a'; e.currentTarget.style.boxShadow='0 4px 20px rgba(232,73,15,0.40)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#E8490F'; e.currentTarget.style.boxShadow='0 4px 16px rgba(232,73,15,0.25)'; }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            ADD PRODUCT
                        </a>
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <main style={{ maxWidth:'1280px', margin:'0 auto', padding:'36px 24px' }}>
                {loading ? (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : !sellerProducts?.length ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Stats bar */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px', color:'rgba(255,255,255,0.35)', fontSize:'12px', letterSpacing:'0.5px' }}>
                            <span>{sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''} listed</span>
                            <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'inline-block' }} />
                            <span>{sellerProducts.reduce((acc, p) => acc + (p.images?.length || 0), 0)} total photos</span>
                        </div>

                        {/* Grid */}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
                            {sellerProducts.map(product => <ProductCard key={product._id} product={product} />)}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;