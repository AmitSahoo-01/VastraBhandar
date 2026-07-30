import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    fullname: '',
    contact: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const [showPass, setShowPass] = useState(false);
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRole = (isSeller) => {
    setForm((prev) => ({ ...prev, isSeller }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(form);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-inter p-3 md:p-4 overflow-hidden">
      {/* ═══ MAIN CARD ═══ */}
      <div className="flex flex-col md:flex-row w-full max-w-[920px] flex-1 max-h-[calc(100vh-80px)] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-[#1e1e1e]">

        {/* ─────────────────────────────────────
            LEFT PANEL — Hero / Branding
        ───────────────────────────────────── */}
        <div className="w-full md:w-[44%] relative flex flex-col overflow-hidden">
          {/* Background model image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/model.jpg')" }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />

          {/* Content over image */}
          <div className="relative z-10 flex flex-col h-full p-7 pb-5">
            {/* Brand */}
            <div className="mb-6">
              <div className="text-[26px] font-black text-brand tracking-[4px] leading-none">
                VASTRA
              </div>
              <div className="text-[22px] font-extrabold text-brand tracking-[3px] leading-tight ">
                BHANDAR
              </div>
              <div className="text-[8px] text-[#777] tracking-[3px] mt-1 font-medium">
                WEAR YOUR IDENTITY
              </div>
            </div>


            {/* Hero text */}
            <h2 className="text-[44px] font-black text-white leading-none tracking-wide m-0">
              JOIN THE
            </h2>
            <h2 className="text-[52px] font-black text-brand leading-none  font-mono m-0 drop-shadow-[0_0_40px_rgba(232,73,15,0.3)]">
              CULTURE
            </h2>


            {/* Tagline */}
            <div className="mt-64">
              <p className="text-white font-bold text-[13px] tracking-wide m-0">
                Streetwear. Minimal. Timeless.
              </p>
              <p className="text-[#999] text-[11.5px] leading-relaxed mt-1 m-0">
                Discover curated fashion
                <br />
                designed for the next generation.
              </p>
            </div>

            {/* Spacer for model visibility */}
            <div className="flex-1 min-h-[40px]" />

            {/* Bottom badges */}
            <div className="flex justify-around pt-4 border-t border-[#2a2a2a]">
              {/* Premium Quality */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-[#333] bg-[#151515]/80 flex items-center justify-center backdrop-blur-sm">
                  <svg width="20" height="20" fill="none" stroke="#E8490F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8l1.12 3.44H17l-2.88 2.1L15.24 17 12 14.88 8.76 17l1.12-3.46L7 11.44h3.88z" fill="#E8490F" stroke="none" />
                  </svg>
                </div>
                <span className="text-[#888] text-[8px] font-bold tracking-wider text-center leading-snug">
                  PREMIUM
                  <br />
                  QUALITY
                </span>
              </div>

              {/* Easy Returns */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-[#333] bg-[#151515]/80 flex items-center justify-center backdrop-blur-sm">
                  <svg width="20" height="20" fill="none" stroke="#E8490F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 14l-4-4 4-4" />
                    <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
                  </svg>
                </div>
                <span className="text-[#888] text-[8px] font-bold tracking-wider text-center leading-snug">
                  EASY
                  <br />
                  RETURNS
                </span>
              </div>

              {/* Fast Delivery */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-lg border border-[#333] bg-[#151515]/80 flex items-center justify-center backdrop-blur-sm">
                  <svg width="20" height="20" fill="none" stroke="#E8490F" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="1" y="6" width="15" height="10" rx="2" />
                    <path d="M16 10h4l3 3v3a2 2 0 0 1-2 2h-1" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="19" cy="18" r="2" />
                  </svg>
                </div>
                <span className="text-[#888] text-[8px] font-bold tracking-wider text-center leading-snug">
                  FAST
                  <br />
                  DELIVERY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            RIGHT PANEL — Registration Form
        ───────────────────────────────────── */}
        <div className="flex-1 bg-[#161616] px-7 py-7 md:px-9 md:py-8 flex flex-col relative border-l border-[#222] overflow-y-auto">
          {/* VB Logo top-right */}
          <div className="absolute top-5 right-6">
            <img
              src="/vb-logo.png"
              alt="VB"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-extrabold text-white leading-tight mb-2 m-0">
            Create Your
            <br />
            <span className="text-brand font-mono">Style</span> Account
          </h1>



          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#ccc] text-[11.5px] font-semibold tracking-wide">
                Full Name
              </label>
              <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] px-3.5 h-[44px] focus-within:border-brand focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all duration-200">
                <span className="mr-2.5 flex items-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] font-inter"
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#ccc] text-[11.5px] font-semibold tracking-wide">
                Contact Number
              </label>
              <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] px-3.5 h-[44px] focus-within:border-brand focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all duration-200">
                <span className="mr-2.5 flex items-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] font-inter"
                  type="tel"
                  name="contact"
                  placeholder="Enter your contact number"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#ccc] text-[11.5px] font-semibold tracking-wide">
                Email Address
              </label>
              <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] px-3.5 h-[44px] focus-within:border-brand focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all duration-200">
                <span className="mr-2.5 flex items-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] font-inter"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#ccc] text-[11.5px] font-semibold tracking-wide">
                Password
              </label>
              <div className="flex items-center bg-[#1e1e1e] border border-[#2a2a2a] rounded-[10px] px-3.5 h-[44px] focus-within:border-brand focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all duration-200">
                <span className="mr-2.5 flex items-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] font-inter"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer p-1 flex items-center ml-1.5 rounded hover:bg-white/5 transition-colors"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role — Buyer / Seller */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#ccc] text-[11.5px] font-semibold tracking-wide">
                I am a
              </label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  id="role-buyer"
                  className={`flex-1 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 font-inter ${
                    !form.isSeller
                      ? 'border-brand bg-brand/10 text-brand shadow-[0_0_12px_rgba(232,73,15,0.1)]'
                      : 'border-[#2a2a2a] bg-[#1e1e1e] text-[#777] hover:border-[#444] hover:text-[#aaa]'
                  }`}
                  onClick={() => handleRole(false)}
                >
                  🛒 Buyer
                </button>
                <button
                  type="button"
                  id="role-seller"
                  className={`flex-1 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 font-inter ${
                    form.isSeller
                      ? 'border-brand bg-brand/10 text-brand shadow-[0_0_12px_rgba(232,73,15,0.1)]'
                      : 'border-[#2a2a2a] bg-[#1e1e1e] text-[#777] hover:border-[#444] hover:text-[#aaa]'
                  }`}
                  onClick={() => handleRole(true)}
                >
                  🏪 Seller
                </button>
              </div>
            </div>

            <a href="api/auth/google" className="w-full block">
              <button
                type="button"
                className="w-full mt-1.5 h-12 bg-white border-none rounded-xl text-black text-[14px] font-bold cursor-pointer flex items-center justify-center gap-2 tracking-wide transition-all duration-200  disabled:opacity-70 disabled:cursor-not-allowed font-inter"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>Continue with Google</span>
              </button>
            </a>

            {/* Register Button */}
            <button
              id="register-submit"
              type="submit"
              className="mt-1.5 h-12 btn-hover-gradient border-none rounded-xl text-white text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 tracking-wide transition-all duration-200 active:scale-95  disabled:opacity-70 disabled:cursor-not-allowed font-inter"
            >
              <span>Register</span>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Sign In link */}
          <p className="text-center text-[#777] text-[12.5px] mt-5 m-0">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-brand font-bold no-underline border-b border-transparent hover:border-brand transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="mt-2 w-full max-w-[920px] flex items-center justify-center px-2 pt-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-extrabold text-[#666] tracking-[3px]">
            VASTRA <span className="text-brand">BHANDAR</span>
          </span>
          <span className="text-[9px] text-[#444] tracking-[2px] font-medium">
            STYLE IS NOT BOUGHT, IT'S OWNED.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;