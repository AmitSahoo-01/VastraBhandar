import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const shopLinks = [
        { label: 'New Arrivals', path: '/' },
        { label: 'Men', path: '/' },
        { label: 'Women', path: '/' },
        { label: 'Collections', path: '/' },
        { label: 'Sale', path: '/' },
        { label: 'Gift Cards', path: '/' },
        { label: 'Lookbook', path: '/' },
    ];

    const helpLinks = [
        { label: 'FAQs', path: '/' },
        { label: 'Shipping & Delivery', path: '/' },
        { label: 'Returns & Exchanges', path: '/' },
        { label: 'Size Guide', path: '/' },
        { label: 'Track Order', path: '/' },
        { label: 'Contact Us', path: '/' },
    ];

    const socialLinks = [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'Facebook', href: 'https://facebook.com' },
        { label: 'Pinterest', href: 'https://pinterest.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'Twitter', href: 'https://twitter.com' },
        { label: 'YouTube', href: 'https://youtube.com' },
    ];

    return (
        <footer style={{ fontFamily: "'Inter', sans-serif", background: '#0d0d0d', color: '#ffffff', overflow: 'hidden', width: '100%' }}>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div style={{ width: '100%', padding: '80px 48px 48px', overflow: 'hidden' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '48px', marginBottom: '60px', width: '100%' }}>
                    <div>
                        <h2 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', color: '#ffffff', margin: 0 }}>
                            Dress well.<br />
                            Feel great.<br />
                            Every day.
                        </h2>
                    </div>
                    <div>
                        <p style={{ fontSize: '15px', color: '#9ca3af', maxWidth: '440px', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                            Your style, your story. Explore timeless pieces, crafted for comfort and designed to make you look and feel your best — whenever, wherever.
                        </p>
                    </div>
                </div>

                {/* Polaroid Photo Mosaic Row — Full Width Edge to Edge, No Scrollbars */}
                <div className="no-scrollbar" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', position: 'relative', minHeight: '360px', width: '100%', overflow: 'hidden', paddingBottom: '10px', marginBottom: '80px' }}>
                    {/* Card 1 */}
                    <div
                        style={{
                            width: '210px',
                            height: '240px',
                            background: '#ffffff',
                            padding: '8px 8px 24px 8px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            transform: 'rotate(-5deg) translateY(20px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-5deg) translateY(20px)'}
                    >
                        <img
                            src="/4p.png"
                            alt="Store Interior"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>

                    {/* Card 2: Tag "Less is More" */}
                    <div
                        style={{
                            width: '210px',
                            height: '160px',
                            background: '#1c1c1c',
                            border: '1px solid #333333',
                            borderRadius: '8px',
                            padding: '16px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            transform: 'rotate(-10deg) translateY(35px) translateX(-20px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            color: '#ffffff',
                            textAlign: 'center',
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-10deg) translateY(35px) translateX(-20px)'}
                    >
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #555', marginBottom: '12px' }} />
                        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '3px', color: '#e5e2da' }}>VASTRA BHANDAR</span>
                        <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '3px', color: '#ffffff', marginTop: '2px' }}>.In</span>
                        <span style={{ fontSize: '8px', color: '#6b7280', letterSpacing: '2px', marginTop: '12px' }}>EST. 2026</span>
                    </div>

                    {/* Card 3: Address Card */}
                    <div
                        style={{
                            width: '220px',
                            height: '220px',
                            background: '#ffffff',
                            padding: '8px 8px 24px 8px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            transform: 'rotate(-2deg) translateY(10px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-2deg) translateY(10px)'}
                    >
                        <img
                            src="/5p.png"
                            alt="Address Card"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>

                    {/* Card 4 */}
                    <div
                        style={{
                            width: '220px',
                            height: '210px',
                            background: '#ffffff',
                            padding: '8px 8px 24px 8px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            transform: 'rotate(4deg) translateY(25px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(4deg) translateY(25px)'}
                    >
                        <img
                            src="/3p.png"
                            alt="Collar Tag"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>

                    {/* Card 5: Tall Vertical Card Touching Top Text (Matching Reference Image) */}
                    <div
                        style={{
                            width: '230px',
                            height: '350px',
                            background: '#ffffff',
                            padding: '10px 10px 30px 10px',
                            borderRadius: '4px',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
                            transform: 'translateY(-20px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            zIndex: 10,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-32px) scale(1.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-20px)'}
                    >
                        <img
                            src="/2p.png"
                            alt="Hanging Rack"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>

                    {/* Card 6 */}
                    <div
                        style={{
                            width: '220px',
                            height: '250px',
                            background: '#ffffff',
                            padding: '8px 8px 24px 8px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            transform: 'rotate(7deg) translateY(15px)',
                            transition: 'all 0.4s ease',
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px) scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(7deg) translateY(15px)'}
                    >
                        <img
                            src="/1p.png"
                            alt="Folded Knits"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>
                </div>

                {/* Bottom Brand & Navigation Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 2fr)', gap: '64px', marginBottom: '72px', width: '100%' }}>
                    {/* Left Brand Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Teardrop icon */}
                        <div style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="32" height="38" viewBox="0 0 24 30" fill="none" stroke="#ffffff" strokeWidth="1.8">
                                <path d="M12 2C12 2 3 13 3 19A9 9 0 0 0 21 19C21 13 12 2 12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Tagline */}
                        <h3 style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', color: '#ffffff', margin: 0 }}>
                            Wear your vibe.<br />
                            Live your style.<br />
                            <span style={{ color: '#6b7280' }}>Repeat.</span>
                        </h3>
                    </div>

                    {/* Right Navigation Columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                        {/* SHOP */}
                        <div>
                            <h4 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#ffffff', textTransform: 'uppercase', margin: '0 0 20px' }}>
                                SHOP
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {shopLinks.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            to={item.path}
                                            style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 400, transition: 'color 0.2s ease' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#CA2945'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* HELP */}
                        <div>
                            <h4 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#ffffff', textTransform: 'uppercase', margin: '0 0 20px' }}>
                                HELP
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {helpLinks.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            to={item.path}
                                            style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 400, transition: 'color 0.2s ease' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#CA2945'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* FOLLOW US */}
                        <div>
                            <h4 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#ffffff', textTransform: 'uppercase', margin: '0 0 20px' }}>
                                FOLLOW US
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {socialLinks.map((item, i) => (
                                    <li key={i}>
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 400, transition: 'color 0.2s ease' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#CA2945'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Strip */}
                <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '2px', margin: 0, fontWeight: 600 }}>
                        © 2026 VASTRA <span style={{ color: '#CA2945' }}>BHANDAR</span> — ALL RIGHTS RESERVED
                    </p>
                    <p style={{ color: '#4b5563', fontSize: '11px', margin: 0 }}>
                        Crafted for Culture
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
