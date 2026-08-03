import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';

// ── Dummy carousel images ─────────────────────────────────────────────────────
const CAROUSEL_IMAGES = [
    { id: 1,  src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=340&h=510&fit=crop&q=80', alt: 'Look 1' },
    { id: 2,  src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=340&h=510&fit=crop&q=80', alt: 'Look 2' },
    { id: 3,  src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=340&h=510&fit=crop&q=80', alt: 'Look 3' },
    { id: 4,  src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=340&h=510&fit=crop&q=80', alt: 'Look 4' },
    { id: 5,  src: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=340&h=510&fit=crop&q=80', alt: 'Look 5' },
    { id: 6,  src: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=340&h=510&fit=crop&q=80', alt: 'Look 6' },
    { id: 7,  src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=340&h=510&fit=crop&q=80', alt: 'Look 7' },
    { id: 8,  src: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=340&h=510&fit=crop&q=80', alt: 'Look 8' },
    { id: 9,  src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=340&h=510&fit=crop&q=80', alt: 'Look 9' },
    { id: 10, src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=340&h=510&fit=crop&q=80', alt: 'Look 10' },
];

// ── Slot size config per position ─────────────────────────────────────────────
const SLOT_CONFIG = {
    '-2': { h: 198, w: 134, opacity: 0.60 },
    '-1': { h: 242, w: 161, opacity: 0.82 },
     '0': { h: 288, w: 191, opacity: 1.00 },
     '1': { h: 242, w: 161, opacity: 0.82 },
     '2': { h: 198, w: 134, opacity: 0.60 },
};

// ── Gold decorator ────────────────────────────────────────────────────────────
const Decorator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '90px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(232,73,15,0.65))' }} />
        <div style={{ width: '7px', height: '7px', background: '#E8490F', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(232,73,15,0.6)', flexShrink: 0 }} />
        <div style={{ width: '90px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(232,73,15,0.65))' }} />
    </div>
);

// ── Arrow button ──────────────────────────────────────────────────────────────
const ArrowBtn = ({ onClick, direction }) => {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flexShrink: 0, width: '42px', height: '42px', borderRadius: '50%',
                border: `1.5px solid ${hov ? '#E8490F' : 'rgba(255,255,255,0.22)'}`,
                background: hov ? 'rgba(232,73,15,0.12)' : 'rgba(255,255,255,0.04)',
                color: hov ? '#E8490F' : 'rgba(255,255,255,0.70)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', outline: 'none',
                transition: 'all 0.30s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hov ? 'scale(1.12)' : 'scale(1)',
            }}
            aria-label={direction === 'prev' ? 'Previous' : 'Next'}
        >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {direction === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
            </svg>
        </button>
    );
};

// ── CrossFadeImage: no-blink image transition ────────────────────────────────
// Old image stays fully visible (base layer) while new image fades in on top.
// Eliminates the white/dark blink caused by key={id} unmounting the old img.
const CrossFadeImage = ({ src, alt }) => {
    const [current,  setCurrent]  = useState(src);
    const [previous, setPrevious] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (src === current) return;
        clearTimeout(timerRef.current);
        setPrevious(current);  // freeze old image as opaque base layer
        setCurrent(src);        // new image will fade in on top
        timerRef.current = setTimeout(() => setPrevious(null), 500);
        return () => clearTimeout(timerRef.current);
    }, [src]);

    return (
        <>
            {/* Base layer: previous image stays fully visible — zero blink */}
            {previous && (
                <img
                    src={previous}
                    alt={alt}
                    draggable={false}
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%', objectFit: 'cover',
                        zIndex: 1,
                    }}
                />
            )}
            {/* Top layer: new image fades in over the previous */}
            <img
                key={current}
                src={current}
                alt={alt}
                draggable={false}
                loading="lazy"
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    zIndex: 2,
                    animation: previous ? 'imgCrossfade 0.45s ease forwards' : 'none',
                    opacity: previous ? undefined : 1,
                    willChange: 'opacity',
                }}
            />
        </>
    );
};

// ── Currency symbol helper ─────────────────────────────────────────────────────
const currencySymbol = (code) => ({ USD: '$', EUR: '€', GBP: '£' }[code] ?? '₹');

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
    const { title, description, price, images } = product;
    const imgSrc = images?.[0]?.url;
    const sym    = currencySymbol(price?.currency);
    const navigate = useNavigate();

    return (
        <div
            className="vb-product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
                background: '#161616',
                border: '1px solid #1e1e1e',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.4s',
                animation: 'fadeUp 0.55s ease both',
                animationDelay: `${Math.min(index * 0.08, 0.6)}s`,
                willChange: 'transform',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-7px)';
                e.currentTarget.style.borderColor = 'rgba(232,73,15,0.45)';
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,73,15,0.10)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#1e1e1e';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Image */}
            <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#111111', position: 'relative' }}>
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.07)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="38" height="38" fill="none" stroke="rgba(232,73,15,0.25)" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                )}
                {/* Bottom gradient */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(13,13,13,0.65) 0%, transparent 100%)', pointerEvents: 'none' }} />
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{
                    color: '#ffffff', fontSize: '13px', fontWeight: 700, margin: '0 0 6px',
                    fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {title}
                </h3>
                {description && (
                    <p style={{
                        color: 'rgba(255,255,255,0.40)', fontSize: '11.5px', margin: '0 0 14px',
                        lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {description}
                    </p>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ color: '#E8490F', fontSize: '17px', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                        {sym}{(price?.amount || 0).toLocaleString('en-IN')}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '9.5px', letterSpacing: '1.5px', fontFamily: "'Inter', sans-serif" }}>
                        {price?.currency || 'INR'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ── Loading skeleton card ─────────────────────────────────────────────────────
const SkeletonCard = ({ index }) => (
    <div style={{
        background: '#161616', border: '1px solid #1e1e1e',
        borderRadius: '12px', overflow: 'hidden',
        animation: 'skeletonPulse 1.6s ease-in-out infinite',
        animationDelay: `${index * 0.12}s`,
    }}>
        <div style={{ width: '100%', aspectRatio: '3/4', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <div style={{ height: '13px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', width: '68%' }} />
            <div style={{ height: '11px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
            <div style={{ height: '11px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', width: '55%' }} />
            <div style={{ height: '17px', background: 'rgba(232,73,15,0.10)', borderRadius: '4px', width: '38%', marginTop: '5px' }} />
        </div>
    </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.35)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid rgba(232,73,15,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" fill="none" stroke="rgba(232,73,15,0.5)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', letterSpacing: '2px', color: 'rgba(232,73,15,0.5)', margin: 0, fontWeight: 700 }}>NO PRODUCTS YET</p>
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'rgba(255,255,255,0.25)' }}>Be the first to list something amazing.</p>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ── Main Home Component ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const Home = () => {
    const { handleGetAllProducts } = useProduct();
    const products = useSelector((state) => state.product.products);
    const [centerIdx, setCenterIdx]   = useState(0);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // ── Google Fonts ──
    useEffect(() => {
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap';
        document.head.appendChild(link);
        return () => { if (document.head.contains(link)) document.head.removeChild(link); };
    }, []);

    // ── Smooth scroll on html ──
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.documentElement.style.overscrollBehaviorX = 'none'; // stop browser back/forward gesture
        return () => {
            document.documentElement.style.scrollBehavior = '';
            document.documentElement.style.overscrollBehaviorX = '';
        };
    }, []);

    // ── Fetch products ──
    useEffect(() => {
        handleGetAllProducts().finally(() => setLoadingProducts(false));
    }, []);

    const total = CAROUSEL_IMAGES.length;

    const visibleItems = [-2, -1, 0, 1, 2].map((pos) => {
        const idx = ((centerIdx + pos) % total + total) % total;
        return { ...CAROUSEL_IMAGES[idx], pos };
    });

    const prev = useCallback(() => setCenterIdx((c) => (c - 1 + total) % total), [total]);
    const next = useCallback(() => setCenterIdx((c) => (c + 1) % total), [total]);

    // ── Drag / Swipe / Touchpad ──────────────────────────────────────
    const [grabbing, setGrabbing] = useState(false);
    const dragStartX  = useRef(null);
    const dragStartY  = useRef(null);
    const lastSlideAt = useRef(0);
    const carouselRef = useRef(null);   // ref to the image strip element
    const THRESHOLD   = 45;
    const WHEEL_CD    = 500;            // ms cooldown between wheel-triggered slides

    // Document-level mouseup — fires even when pointer leaves the strip
    useEffect(() => {
        const onUp = (e) => {
            if (dragStartX.current === null) return;
            const delta = dragStartX.current - e.clientX;
            if (Math.abs(delta) > THRESHOLD) delta > 0 ? next() : prev();
            dragStartX.current = null;
            setGrabbing(false);
        };
        document.addEventListener('mouseup', onUp);
        return () => document.removeEventListener('mouseup', onUp);
    }, [next, prev]);

    const handleMouseDown = (e) => {
        e.preventDefault(); // stop any default browser drag behaviour
        dragStartX.current = e.clientX;
        setGrabbing(true);
    };

    // Native (non-passive) listeners — the ONLY way to call preventDefault()
    // and actually block the browser's back/forward navigation gesture.
    // React synthetic onWheel / onTouch events are passive in React 17+ → they CANNOT block navigation.
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const onWheel = (e) => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore vertical scroll
            e.preventDefault(); // ← blocks browser back/forward — only works with passive:false
            const now = Date.now();
            if (now - lastSlideAt.current < WHEEL_CD) return;
            if      (e.deltaX >  20) { next(); lastSlideAt.current = now; }
            else if (e.deltaX < -20) { prev(); lastSlideAt.current = now; }
        };

        const onTouchStart = (e) => {
            dragStartX.current = e.touches[0].clientX;
            dragStartY.current = e.touches[0].clientY;
        };

        // Block horizontal browser navigation during horizontal touch swipe
        const onTouchMove = (e) => {
            if (dragStartX.current === null) return;
            const dx = Math.abs(e.touches[0].clientX - dragStartX.current);
            const dy = Math.abs(e.touches[0].clientY - (dragStartY.current ?? 0));
            if (dx > dy && dx > 8) e.preventDefault(); // horizontal → block nav
        };

        const onTouchEnd = (e) => {
            if (dragStartX.current === null) return;
            const delta = dragStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(delta) > THRESHOLD) delta > 0 ? next() : prev();
            dragStartX.current = null;
            dragStartY.current = null;
        };

        el.addEventListener('wheel',      onWheel,      { passive: false });
        el.addEventListener('touchstart', onTouchStart, { passive: true  });
        el.addEventListener('touchmove',  onTouchMove,  { passive: false });
        el.addEventListener('touchend',   onTouchEnd,   { passive: true  });

        return () => {
            el.removeEventListener('wheel',      onWheel);
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove',  onTouchMove);
            el.removeEventListener('touchend',   onTouchEnd);
        };
    }, [next, prev]);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#0d0d0d' }}>

            {/* ── Inline CSS: keyframes + global smooth scroll ── */}
            <style>{`
                @keyframes imgCrossfade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                @keyframes heroFade {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                @keyframes skeletonPulse {
                    0%, 100% { opacity: 1;    }
                    50%       { opacity: 0.45; }
                }
                html { scroll-behavior: smooth; }
                * { box-sizing: border-box; }
            `}</style>

            {/* ═══════════════════════════════════════
                SECTION 1 — HERO
            ═══════════════════════════════════════ */}
            <section
                style={{
                    minHeight: '100vh',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                    backgroundImage: "url('/background.png')",
                    backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat',
                    userSelect: 'none',
                }}
            >
                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(155deg, rgba(13,13,13,0.94) 0%, rgba(13,13,13,0.85) 55%, rgba(13,13,13,0.94) 100%)',
                    zIndex: 0,
                }} />

                {/* Hero content */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '100%', padding: '0 40px',
                    animation: 'heroFade 0.9s ease both',
                }}>

                    {/* Brand title */}
                    <h1 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '52px', fontWeight: 900, letterSpacing: '14px',
                        color: '#E8490F', textAlign: 'center', margin: '0 0 14px',
                        lineHeight: 1.1,
                        textShadow: '0 0 60px rgba(232,73,15,0.35), 0 2px 12px rgba(0,0,0,0.6)',
                    }}>
                        VASTRA BHANDAR
                    </h1>

                    <div style={{ marginBottom: '24px' }}><Decorator /></div>

                    {/* Quote */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'italic', fontWeight: 300,
                        fontSize: '18.5px', color: 'rgba(255,255,255,0.65)',
                        textAlign: 'center', lineHeight: 1.8, letterSpacing: '0.3px',
                        margin: '0 0 44px',
                    }}>
                        "Style is a way to say who you are<br />without having to speak."
                    </p>

                    {/* ── Carousel ── */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '28px', width: '100%', maxWidth: '1020px',
                    }}>
                        <ArrowBtn onClick={prev} direction="prev" />

                        {/* Image strip — ref'd for non-passive native event listeners */}
                        <div
                            ref={carouselRef}
                            onMouseDown={handleMouseDown}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '10px', flex: 1,
                                cursor: grabbing ? 'grabbing' : 'grab',
                                touchAction: 'none', // hand all touch events to JS
                                userSelect: 'none',
                            }}
                        >
                            {visibleItems.map(({ id, src, alt, pos }) => {
                                const cfg      = SLOT_CONFIG[String(pos)];
                                const isCenter = pos === 0;
                                return (
                                    // Stable slot — DOM element stays, only image inside changes
                                    <div
                                        key={pos}
                                        style={{
                                            height: `${cfg.h}px`,
                                            width: `${cfg.w}px`,
                                            flexShrink: 0,
                                            opacity: cfg.opacity,
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            // GPU-accelerated smooth transition for size/opacity
                                            transition: 'height 0.50s cubic-bezier(0.4,0,0.2,1), width 0.50s cubic-bezier(0.4,0,0.2,1), opacity 0.50s cubic-bezier(0.4,0,0.2,1), box-shadow 0.50s cubic-bezier(0.4,0,0.2,1)',
                                            willChange: 'height, width, opacity',
                                            boxShadow: isCenter
                                                ? '0 0 0 2px rgba(232,73,15,0.80), 0 16px 48px rgba(0,0,0,0.65)'
                                                : '0 6px 20px rgba(0,0,0,0.45)',
                                        }}
                                    >
                                        <CrossFadeImage src={src} alt={alt} />
                                        {/* Dark vignette on non-center */}
                                        {!isCenter && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,16,38,0.18)', pointerEvents: 'none', zIndex: 3 }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <ArrowBtn onClick={next} direction="next" />
                    </div>

                    {/* Dot indicators */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '24px' }}>
                        {CAROUSEL_IMAGES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCenterIdx(i)}
                                style={{
                                    width: i === centerIdx ? '20px' : '6px',
                                    height: '6px', borderRadius: '3px', border: 'none', padding: 0, cursor: 'pointer',
                                    background: i === centerIdx ? '#E8490F' : 'rgba(232,73,15,0.30)',
                                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Tagline */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '11px', fontWeight: 700, letterSpacing: '5px',
                        color: '#E8490F', textAlign: 'center',
                        margin: '36px 0 14px', opacity: 0.90,
                    }}>
                        CLOTHES THAT SPEAK. STYLE THAT STAYS.
                    </p>
                    <Decorator />

                    {/* Scroll hint */}
                    <button
                        onClick={() => document.getElementById('vb-products')?.scrollIntoView()}
                        style={{
                            marginTop: '32px', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.35)', transition: 'color 0.25s',
                            animation: 'fadeUp 1s ease 0.6s both',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#c9a84c'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                    >
                        <span style={{ fontSize: '10px', letterSpacing: '3px' }}>EXPLORE</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
                            style={{ animation: 'bounce 1.8s ease-in-out infinite' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECTION 2 — PRODUCTS GRID
            ═══════════════════════════════════════ */}
            <section
                id="vb-products"
                style={{
                    background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
                    padding: '90px 60px 100px',
                    borderTop: '1px solid rgba(232,73,15,0.08)',
                }}
            >
                {/* Section heading */}
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <p style={{ color: 'rgba(232,73,15,0.65)', fontSize: '10px', letterSpacing: '5px', margin: '0 0 14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                        CURATED FOR YOU
                    </p>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '32px', fontWeight: 900, letterSpacing: '6px',
                        color: '#ffffff', margin: '0 0 18px',
                    }}>
                        FEATURED COLLECTION
                    </h2>
                    <Decorator />
                    {!loadingProducts && products?.length > 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', marginTop: '14px', letterSpacing: '1px' }}>
                            {products.length} {products.length === 1 ? 'piece' : 'pieces'} available
                        </p>
                    )}
                </div>

                {/* Grid */}
                {loadingProducts ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '24px', maxWidth: '1200px', margin: '0 auto',
                    }}>
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
                    </div>
                ) : !products?.length ? (
                    <EmptyState />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '24px', maxWidth: '1200px', margin: '0 auto',
                    }}>
                        {products.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                )}

                {/* Section bottom decorator */}
                {!loadingProducts && products?.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '64px' }}>
                        <Decorator />
                        <p style={{ color: 'rgba(232,73,15,0.45)', fontSize: '10px', letterSpacing: '4px', marginTop: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                            MORE COMING SOON
                        </p>
                    </div>
                )}
            </section>

            {/* Footer strip */}
            <footer style={{
                background: '#080808',
                borderTop: '1px solid rgba(232,73,15,0.08)',
                padding: '28px 40px',
                textAlign: 'center',
            }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.20)', fontSize: '11px', letterSpacing: '3px', margin: 0, fontWeight: 600 }}>
                    © 2025 VASTRA <span style={{ color: '#E8490F' }}>BHANDAR</span> — ALL RIGHTS RESERVED
                </p>
            </footer>
        </div>
    );
};

export default Home;