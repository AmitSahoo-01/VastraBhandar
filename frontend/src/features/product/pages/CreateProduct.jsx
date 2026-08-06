import React, { useState, useRef } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ─── Image Upload Slot ────────────────────────────────────────────────────────
const ImageSlot = ({ index, file, onClick, isFirst, hasError }) => {
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center
        transition-all duration-200 cursor-pointer overflow-hidden group
        ${isFirst
          ? hasError
            ? 'border-red-500 bg-[#1a0a0a]'
            : 'border-[#CA2945] bg-[#1a0d08]'
          : 'border-[#2a2a2a] bg-[#161616] hover:border-[#444]'
        }
      `}
    >
      {preview ? (
        <>
          <img src={preview} alt={`Product ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </>
      ) : isFirst ? (
        <>
          <svg width="22" height="22" fill="none" stroke={hasError ? '#ef4444' : '#CA2945'} strokeWidth="2" viewBox="0 0 24 24" className="mb-1">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
          <span className={`text-[9px] font-semibold tracking-wide ${hasError ? 'text-red-400' : 'text-[#CA2945]'}`}>
            Upload Image
          </span>
        </>
      ) : (
        <>
          <svg width="18" height="18" fill="none" stroke="#444" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-[10px] text-[#555] mt-1 font-medium">{index + 1}</span>
        </>
      )}
    </button>
  );
};

// ─── Currency Option ──────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'US Dollar',    flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro',         flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound',flag: '🇬🇧' },
];

// ─── Custom Currency Dropdown ─────────────────────────────────────────────────
const CurrencyDropdown = ({ value, onChange, onBlur, hasError }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CURRENCIES.find((c) => c.code === value);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setOpen(false);
    onBlur?.();
  };


  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 bg-[#1c1c1c] border rounded-xl px-3.5 h-[46px] transition-all duration-200 cursor-pointer
          ${hasError
            ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
            : open
              ? 'border-[#CA2945] shadow-[0_0_0_2px_rgba(232,73,15,0.1)]'
              : 'border-[#2a2a2a] hover:border-[#444]'
          }`}
      >
        {selected ? (
          <>
            <span className="text-[18px] leading-none shrink-0">{selected.flag}</span>
            <span className="flex-1 text-left text-white text-[13px] font-medium">{selected.code}</span>
            <span className="text-[#666] text-[12px]">{selected.symbol}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-[#555] text-[13px]">Select currency</span>
        )}
        <svg
          width="14" height="14" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24"
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl overflow-hidden z-50 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors text-left
                ${c.code === value
                  ? 'bg-[#CA2945]/15 text-white'
                  : 'text-[#ccc] hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="text-[18px] leading-none shrink-0">{c.flag}</span>
              <div className="flex flex-col leading-tight flex-1">
                <span className="text-[12px] font-semibold">{c.code}</span>
                <span className="text-[10px] text-[#666]">{c.label}</span>
              </div>
              <span className="text-[13px] text-[#888] font-bold">{c.symbol}</span>
              {c.code === value && (
                <svg width="13" height="13" fill="none" stroke="#CA2945" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', description: '', price: '', currency: 'INR', stock: '', color: '', size: '' });
  const [images, setImages] = useState(Array(7).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(0);

  const selectedCurrency = CURRENCIES.find((c) => c.code === form.currency);

  // ─── Validation ──────────────────────────────────────────────────────────
  const validate = (fields = form, imgs = images) => {
    const errs = {};
    if (!fields.title.trim()) errs.title = 'Product title is required.';
    else if (fields.title.trim().length < 5) errs.title = 'Title must be at least 5 characters.';
    else if (fields.title.length > 100) errs.title = 'Title cannot exceed 100 characters.';

    if (!fields.description.trim()) errs.description = 'Description is required.';
    else if (fields.description.length > 1000) errs.description = 'Description cannot exceed 1000 characters.';

    if (!fields.price) errs.price = 'Price is required.';
    else if (isNaN(Number(fields.price)) || Number(fields.price) <= 0) errs.price = 'Enter a valid price greater than 0.';

    if (!fields.currency) errs.currency = 'Please select a currency.';
    if (fields.stock === '' || isNaN(Number(fields.stock)) || Number(fields.stock) < 0) errs.stock = 'Stock quantity is required (0 or greater).';
    if (!fields.color.trim()) errs.color = 'Product color is required.';
    if (!fields.size.trim()) errs.size = 'Product size is required.';

    if (!imgs[0]) errs.images = 'At least one product image is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate();
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleCurrencyChange = (code) => {
    const updated = { ...form, currency: code };
    setForm(updated);
    setTouched((prev) => ({ ...prev, currency: true }));
    const errs = validate(updated);
    setErrors((prev) => ({ ...prev, currency: errs.currency }));
  };

  // ─── Image handling ───────────────────────────────────────────────────────
  const handleSlotClick = (idx) => {
    activeSlotRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, images: 'Each image must be under 5MB.' }));
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, images: 'Only JPG, PNG, or WEBP files are allowed.' }));
      return;
    }
    const updated = [...images];
    updated[activeSlotRef.current] = file;
    setImages(updated);
    setErrors((prev) => ({ ...prev, images: undefined }));
    e.target.value = '';
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, description: true, price: true, currency: true, stock: true, color: true, size: true, images: true });
    const errs = validate(form, images);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('priceAmount', form.price);
      formData.append('priceCurrency', form.currency);
      formData.append('stock', form.stock);
      formData.append('color', form.color.trim());
      formData.append('size', form.size.trim());
      images.filter(Boolean).forEach((img) => formData.append('images', img));
      await handleCreateProduct(formData);
      setSubmitSuccess(true);
      navigate("/");
    } catch (err) {
      console.error('Error publishing product:', err);
      setErrors((prev) => ({ ...prev, submit: 'Failed to publish. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage = images.find(Boolean);
  const previewUrl = previewImage ? URL.createObjectURL(previewImage) : null;

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const inputWrap = (field) =>
    `flex items-center bg-[#f9fafb] border rounded-xl px-3.5 h-[46px] transition-all duration-200
     ${errors[field] && touched[field]
       ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
       : 'border-[#e5e7eb] focus-within:border-[#CA2945] focus-within:shadow-[0_0_0_2px_rgba(202,41,69,0.1)]'
     }`;

  const labelClass = 'text-[#374151] text-[11.5px] font-semibold tracking-wide flex items-center gap-1';

  const errorMsg = (field) =>
    errors[field] && touched[field] ? (
      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1 m-0">
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  // ─── Nav items ────────────────────────────────────────────────────────────
  const navItems = [
    { icon: 'M12 4v16m8-8H4', label: 'Add Product', path: '/seller/create', active: true },
    { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'My Products', path: '/seller/dashboard' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-inter overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* SIDEBAR */}
      <aside className="w-[200px] shrink-0 bg-[#ffffff] border-r border-[#e5e7eb] flex flex-col overflow-hidden">
        {/* Brand */}
        <div className="px-5 pt-6 pb-4">
          <div className="text-[18px] font-black text-[#CA2945] tracking-[3px] leading-none">VASTRA</div>
          <div className="text-[15px] font-extrabold text-[#CA2945] tracking-[2px] leading-tight">BHANDAR</div>
          <div className="text-[7px] text-[#6b7280] tracking-[2px] mt-0.5 font-medium">SELLER PORTAL</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-left w-full cursor-pointer border-none
                ${item.active
                  ? 'bg-[#CA2945] text-white font-semibold'
                  : 'text-[#888] hover:text-white hover:bg-white/5 bg-transparent'
                }`}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="shrink-0">
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* ─── Sidebar Ad Banner ─── */}
        <div className="mx-3 mb-4 mt-3 rounded-2xl overflow-hidden relative" style={{ height: '190px' }}>
          {/* Model image — positioned to the right half */}
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: "url('/model.jpg')",
              backgroundSize: '170%',
              backgroundPosition: '80% center',
            }}
          />
          {/* Left-to-right white gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #ffffff 38%, rgba(255,255,255,0.7) 62%, rgba(255,255,255,0.1) 100%)' }} />

          {/* Text content — left side */}
          <div className="relative z-10 p-4 flex flex-col h-full">
            <div className="text-[13px] font-black text-[#111827] leading-snug tracking-wide">
              STYLE<br />STARTS<br />
              <span className="text-[#CA2945]">WITH YOU.</span>
            </div>
            <p className="text-[8px] text-[#6b7280] mt-2 leading-relaxed tracking-wide font-semibold uppercase m-0">
              List your products<br />and reach the culture.
            </p>
            {/* VB logo bottom-left */}
            <div className="mt-auto">
              <span className="text-[18px] font-black text-[#CA2945] italic">VB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="h-[60px] shrink-0 bg-[#ffffff] border-b border-[#e5e7eb] flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-1.5 cursor-pointer hover:border-[#CA2945] transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#CA2945] flex items-center justify-center text-white text-[11px] font-black">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[#111827] text-[12px] font-semibold">{user?.name ?? 'StreetSavage'}</span>
                <span className="text-[#6b7280] text-[9px] tracking-wide">Seller</span>
              </div>
              <svg width="12" height="12" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} noValidate>

            {/* Two-column layout: form left, preview right — both start from top */}
            <div className="flex gap-6 p-6 items-start">

              {/* LEFT COLUMN — Form */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Page heading */}
                <div>
                  <h1 className="text-[24px] font-black text-[#111827] m-0">Add New Product</h1>
                  <p className="text-[13px] text-[#6b7280] mt-1 m-0">
                    Fill in the details below to list your product on{' '}
                    <span className="text-[#CA2945] font-bold">VASTRA BHANDAR</span>.
                  </p>
                </div>

                {/* ─── General Information Card ─── */}
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 flex flex-col gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <h2 className="text-[14px] font-bold text-[#111827] m-0 tracking-wide">General Information</h2>

                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Title <span className="text-[#CA2945]">*</span>
                    </label>
                    <div className={inputWrap('title')}>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        onBlur={() => handleBlur('title')}
                        placeholder="Enter product title"
                        maxLength={100}
                        className="flex-1 bg-transparent border-none outline-none text-[#111827] text-[13px] placeholder-[#9ca3af]"
                      />
                      <span className="text-[#9ca3af] text-[10px] ml-2 shrink-0">{form.title.length}/100</span>
                    </div>
                    {errorMsg('title')}
                  </div>

                  {/* Description — plain textarea, no toolbar */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Description <span className="text-[#CA2945]">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        onBlur={() => handleBlur('description')}
                        placeholder="Describe your product, material, fit, vibe, etc."
                        maxLength={1000}
                        rows={5}
                        className={`w-full bg-[#f9fafb] text-[#111827] text-[13px] placeholder-[#9ca3af] resize-none outline-none px-3.5 py-3 pb-7 rounded-xl transition-all duration-200 border
                          ${errors.description && touched.description
                            ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
                            : 'border-[#e5e7eb] focus:border-[#CA2945] focus:shadow-[0_0_0_2px_rgba(202,41,69,0.1)]'
                          }`}
                        style={{ boxSizing: 'border-box' }}
                      />
                      <span className="absolute bottom-2.5 right-3 text-[#555] text-[10px] pointer-events-none">
                        {form.description.length}/1000
                      </span>
                    </div>
                    {errorMsg('description')}
                  </div>

                  {/* Price + Currency row */}
                  <div className="flex gap-4">
                    {/* Price */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Price Amount <span className="text-[#CA2945]">*</span>
                      </label>
                      <div className={inputWrap('price')}>
                        <span className="text-[#888] text-[13px] mr-2.5 shrink-0 font-semibold">
                          {selectedCurrency?.symbol ?? '₹'}
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          onBlur={() => handleBlur('price')}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="flex-1 bg-transparent border-none outline-none text-[#111827] text-[13px] placeholder-[#9ca3af] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      {errorMsg('price')}
                    </div>

                    {/* Currency — custom styled dropdown */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Price Currency <span className="text-[#CA2945]">*</span>
                      </label>
                      <CurrencyDropdown
                        value={form.currency}
                        onChange={handleCurrencyChange}
                        onBlur={() => handleBlur('currency')}
                        hasError={!!(errors.currency && touched.currency)}
                      />
                      {errorMsg('currency')}
                    </div>
                  </div>

                  {/* Stock, Color & Size row */}
                  <div className="flex gap-4">
                    {/* Stock */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Stock Quantity <span className="text-[#CA2945]">*</span>
                      </label>
                      <div className={inputWrap('stock')}>
                        <input
                          type="number"
                          name="stock"
                          value={form.stock}
                          onChange={handleChange}
                          onBlur={() => handleBlur('stock')}
                          placeholder="e.g. 50"
                          min="0"
                          step="1"
                          className="flex-1 bg-transparent border-none outline-none text-[#111827] text-[13px] placeholder-[#9ca3af]"
                        />
                      </div>
                      {errorMsg('stock')}
                    </div>

                    {/* Color */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Color <span className="text-[#CA2945]">*</span>
                      </label>
                      <div className={inputWrap('color')}>
                        <input
                          type="text"
                          name="color"
                          value={form.color}
                          onChange={handleChange}
                          onBlur={() => handleBlur('color')}
                          placeholder="e.g. Black"
                          className="flex-1 bg-transparent border-none outline-none text-[#111827] text-[13px] placeholder-[#9ca3af]"
                        />
                      </div>
                      {errorMsg('color')}
                    </div>

                    {/* Size */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Size <span className="text-[#CA2945]">*</span>
                      </label>
                      <div className={inputWrap('size')}>
                        <input
                          type="text"
                          name="size"
                          value={form.size}
                          onChange={handleChange}
                          onBlur={() => handleBlur('size')}
                          placeholder="e.g. M / L / Free Size"
                          className="flex-1 bg-transparent border-none outline-none text-[#111827] text-[13px] placeholder-[#9ca3af]"
                        />
                      </div>
                      {errorMsg('size')}
                    </div>
                  </div>
                </div>

                {/* Product Images Card */}
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <h2 className="text-[14px] font-bold text-[#111827] m-0 tracking-wide flex items-center gap-1.5">
                    Product Images <span className="text-[#CA2945]">*</span>
                    <span className="text-[#6b7280] text-[11px] font-normal">(Upto 7 images)</span>
                  </h2>

                  <div className="grid grid-cols-7 gap-2">
                    {images.map((file, idx) => (
                      <ImageSlot
                        key={idx}
                        index={idx}
                        file={file}
                        onClick={() => handleSlotClick(idx)}
                        isFirst={idx === 0}
                        hasError={!!(errors.images && touched.images)}
                      />
                    ))}
                  </div>

                  {errors.images && touched.images && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1 m-0">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.images}
                    </p>
                  )}

                  <p className="text-[11.5px] text-[#6b7280] m-0">
                    Upload up to 7 images. JPG, PNG or WEBP. Max size 5MB each.
                  </p>
                </div>

                {/* Submit alerts */}
                {errors.submit && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                    <svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="text-red-500 text-[13px]">{errors.submit}</span>
                  </div>
                )}
                {submitSuccess && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                    <svg width="16" height="16" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-green-600 text-[13px]">Product published successfully!</span>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN — Preview + Publish (sticky top) */}
              <div className="w-[260px] shrink-0 flex flex-col gap-4 sticky top-6">

                {/* Product Preview card */}
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <div className="px-4 pt-4 pb-2 border-b border-[#e5e7eb]">
                    <h3 className="text-[13px] font-bold text-[#111827] m-0">Product Preview</h3> 
                  </div>

                  {/* Preview image */}
                  <div className="w-full aspect-square bg-[#f3f4f6] relative flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#9ca3af]">
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-[10px] font-medium tracking-wide">No image yet</span>
                      </div>
                    )}
                  </div>

                  {/* Preview details */}
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="text-[14px] font-bold text-[#111827] m-0 leading-tight">
                      {form.title.trim() || 'Product Title'}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#CA2945] font-black text-[16px]">
                        {selectedCurrency?.symbol ?? '₹'}{form.price ? Number(form.price).toFixed(2) : '0.00'}
                      </span>
                      <span className="text-[#6b7280] text-[10px] font-medium">{form.currency || 'Currency'}</span>
                    </div>
                    <p className="text-[11px] text-[#4b5563] leading-relaxed m-0 line-clamp-3">
                      {form.description.trim() || 'This is where your product description will appear. Make it catchy and true to your style.'}
                    </p>

                    {/* Listed by */}
                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#e5e7eb]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#CA2945] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                          {user?.name?.[0]?.toUpperCase() ?? 'S'}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[9px] text-[#6b7280]">Listed by</span>
                          <span className="text-[11px] text-[#111827] font-semibold">{user?.name ?? 'StreetSavage'}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                        Seller
                      </span>
                    </div>
                  </div>
                </div>

                {/* Publish button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[52px] bg-[#CA2945] hover:bg-[#b0203a] rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2.5 tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer shadow-[0_8px_24px_rgba(202,41,69,0.25)]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Publishing…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Publish Product
                    </>
                  )}
                </button>


              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;