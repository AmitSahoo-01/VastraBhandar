import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

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

// ── Crimson decorator ────────────────────────────────────────────────────────
const Decorator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '90px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(202,41,69,0.65))' }} />
        <div style={{ width: '7px', height: '7px', background: '#CA2945', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(202,41,69,0.4)', flexShrink: 0 }} />
        <div style={{ width: '90px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(202,41,69,0.65))' }} />
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
                border: `1.5px solid ${hov ? '#CA2945' : '#e5e7eb'}`,
                background: hov ? 'rgba(202,41,69,0.08)' : '#ffffff',
                color: hov ? '#CA2945' : '#374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', outline: 'none',
                transition: 'all 0.30s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hov ? 'scale(1.12)' : 'scale(1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
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
const CrossFadeImage = ({ src, alt }) => {
    const [current,  setCurrent]  = useState(src);
    const [previous, setPrevious] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (src === current) return;
        clearTimeout(timerRef.current);
        setPrevious(current);
        setCurrent(src);
        timerRef.current = setTimeout(() => setPrevious(null), 500);
        return () => clearTimeout(timerRef.current);
    }, [src]);

    return (
        <>
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

// ── Loading skeleton card ─────────────────────────────────────────────────────
const SkeletonCard = ({ index }) => (
    <div style={{
        background: '#ffffff', border: '1px solid #e5e7eb',
        borderRadius: '14px', overflow: 'hidden',
        animation: 'skeletonPulse 1.6s ease-in-out infinite',
        animationDelay: `${index * 0.12}s`,
    }}>
        <div style={{ width: '100%', aspectRatio: '3/4', background: '#f3f4f6' }} />
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <div style={{ height: '13px', background: '#e5e7eb', borderRadius: '4px', width: '68%' }} />
            <div style={{ height: '11px', background: '#f3f4f6', borderRadius: '4px' }} />
            <div style={{ height: '11px', background: '#f3f4f6', borderRadius: '4px', width: '55%' }} />
            <div style={{ height: '17px', background: 'rgba(202,41,69,0.10)', borderRadius: '4px', width: '38%', marginTop: '5px' }} />
        </div>
    </div>
);

// ── Story Editorial Section ──────────────────────────────────────────────────
const StorySection = () => {
    const [activeStackIdx, setActiveStackIdx] = useState(0);

    const STACK_IMAGES = [
        {
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
            alt: "Editorial Fashion 1",
            bw: true,
        },
        {
            url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
            alt: "Editorial Fashion 2",
            bw: false,
        },
        {
            url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
            alt: "Editorial Fashion 3",
            bw: true,
        },
        {
            url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
            alt: "Editorial Fashion 4",
            bw: false,
        },
    ];

    const scrollToProducts = () => {
        document.getElementById('vb-products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="vb-story"
            style={{
                background: '#1a1918',
                color: '#d6c6b0',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 80px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '1360px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)',
                    gap: '64px',
                    alignItems: 'center',
                }}
            >
                {/* LEFT CONTENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', zIndex: 10 }}>
                    <h2
                        style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '76px',
                            fontWeight: 400,
                            lineHeight: 1.02,
                            letterSpacing: '-1.5px',
                            color: '#d6c6b0',
                            margin: 0,
                        }}
                    >
                        Become<br />part of a<br />great Story
                    </h2>

                    <p style={{ color: '#8e867b', fontSize: '15px', margin: 0, letterSpacing: '0.2px', fontWeight: 400 }}>
                        Architecture informs the approach to design.
                    </p>

                    <button
                        onClick={scrollToProducts}
                        style={{
                            width: 'fit-content',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            border: '1px solid #d6c6b0',
                            background: 'transparent',
                            color: '#d6c6b0',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            marginTop: '12px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d6c6b0';
                            e.currentTarget.style.borderColor = '#d6c6b0';
                            e.currentTarget.style.color = '#1a1918';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(214, 198, 176, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#d6c6b0';
                            e.currentTarget.style.color = '#d6c6b0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Explore Collection
                    </button>
                </div>

                {/* RIGHT OVERLAPPING CARDS STACK */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div
                        style={{
                            height: '520px',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {STACK_IMAGES.map((img, idx) => {
                            const isHovered = activeStackIdx === idx;
                            const offsetLeft = idx * 115;
                            const zIndex = 10 - idx;
                            const width = 370 - idx * 30;
                            const height = 490 - idx * 35;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setActiveStackIdx(idx)}
                                    onMouseEnter={() => setActiveStackIdx(idx)}
                                    style={{
                                        position: 'absolute',
                                        left: `${offsetLeft}px`,
                                        width: `${width}px`,
                                        height: `${height}px`,
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                        zIndex: isHovered ? 20 : zIndex,
                                        boxShadow: isHovered
                                            ? '0 28px 56px rgba(0, 0, 0, 0.75), 0 0 0 2px rgba(214, 198, 176, 0.6)'
                                            : '0 16px 36px rgba(0, 0, 0, 0.55)',
                                        transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        cursor: 'pointer',
                                        filter: img.bw ? (isHovered ? 'grayscale(0%)' : 'grayscale(100%)') : 'none',
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.alt}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                        draggable={false}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: isHovered
                                                ? 'transparent'
                                                : `rgba(0,0,0, ${0.15 + idx * 0.1})`,
                                            transition: 'background 0.3s ease',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Progress Bar / Indicator */}
                    <div style={{ width: '100%', maxWidth: '660px', height: '2px', background: '#2d2b28', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${((activeStackIdx + 1) / STACK_IMAGES.length) * 100}%`,
                                background: '#d6c6b0',
                                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

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

    // ── Auto-slide carousel infinitely every 2 seconds ──
    useEffect(() => {
        const timer = setInterval(() => {
            next();
        }, 2000);
        return () => clearInterval(timer);
    }, [next]);

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
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#ffffff', color: '#111827' }}>

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
                    backgroundImage: 'url(/background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    userSelect: 'none',
                }}
            >
                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    // background: 'linear-gradient(155deg, rgba(255,255,255,0.75) 0%, rgba(248,249,250,0.65) 55%, rgba(255,255,255,0.75) 100%)',
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
                        color: '#CA2945', textAlign: 'center', margin: '0 0 14px',
                        lineHeight: 1.1,
                    }}>
                        {/* VASTRA BHANDAR */}
                    </h1>

                    {/* <div style={{ marginBottom: '24px' }}><Decorator /></div> */}

                    {/* Quote */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '32px', fontWeight: 900, letterSpacing: '14px',
                        color: '#CA2945', textAlign: 'center', margin: '0 0 14px',
                        lineHeight: 1.1,
                    }}>
                        {/* VASTRA <br></br>
                        BHANDAR */}
                    </p>

                    {/* ── Carousel ── */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '28px', width: '100%', maxWidth: '1020px',
                    }}>
                        <ArrowBtn onClick={prev} direction="prev" />

                        {/* Image strip */}
                        <div
                            ref={carouselRef}
                            onMouseDown={handleMouseDown}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '10px', flex: 1,
                                cursor: grabbing ? 'grabbing' : 'grab',
                                touchAction: 'none',
                                userSelect: 'none',
                            }}
                        >
                            {visibleItems.map(({ id, src, alt, pos }) => {
                                const cfg      = SLOT_CONFIG[String(pos)];
                                const isCenter = pos === 0;
                                return (
                                    <div
                                        key={pos}
                                        style={{
                                            height: `${cfg.h}px`,
                                            width: `${cfg.w}px`,
                                            flexShrink: 0,
                                            opacity: cfg.opacity,
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            transition: 'height 0.50s cubic-bezier(0.4,0,0.2,1), width 0.50s cubic-bezier(0.4,0,0.2,1), opacity 0.50s cubic-bezier(0.4,0,0.2,1), box-shadow 0.50s cubic-bezier(0.4,0,0.2,1)',
                                            willChange: 'height, width, opacity',
                                            boxShadow: isCenter
                                                ? '0 0 0 2px #CA2945, 0 16px 40px rgba(0,0,0,0.12)'
                                                : '0 6px 16px rgba(0,0,0,0.06)',
                                        }}
                                    >
                                        <CrossFadeImage src={src} alt={alt} />
                                        {!isCenter && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.25)', pointerEvents: 'none', zIndex: 3 }} />
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
                                    background: i === centerIdx ? '#CA2945' : 'rgba(202,41,69,0.25)',
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
                        color: '#CA2945', textAlign: 'center',
                        margin: '36px 0 14px', opacity: 0.90,
                    }}>
                        CLOTHES THAT SPEAK. STYLE THAT STAYS.
                    </p>
                    <Decorator />

                    {/* Scroll hint */}
                    <button
                        onClick={() => document.getElementById('vb-story')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            marginTop: '32px', background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            color: '#6b7280', transition: 'color 0.25s',
                            animation: 'fadeUp 1s ease 0.6s both',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#CA2945'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                    >
                        <span style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 700 }}>EXPLORE</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
                            style={{ animation: 'bounce 1.8s ease-in-out infinite' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECTION 2 — EDITORIAL STORY (MATCHING REFERENCE UI)
            ═══════════════════════════════════════ */}
            <StorySection />

            {/* ═══════════════════════════════════════
                SECTION 3 — PRODUCTS GRID
            ═══════════════════════════════════════ */}
            <section
                id="vb-products"
                style={{
                    background: '#ffffff',
                    padding: '90px 60px 100px',
                    borderTop: '1px solid #e5e7eb',
                }}
            >
                {/* Section heading */}
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <p style={{ color: '#CA2945', fontSize: '10px', letterSpacing: '5px', margin: '0 0 14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                        CURATED FOR YOU
                    </p>
                    <h2 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '32px', fontWeight: 900, letterSpacing: '6px',
                        color: '#111827', margin: '0 0 18px',
                    }}>
                        FEATURED COLLECTION
                    </h2>
                    <Decorator />
                    {!loadingProducts && products?.length > 0 && (
                        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '14px', letterSpacing: '1px' }}>
                            {products.length} {products.length === 1 ? 'piece' : 'pieces'} available
                        </p>
                    )}
                </div>

                {/* Grid */}
                {loadingProducts ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '28px', maxWidth: '1200px', margin: '0 auto',
                    }}>
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
                    </div>
                ) : !products?.length ? (
                    <EmptyState />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '28px', maxWidth: '1200px', margin: '0 auto',
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
                        <p style={{ color: '#CA2945', fontSize: '10px', letterSpacing: '4px', marginTop: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                            MORE COMING SOON
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;