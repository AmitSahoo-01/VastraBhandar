import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';

/* ── Inline styles — black + orange palette ───────────────────────────────── */
const S = {
    page:   { minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Inter', sans-serif" },
    card:   { display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '900px', minHeight: '560px', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.85)', border: '1px solid rgba(232,73,15,0.12)' },
    left:   { width: '42%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
    right:  { flex: 1, background: '#111111', borderLeft: '1px solid rgba(232,73,15,0.10)', padding: '36px 40px', display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' },
    overlay:{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,0.40) 100%)', zIndex: 1 },
    content:{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', padding: '28px' },
    inputWrap: { display:'flex', alignItems:'center', background:'rgba(255,255,255,0.04)', border:'1px solid #2a2a2a', borderRadius:'10px', padding:'0 14px', height:'46px', transition:'border-color 0.2s, box-shadow 0.2s' },
    input:  { flex:1, background:'transparent', border:'none', outline:'none', color:'#ffffff', fontSize:'13px', fontFamily:"'Inter', sans-serif" },
    label:  { color:'#bbbbbb', fontSize:'11.5px', fontWeight:600, letterSpacing:'0.5px', marginBottom:'7px', display:'block' },
};

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [focusField, setFocusField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await handleLogin(form);
            if (user.role === 'buyer') navigate('/');
            else navigate('/seller/dashboard');
        } catch (error) {
            console.error(error, 'login failed');
        }
    };

    const focusBorder = { borderColor: '#E8490F', boxShadow: '0 0 0 2px rgba(232,73,15,0.12)' };

    return (
        <div style={S.page}>
            <div style={S.card}>

                {/* ── LEFT — Hero panel ── */}
                <div style={S.left}>
                    <div style={{ position:'absolute', inset:0, backgroundImage:"url('/model.jpg')", backgroundSize:'cover', backgroundPosition:'center top' }} />
                    <div style={S.overlay} />
                    <div style={S.content}>
                        {/* Brand */}
                        <div style={{ marginBottom:'auto' }}>
                            <div style={{ fontSize:'24px', fontWeight:900, color:'#E8490F', letterSpacing:'3px', lineHeight:1.1 }}>
                                VASTRA
                            </div>
                            <div style={{ fontSize:'20px', fontWeight:900, color:'#E8490F', letterSpacing:'2px' }}>
                                BHANDAR
                            </div>
                            <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.35)', letterSpacing:'3px', marginTop:'5px', fontWeight:600 }}>
                                WEAR YOUR IDENTITY
                            </div>
                        </div>

                        {/* Hero text */}
                        <div>
                            <h2 style={{ fontSize:'42px', fontWeight:900, color:'rgba(255,255,255,0.92)', letterSpacing:'2px', margin:'0 0 0', lineHeight:1, fontFamily:"'Inter', sans-serif" }}>JOIN THE</h2>
                            <h2 style={{ fontSize:'50px', fontWeight:900, color:'#E8490F', letterSpacing:'2px', margin:'4px 0 28px', lineHeight:1, textShadow:'0 0 40px rgba(232,73,15,0.50)', fontFamily:"'Inter', sans-serif" }}>CULTURE</h2>
                            <p style={{ fontStyle:'italic', color:'rgba(255,255,255,0.50)', fontSize:'14px', lineHeight:1.7, margin:0, fontFamily:"'Inter', sans-serif" }}>
                                Streetwear. Minimal. Timeless.<br />
                                Discover curated fashion<br />designed for the next generation.
                            </p>
                        </div>

                        {/* Bottom badges */}
                        <div style={{ display:'flex', justifyContent:'space-around', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:'32px' }}>
                            {[
                                { label:'PREMIUM\nQUALITY', icon: <path d="M12 8l1.12 3.44H17l-2.88 2.1L15.24 17 12 14.88 8.76 17l1.12-3.46L7 11.44h3.88z" fill="#E8490F" stroke="none" /> },
                                { label:'EASY\nRETURNS', icon: <><path d="M9 14l-4-4 4-4"/><path d="M5 10h11a4 4 0 0 1 0 8h-1"/></> },
                                { label:'FAST\nDELIVERY', icon: <><rect x="1" y="6" width="15" height="10" rx="2"/><path d="M16 10h4l3 3v3a2 2 0 0 1-2 2h-1"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></> },
                            ].map(({ label, icon }) => (
                                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
                                    <div style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid rgba(232,73,15,0.25)', background:'rgba(232,73,15,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <svg width="18" height="18" fill="none" stroke="#E8490F" strokeWidth="1.5" viewBox="0 0 24 24">{icon}</svg>
                                    </div>
                                    <span style={{ fontSize:'8px', color:'rgba(255,255,255,0.40)', letterSpacing:'1.5px', textAlign:'center', whiteSpace:'pre-line', fontWeight:700 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT — Form panel ── */}
                <div style={S.right}>
                    {/* Logo */}
                    <div style={{ position:'absolute', top:'20px', right:'24px' }}>
                        <img src="/favicon.png" alt="VB" style={{ width:'38px', height:'38px', objectFit:'contain', opacity:0.85 }} />
                    </div>

                    {/* Heading */}
                    <h1 style={{ fontSize:'26px', fontWeight:900, color:'#ffffff', margin:'0 0 6px', fontFamily:"'Inter', sans-serif" }}>
                        Welcome Back
                    </h1>
                    <p style={{ color:'rgba(255,255,255,0.40)', fontSize:'13px', margin:'0 0 28px', lineHeight:1.5 }}>
                        Sign in to access your curated style profile.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

                        {/* Email */}
                        <div>
                            <label style={S.label}>Email Address</label>
                            <div style={{ ...S.inputWrap, ...(focusField === 'email' ? focusBorder : {}) }}>
                                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginRight:'10px', flexShrink:0 }}>
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input style={S.input} type="email" name="email" placeholder="Enter your email"
                                    value={form.email} onChange={handleChange}
                                    onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)} required />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={S.label}>Password</label>
                            <div style={{ ...S.inputWrap, ...(focusField === 'password' ? focusBorder : {}) }}>
                                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginRight:'10px', flexShrink:0 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input style={S.input} type={showPass ? 'text' : 'password'} name="password" placeholder="Enter your password"
                                    value={form.password} onChange={handleChange}
                                    onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)} required />
                                <button type="button" onClick={() => setShowPass(v => !v)}
                                    style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', display:'flex', color:'rgba(255,255,255,0.30)' }}>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        {showPass
                                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                            : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Google */}
                        <a href="http://localhost:3000/api/auth/google" style={{ display:'block', textDecoration:'none' }}>
                            <button type="button" style={{ width:'100%', height:'46px', background:'rgba(255,255,255,0.97)', border:'none', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontSize:'13px', fontWeight:700, color:'#222', fontFamily:"'Inter', sans-serif" }}>
                                <svg style={{ width:'18px', height:'18px' }} viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Continue with Google
                            </button>
                        </a>

                        {/* Submit */}
                        <button id="login-submit" type="submit"
                            style={{ height:'46px', background:'#E8490F', border:'none', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontSize:'13px', fontWeight:700, color:'#fff', fontFamily:"'Inter', sans-serif", letterSpacing:'0.5px', transition:'all 0.2s', boxShadow:'0 8px 24px rgba(232,73,15,0.30)' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#c73a0a'; e.currentTarget.style.transform='translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#E8490F'; e.currentTarget.style.transform='translateY(0)'; }}>
                            Sign In
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                    </form>

                    {/* Register link */}
                    <p style={{ textAlign:'center', color:'rgba(255,255,255,0.35)', fontSize:'12px', marginTop:'24px' }}>
                        Don't have an account?{' '}
                        <a href="/register" style={{ color:'#E8490F', fontWeight:700, textDecoration:'none' }}>
                            Register
                        </a>
                    </p>

                    {/* Footer */}
                    <div style={{ marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
                        <div style={{ fontSize:'10px', letterSpacing:'3px', color:'rgba(255,255,255,0.20)', fontWeight:700 }}>
                            VASTRA <span style={{ color:'#E8490F' }}>BHANDAR</span>
                        </div>
                        <div style={{ fontSize:'9px', letterSpacing:'1.5px', color:'rgba(255,255,255,0.12)', marginTop:'4px' }}>
                            STYLE IS NOT BOUGHT, IT'S OWNED.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;