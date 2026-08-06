import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';

const S = {
    page:     { minHeight:'100vh', background:'#f8f9fa', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'16px', fontFamily:"'Inter', sans-serif" },
    card:     { display:'flex', flexDirection:'row', width:'100%', maxWidth:'900px', minHeight:'600px', borderRadius:'18px', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb', background:'#ffffff' },
    left:     { width:'42%', position:'relative', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 },
    right:    { flex:1, background:'#ffffff', borderLeft:'1px solid #f0f0f0', padding:'32px 38px', display:'flex', flexDirection:'column', overflowY:'auto', position:'relative' },
    overlay:  { position:'absolute', inset:0, background:'linear-gradient(to top, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.30) 100%)', zIndex:1 },
    content:  { position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%', padding:'28px' },
    inputWrap:{ display:'flex', alignItems:'center', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'0 14px', height:'46px', transition:'border-color 0.2s, box-shadow 0.2s' },
    input:    { flex:1, background:'transparent', border:'none', outline:'none', color:'#111827', fontSize:'13px', fontFamily:"'Inter', sans-serif" },
    label:    { color:'#374151', fontSize:'11.5px', fontWeight:600, letterSpacing:'0.5px', marginBottom:'7px', display:'block' },
};

const Register = () => {
    const [form, setForm] = useState({ fullname:'', contact:'', email:'', password:'', isSeller:false });
    const [showPass, setShowPass] = useState(false);
    const [focusField, setFocusField] = useState(null);
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    const handleRole = (isSeller) => setForm(prev => ({ ...prev, isSeller }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister(form);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    const focusBorder = { borderColor:'#CA2945', boxShadow:'0 0 0 2px rgba(202,41,69,0.12)' };

    const fields = [
        { key:'fullname', label:'Full Name',       type:'text',     placeholder:'Enter your full name',       icon:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
        { key:'contact',  label:'Contact Number',  type:'tel',      placeholder:'Enter your contact number',  icon:<path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/> },
        { key:'email',    label:'Email Address',   type:'email',    placeholder:'Enter your email address',   icon:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
    ];

    return (
        <div style={S.page}>
            <div style={S.card}>

                {/* ── LEFT ── */}
                <div style={S.left}>
                    <div style={{ position:'absolute', inset:0, backgroundImage:"url('/model.jpg')", backgroundSize:'cover', backgroundPosition:'center top' }} />
                    <div style={S.overlay} />
                    <div style={S.content}>
                        <div style={{ marginBottom:'auto' }}>
                            <div style={{ fontSize:'24px', fontWeight:900, color:'#CA2945', letterSpacing:'3px', lineHeight:1.1 }}>VASTRA</div>
                            <div style={{ fontSize:'20px', fontWeight:900, color:'#CA2945', letterSpacing:'2px' }}>BHANDAR</div>
                            <div style={{ fontSize:'8px', color:'#4b5563', letterSpacing:'3px', marginTop:'5px', fontWeight:600 }}>WEAR YOUR IDENTITY</div>
                        </div>

                        <div>
                            <h2 style={{ fontSize:'40px', fontWeight:900, color:'#111827', letterSpacing:'2px', margin:'0', lineHeight:1, fontFamily:"'Inter', sans-serif" }}>JOIN THE</h2>
                            <h2 style={{ fontSize:'48px', fontWeight:900, color:'#CA2945', letterSpacing:'2px', margin:'4px 0 24px', lineHeight:1, fontFamily:"'Inter', sans-serif" }}>CULTURE</h2>
                            <p style={{ fontStyle:'italic', color:'#4b5563', fontSize:'14px', lineHeight:1.7, margin:0 }}>
                                Join thousands of style-forward<br />shoppers and sellers.
                            </p>
                        </div>

                        <div style={{ display:'flex', justifyContent:'space-around', paddingTop:'20px', borderTop:'1px solid rgba(0,0,0,0.08)', marginTop:'28px' }}>
                            {[
                                { label:'PREMIUM\nQUALITY' },
                                { label:'EASY\nRETURNS' },
                                { label:'FAST\nDELIVERY' },
                            ].map(({ label }) => (
                                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                                    <div style={{ width:'34px', height:'34px', borderRadius:'8px', border:'1px solid rgba(202,41,69,0.25)', background:'rgba(202,41,69,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <div style={{ width:'8px', height:'8px', background:'#CA2945', borderRadius:'2px', transform:'rotate(45deg)' }} />
                                    </div>
                                    <span style={{ fontSize:'7.5px', color:'#6b7280', letterSpacing:'1.5px', textAlign:'center', whiteSpace:'pre-line', fontWeight:700 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div style={S.right}>
                    {/* Logo */}
                    <div style={{ position:'absolute', top:'20px', right:'24px' }}>
                        <img src="/favicon.png" alt="VB" style={{ width:'38px', height:'38px', objectFit:'contain', opacity:0.85 }} />
                    </div>

                    <h1 style={{ fontSize:'24px', fontWeight:900, color:'#111827', margin:'0 0 4px', fontFamily:"'Inter', sans-serif" }}>
                        Create Your <span style={{ color:'#CA2945' }}>Style</span> Account
                    </h1>
                    <p style={{ color:'#6b7280', fontSize:'12px', margin:'0 0 22px', lineHeight:1.5 }}>
                        Start your style journey with Vastra Bhandar.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

                        {/* Text fields */}
                        {fields.map(({ key, label, type, placeholder, icon }) => (
                            <div key={key}>
                                <label style={S.label}>{label}</label>
                                <div style={{ ...S.inputWrap, ...(focusField === key ? focusBorder : {}) }}>
                                    <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginRight:'10px', flexShrink:0 }}>{icon}</svg>
                                    <input style={S.input} type={type} name={key} placeholder={placeholder}
                                        value={form[key]} onChange={handleChange}
                                        onFocus={() => setFocusField(key)} onBlur={() => setFocusField(null)} required />
                                </div>
                            </div>
                        ))}

                        {/* Password */}
                        <div>
                            <label style={S.label}>Password</label>
                            <div style={{ ...S.inputWrap, ...(focusField === 'password' ? focusBorder : {}) }}>
                                <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginRight:'10px', flexShrink:0 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input style={S.input} type={showPass ? 'text' : 'password'} name="password" placeholder="Create a password"
                                    value={form.password} onChange={handleChange}
                                    onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)} required />
                                <button type="button" onClick={() => setShowPass(v => !v)}
                                    style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', color:'#9ca3af', display:'flex' }}>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        {showPass
                                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                            : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Role selector */}
                        <div>
                            <label style={S.label}>I am a</label>
                            <div style={{ display:'flex', gap:'10px' }}>
                                {[{ label:'🛒 Buyer', val:false, id:'role-buyer' }, { label:'🏪 Seller', val:true, id:'role-seller' }].map(({ label, val, id }) => {
                                    const active = form.isSeller === val;
                                    return (
                                        <button key={id} id={id} type="button" onClick={() => handleRole(val)}
                                            style={{ flex:1, height:'42px', borderRadius:'10px', border:`1.5px solid ${active ? '#CA2945' : '#e5e7eb'}`, background: active ? 'rgba(202,41,69,0.08)' : '#f9fafb', color: active ? '#CA2945' : '#4b5563', fontSize:'13px', fontWeight:700, fontFamily:"'Inter', sans-serif", cursor:'pointer', transition:'all 0.2s' }}>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Google */}
                        <a href="http://localhost:3000/api/auth/google" style={{ display:'block', textDecoration:'none' }}>
                            <button type="button" style={{ width:'100%', height:'44px', background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontSize:'13px', fontWeight:700, color:'#374151', fontFamily:"'Inter', sans-serif" }}>
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
                        <button id="register-submit" type="submit"
                            style={{ height:'46px', background:'#CA2945', border:'none', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontSize:'13px', fontWeight:700, color:'#fff', fontFamily:"'Inter', sans-serif", transition:'all 0.2s', boxShadow:'0 8px 24px rgba(202,41,69,0.25)' }}
                            onMouseEnter={e => { e.currentTarget.style.background='#b0203a'; e.currentTarget.style.transform='translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#CA2945'; e.currentTarget.style.transform='translateY(0)'; }}>
                            Register →
                        </button>
                    </form>

                    <p style={{ textAlign:'center', color:'#6b7280', fontSize:'12px', marginTop:'18px' }}>
                        Already have an account?{' '}
                        <a href="/login" style={{ color:'#CA2945', fontWeight:700, textDecoration:'none' }}>
                            Sign In
                        </a>
                    </p>

                    <div style={{ marginTop:'auto', paddingTop:'18px', borderTop:'1px solid #f0f0f0', textAlign:'center' }}>
                        <div style={{ fontSize:'10px', letterSpacing:'3px', color:'#9ca3af', fontWeight:700 }}>VASTRA <span style={{ color:'#CA2945' }}>BHANDAR</span></div>
                        <div style={{ fontSize:'9px', letterSpacing:'1.5px', color:'#9ca3af', marginTop:'4px' }}>STYLE IS NOT BOUGHT, IT'S OWNED.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;