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
            <div style={{ width:'100%', height:'224px', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="32" height="32" fill="none" stroke="rgba(202,41,69,0.30)" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
        );
    }

    return (
        <div style={{ position:'relative', width:'100%', height:'224px', overflow:'hidden', background:'#f8f9fa' }}
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
                        style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.90)', border:'1px solid #e5e7eb', color:'#CA2945', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity 0.2s', zIndex:2, boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}
                        className="carousel-arrow">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>

                    {/* Next */}
                    <button onClick={next} aria-label="Next"
                        style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.90)', border:'1px solid #e5e7eb', color:'#CA2945', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity 0.2s', zIndex:2, boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}
                        className="carousel-arrow">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>

                    {/* Dots */}
                    <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px', zIndex:2 }}>
                        {images.map((_, i) => (
                            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                                style={{ width: i === current ? '16px' : '6px', height:'6px', borderRadius:'3px', border:'none', cursor:'pointer', background: i === current ? '#CA2945' : 'rgba(202,41,69,0.30)', transition:'all 0.25s', padding:0 }}
                                aria-label={`Image ${i + 1}`} />
                        ))}
                    </div>

                    {/* Counter */}
                    <div style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(255,255,255,0.90)', border:'1px solid #e5e7eb', color:'#CA2945', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'20px', zIndex:2, letterSpacing:'1px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                        {current + 1}/{images.length}
                    </div>
                </>
            )}

            {/* Inline hover style for arrows */}
            <style>{`
                .group:hover .carousel-arrow { opacity: 1 !important; }
                .carousel-arrow:hover { background: #CA2945 !important; color: #ffffff !important; }
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
                background: '#ffffff',
                border: `1px solid ${hovered ? 'rgba(202,41,69,0.45)' : '#e5e7eb'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 16px 40px rgba(202,41,69,0.12)' : '0 4px 16px rgba(0,0,0,0.04)',
                cursor: 'pointer',
            }}
        >
            <ImageCarousel images={images} />

            <div style={{ padding:'16px 18px 18px', display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
                {/* Title */}
                <h3 style={{ fontSize:'14px', fontWeight:700, color: hovered ? '#CA2945' : '#111827', margin:0, letterSpacing:'0.3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.25s', fontFamily:"'Inter', sans-serif" }}>
                    {title}
                </h3>

                {/* Description */}
                <p style={{ color:'#6b7280', fontSize:'12px', lineHeight:1.6, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>
                    {description}
                </p>

                {/* Footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid #f3f4f6', marginTop:'4px' }}>
                    <span style={{ color:'#CA2945', fontSize:'16px', fontWeight:800, fontFamily:"'Inter', sans-serif" }}>
                        {formattedPrice}
                    </span>
                    <span style={{ color:'#9ca3af', fontSize:'10px', letterSpacing:'0.5px' }}>
                        {formattedDate}
                    </span>
                </div>

                {/* Photo count */}
                {images?.length > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'2px' }}>
                        <svg width="11" height="11" fill="none" stroke="rgba(202,41,69,0.5)" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span style={{ color:'#9ca3af', fontSize:'10px' }}>
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
        <div style={{ width:'64px', height:'64px', borderRadius:'16px', border:'1px solid rgba(202,41,69,0.2)', background:'rgba(202,41,69,0.04)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="28" height="28" fill="none" stroke="#CA2945" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
        </div>
        <div>
            <p style={{ fontSize:'15px', fontWeight:700, color:'#111827', margin:'0 0 6px', letterSpacing:'1px', fontFamily:"'Inter', sans-serif" }}>NO PRODUCTS YET</p>
            <p style={{ color:'#6b7280', fontSize:'12px', margin:0 }}>Your listed products will appear here.</p>
        </div>
    </div>
);

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:'14px', overflow:'hidden', animation:'skeletonPulse 1.5s ease-in-out infinite' }}>
        <div style={{ width:'100%', height:'224px', background:'#f3f4f6' }} />
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ height:'13px', background:'#e5e7eb', borderRadius:'4px', width:'65%' }} />
            <div style={{ height:'11px', background:'#f3f4f6', borderRadius:'4px' }} />
            <div style={{ height:'11px', background:'#f3f4f6', borderRadius:'4px', width:'50%' }} />
            <div style={{ height:'16px', background:'rgba(202,41,69,0.10)', borderRadius:'4px', width:'35%', marginTop:'6px' }} />
        </div>
        <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </div>
);

// ── Dashboard Page ────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const user = useSelector(state => state.auth.user);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProducts().finally(() => setLoading(false));
    }, []);

    const navItems = [
        { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Add Product', path: '/seller/create' },
        { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'My Products', active: true, path: '/seller/dashboard' },
    ];

    return (
        <div className="flex h-screen bg-[#f8f9fa] font-inter overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-[200px] shrink-0 bg-[#ffffff] border-r border-[#e5e7eb] flex flex-col overflow-hidden">
                <div className="px-5 pt-6 pb-4">
                    <div className="text-[18px] font-black text-[#CA2945] tracking-[3px] leading-none">VASTRA</div>
                    <div className="text-[15px] font-extrabold text-[#CA2945] tracking-[2px] leading-tight">BHANDAR</div>
                    <div className="text-[7px] text-[#6b7280] tracking-[2px] mt-0.5 font-medium">SELLER PORTAL</div>
                </div>

                <nav className="flex flex-col gap-0.5 px-2 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => item.path && navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-left w-full cursor-pointer border-none
                                ${item.active
                                    ? 'bg-[#CA2945] text-white font-semibold'
                                    : 'text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 bg-transparent'
                                }`}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="shrink-0">
                                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mx-3 mb-4 mt-3 rounded-2xl overflow-hidden relative" style={{ height: '170px' }}>
                    <div className="absolute inset-0 bg-no-repeat"
                        style={{ backgroundImage: "url('/model.jpg')", backgroundSize: '170%', backgroundPosition: '80% center' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #ffffff 38%, rgba(255,255,255,0.7) 62%, rgba(255,255,255,0.1) 100%)' }} />
                    <div className="relative z-10 p-4 flex flex-col h-full">
                        <div className="text-[13px] font-black text-[#111827] leading-snug tracking-wide">
                            STYLE<br />STARTS<br /><span className="text-[#CA2945]">WITH YOU.</span>
                        </div>
                        <p className="text-[8px] text-[#6b7280] mt-2 leading-relaxed tracking-wide font-semibold uppercase m-0">
                            Manage your listings<br />and reach the culture.
                        </p>
                        <div className="mt-auto">
                            <span className="text-[18px] font-black text-[#CA2945] italic">VB</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-[60px] shrink-0 bg-[#ffffff] border-b border-[#e5e7eb] flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-[18px] font-black text-[#111827] tracking-[2px] m-0 leading-none">
                            MY <span className="text-[#CA2945]">PRODUCTS</span>
                        </h1>
                        <p className="text-[#6b7280] text-[9.5px] tracking-[2px] mt-1 font-semibold m-0">
                            SELLER DASHBOARD
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!loading && (
                            <span className="bg-[#CA2945]/10 border border-[#CA2945]/20 text-[#CA2945] text-[11px] font-bold px-3 py-1 rounded-full">
                                {sellerProducts?.length || 0} listed
                            </span>
                        )}
                        <a href="/seller/create"
                            className="flex items-center gap-1.5 bg-[#CA2945] hover:bg-[#b0203a] text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all shadow-[0_4px_16px_rgba(202,41,69,0.25)] text-decoration-none">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            ADD PRODUCT
                        </a>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1280px] mx-auto">
                        {loading ? (
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
                                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : !sellerProducts?.length ? (
                            <EmptyState />
                        ) : (
                            <>
                                {/* Stats bar */}
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px', color:'#6b7280', fontSize:'12px', letterSpacing:'0.5px' }}>
                                    <span>{sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''} listed</span>
                                    <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#d1d5db', display:'inline-block' }} />
                                    <span>{sellerProducts.reduce((acc, p) => acc + (p.images?.length || 0), 0)} total photos</span>
                                </div>

                                {/* Grid */}
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'20px' }}>
                                    {sellerProducts.map(product => <ProductCard key={product._id} product={product} />)}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;