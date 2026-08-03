import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ─── Constants ────────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'US Dollar',    flag: '🇺🇸' },
];

const SUGGESTED_ATTRIBUTES = ['Size', 'Color', 'Fit', 'Material', 'Gender', 'Style', 'Pattern'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (amount, currency = 'INR') => {
  const sym = currency === 'USD' ? '$' : '₹';
  return `${sym}${Number(amount).toLocaleString('en-IN')}`;
};

// ─── Image Slot ───────────────────────────────────────────────────────────────
const ImageSlot = ({ index, imageObj, onClick, onRemove, isFirst, hasError }) => {
  const preview = imageObj?.preview || imageObj?.url || null;

  return (
    // Use div instead of button to avoid invalid nested <button> inside <button>
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center
        transition-all duration-200 cursor-pointer overflow-hidden group
        ${isFirst
          ? hasError
            ? 'border-red-500 bg-[#1a0a0a]'
            : 'border-[#E8490F] bg-[#1a0d08]'
          : 'border-[#2a2a2a] bg-[#161616] hover:border-[#444]'
        }`}
    >
      {preview ? (
        <>
          <img src={preview} alt={`Variant ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          {/* Remove — button is safe inside a div */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500/80 cursor-pointer"
          >
            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </>
      ) : isFirst ? (
        <>
          <svg width="20" height="20" fill="none" stroke={hasError ? '#ef4444' : '#E8490F'} strokeWidth="2" viewBox="0 0 24 24" className="mb-1">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
          <span className={`text-[9px] font-semibold tracking-wide ${hasError ? 'text-red-400' : 'text-[#E8490F]'}`}>Upload</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" fill="none" stroke="#444" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-[10px] text-[#555] mt-1 font-medium">{index + 1}</span>
        </>
      )}
    </div>
  );
};

// ─── Currency Dropdown ────────────────────────────────────────────────────────
const CurrencyDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CURRENCIES.find(c => c.code === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-3 h-[42px] w-full transition-all duration-200 hover:border-[#444] cursor-pointer"
      >
        {selected ? (
          <>
            <span className="text-[16px]">{selected.flag}</span>
            <span className="text-white text-[13px] font-medium flex-1 text-left">{selected.code}</span>
            <span className="text-[#666] text-[12px]">{selected.symbol}</span>
          </>
        ) : (
          <span className="text-[#555] text-[13px] flex-1 text-left">Currency</span>
        )}
        <svg width="12" height="12" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl overflow-hidden z-50 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => { onChange(c.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left
                ${c.code === value ? 'bg-[#E8490F]/15 text-white' : 'text-[#ccc] hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-[16px]">{c.flag}</span>
              <span className="text-[12px] font-semibold flex-1">{c.code}</span>
              <span className="text-[12px] text-[#888]">{c.symbol}</span>
              {c.code === value && (
                <svg width="12" height="12" fill="none" stroke="#E8490F" strokeWidth="2.5" viewBox="0 0 24 24">
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

// ─── Variant Form Card ────────────────────────────────────────────────────────
const VariantFormCard = ({ variantIndex, variant, onChange, onRemove, onImageClick, onImageRemove, isOnly }) => {
  const fileInputRef = useRef(null);
  const activeSlot = useRef(0);
  const sym = variant.currency === 'USD' ? '$' : '₹';

  const handleSlotClick = (idx) => {
    activeSlot.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const newImages = [...variant.images];
    newImages[activeSlot.current] = { file, preview };
    onChange(variantIndex, 'images', newImages);
    e.target.value = '';
  };

  const handleAttrChange = (attrIdx, field, value) => {
    const attrs = [...variant.attributes];
    attrs[attrIdx] = { ...attrs[attrIdx], [field]: value };
    onChange(variantIndex, 'attributes', attrs);
  };

  const addAttribute = (key = '') => {
    onChange(variantIndex, 'attributes', [...variant.attributes, { key, value: '' }]);
  };

  const removeAttribute = (attrIdx) => {
    const attrs = variant.attributes.filter((_, i) => i !== attrIdx);
    onChange(variantIndex, 'attributes', attrs);
  };

  const handleImageRemove = (imgIdx) => {
    const newImages = [...variant.images];
    newImages[imgIdx] = null;
    onChange(variantIndex, 'images', newImages);
  };

  return (
    <div className="bg-[#161616] border border-[#1e1e1e] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#2a2a2a]">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#E8490F]/15 border border-[#E8490F]/30 flex items-center justify-center">
            <span className="text-[#E8490F] text-[11px] font-bold">{variantIndex + 1}</span>
          </div>
          <div>
            <p className="text-white text-[13px] font-bold m-0">Variant {variantIndex + 1}</p>
            <p className="text-[#666] text-[10px] m-0">
              {variant.attributes.filter(a => a.key && a.value).map(a => `${a.key}: ${a.value}`).join(' · ') || 'No attributes set'}
            </p>
          </div>
        </div>
        {!isOnly && (
          <button
            type="button"
            onClick={() => onRemove(variantIndex)}
            className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

        {/* Images */}
        <div>
          <p className="text-[#bbb] text-[11.5px] font-semibold tracking-wide mb-2 m-0">
            Variant Images <span className="text-[#555] font-normal">(optional, up to 5)</span>
          </p>
          <div className="grid grid-cols-5 gap-2">
            {Array(5).fill(null).map((_, idx) => (
              <ImageSlot
                key={idx}
                index={idx}
                imageObj={variant.images[idx]}
                onClick={() => handleSlotClick(idx)}
                onRemove={handleImageRemove}
                isFirst={idx === 0}
                hasError={false}
              />
            ))}
          </div>
        </div>

        {/* Price + Stock row */}
        <div className="flex gap-3">
          {/* Price Amount */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[#bbb] text-[11.5px] font-semibold tracking-wide">
              Price <span className="text-[#E8490F]">*</span>
            </label>
            <div className="flex items-center bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-3 h-[42px] focus-within:border-[#E8490F] focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all">
              <span className="text-[#888] text-[13px] mr-2 font-semibold shrink-0">{sym}</span>
              <input
                type="number"
                value={variant.priceAmount}
                onChange={e => onChange(variantIndex, 'priceAmount', e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="w-[110px] flex flex-col gap-1.5">
            <label className="text-[#bbb] text-[11.5px] font-semibold tracking-wide">Currency</label>
            <CurrencyDropdown value={variant.currency} onChange={val => onChange(variantIndex, 'currency', val)} />
          </div>

          {/* Stock */}
          <div className="w-[110px] flex flex-col gap-1.5">
            <label className="text-[#bbb] text-[11.5px] font-semibold tracking-wide">
              Stock <span className="text-[#E8490F]">*</span>
            </label>
            <div className="flex items-center bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-3 h-[42px] focus-within:border-[#E8490F] focus-within:shadow-[0_0_0_2px_rgba(232,73,15,0.1)] transition-all">
              <input
                type="number"
                value={variant.stock}
                onChange={e => onChange(variantIndex, 'stock', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="flex-1 bg-transparent border-none outline-none text-white text-[13px] placeholder-[#555] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#bbb] text-[11.5px] font-semibold tracking-wide m-0">
              Attributes
              <span className="text-[#555] font-normal ml-1">(size, color, fit…)</span>
            </p>
          </div>

          {/* Suggested Quick-add chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {SUGGESTED_ATTRIBUTES.map(attr => {
              const alreadyAdded = variant.attributes.some(a => a.key.toLowerCase() === attr.toLowerCase());
              return (
                <button
                  key={attr}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => addAttribute(attr)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-150 cursor-pointer
                    ${alreadyAdded
                      ? 'bg-[#E8490F]/10 border-[#E8490F]/30 text-[#E8490F] cursor-not-allowed opacity-60'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888] hover:border-[#E8490F]/50 hover:text-[#E8490F] hover:bg-[#E8490F]/5'
                    }`}
                >
                  {alreadyAdded ? '✓ ' : '+ '}{attr}
                </button>
              );
            })}
          </div>

          {/* Attribute rows */}
          <div className="flex flex-col gap-2">
            {variant.attributes.map((attr, attrIdx) => (
              <div key={attrIdx} className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 h-[38px] focus-within:border-[#E8490F]/60 transition-all">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={e => handleAttrChange(attrIdx, 'key', e.target.value)}
                    placeholder="Key (e.g. Size)"
                    className="flex-1 bg-transparent border-none outline-none text-white text-[12px] placeholder-[#444]"
                  />
                </div>
                <div className="text-[#444] text-[12px] shrink-0">:</div>
                <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 h-[38px] focus-within:border-[#E8490F]/60 transition-all">
                  <input
                    type="text"
                    value={attr.value}
                    onChange={e => handleAttrChange(attrIdx, 'value', e.target.value)}
                    placeholder="Value (e.g. XL)"
                    className="flex-1 bg-transparent border-none outline-none text-white text-[12px] placeholder-[#444]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAttribute(attrIdx)}
                  className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#252525] flex items-center justify-center text-[#555] hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add custom attribute */}
          <button
            type="button"
            onClick={() => addAttribute('')}
            className="mt-2 flex items-center gap-1.5 text-[#666] hover:text-[#E8490F] text-[11px] font-semibold transition-colors cursor-pointer border-none bg-transparent"
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add custom attribute
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Existing Variant Badge ────────────────────────────────────────────────────
const ExistingVariantCard = ({ variant, index }) => {
  const sym = variant.price?.currency === 'USD' ? '$' : '₹';
  const attrs = variant.attributes ? Object.entries(variant.attributes) : [];

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 flex gap-4">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a1a] shrink-0 flex items-center justify-center border border-[#2a2a2a]">
        {variant.images?.[0]?.url ? (
          <img src={variant.images[0].url} alt="variant" className="w-full h-full object-cover" />
        ) : (
          <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#666] text-[10px] font-semibold tracking-wide">VARIANT {index + 1}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#E8490F] font-bold text-[14px]">
              {sym}{Number(variant.price?.amount).toLocaleString('en-IN')}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
              ${variant.stock > 0
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Attributes */}
        {attrs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {attrs.map(([k, v]) => (
              <span key={k} className="text-[10px] font-medium bg-[#1e1e1e] border border-[#2a2a2a] text-[#aaa] px-2 py-0.5 rounded-lg">
                <span className="text-[#666]">{k}:</span> {v}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[#555] text-[11px]">No attributes</span>
        )}
      </div>
    </div>
  );
};


// ─── Main Component ───────────────────────────────────────────────────────────
const SellerDetailedPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth?.user);
  const { handleGetProductDetails, handleAddProductVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // New variants being built
  const [newVariants, setNewVariants] = useState([
    { images: Array(5).fill(null), priceAmount: '', currency: 'INR', stock: '', attributes: [] }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'existing' | 'add'

  // ─── Fetch product ───────────────────────────────────────────────────────
  useEffect(() => { fetchProduct(); }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await handleGetProductDetails(productId);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Variant state helpers ────────────────────────────────────────────────
  const handleVariantChange = useCallback((varIdx, field, value) => {
    setNewVariants(prev => {
      const updated = [...prev];
      updated[varIdx] = { ...updated[varIdx], [field]: value };
      return updated;
    });
    setErrors(prev => ({ ...prev, [`variant_${varIdx}`]: undefined }));
  }, []);

  const addVariant = () => {
    setNewVariants(prev => [...prev, {
      images: Array(5).fill(null), priceAmount: '', currency: 'INR', stock: '', attributes: []
    }]);
  };

  const removeVariant = (idx) => {
    setNewVariants(prev => prev.filter((_, i) => i !== idx));
  };

  // ─── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    newVariants.forEach((v, i) => {
      if (!v.priceAmount || isNaN(Number(v.priceAmount)) || Number(v.priceAmount) <= 0) {
        errs[`variant_${i}`] = `Variant ${i + 1}: Enter a valid price.`;
      }
      if (v.stock === '' || isNaN(Number(v.stock)) || Number(v.stock) < 0) {
        errs[`variant_${i}_stock`] = `Variant ${i + 1}: Enter a valid stock quantity.`;
      }
    });
    return errs;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      for (const variant of newVariants) {
        // Build attributes map from array
        const attributesMap = {};
        variant.attributes.forEach(a => {
          if (a.key.trim() && a.value.trim()) {
            attributesMap[a.key.trim()] = a.value.trim();
          }
        });

        const payload = {
          images: variant.images.filter(Boolean),
          priceAmount: variant.priceAmount,
          priceCurrency: variant.currency,
          stock: variant.stock,
          attributes: attributesMap,
        };

        await handleAddProductVariant(productId, payload);
      }

      setSuccessMsg(`${newVariants.length} variant${newVariants.length > 1 ? 's' : ''} added successfully!`);
      // Reset form
      setNewVariants([{ images: Array(5).fill(null), priceAmount: '', currency: 'INR', stock: '', attributes: [] }]);
      // Refresh product
      await fetchProduct();
      setActiveTab('existing');
    } catch (err) {
      console.error('Error adding variants:', err);
      setErrors(prev => ({ ...prev, submit: 'Failed to add variants. Please try again.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Nav items ────────────────────────────────────────────────────────────
  const navItems = [
    { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard', path: '/seller/dashboard' },
    { icon: 'M12 4v16m8-8H4', label: 'Add Product', path: '/seller/create' },
    { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'My Products', path: '/seller/dashboard', active: true },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Orders' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Earnings' },
    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Store Profile' },
  ];

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-[#0d0d0d] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#E8490F]/30 border-t-[#E8490F] animate-spin" />
          <span className="text-[#666] text-[13px] font-medium">Loading product…</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen bg-[#0d0d0d] items-center justify-center">
        <div className="text-center">
          <div className="text-[#E8490F] text-[32px] mb-3">⚠</div>
          <p className="text-white font-bold text-[16px] mb-1">Product not found</p>
          <p className="text-[#666] text-[13px] mb-4">This product may have been removed or you don't have access.</p>
          <button onClick={() => navigate('/seller/dashboard')} className="px-5 py-2 bg-[#E8490F] rounded-xl text-white text-[13px] font-semibold cursor-pointer border-none hover:bg-[#c73a0a] transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const existingVariants = product.variants || [];
  const sym = product.price?.currency === 'USD' ? '$' : '₹';

  return (
    <div className="flex h-screen bg-[#0d0d0d] font-inter overflow-hidden">

      {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
      <aside className="w-[200px] shrink-0 bg-[#111111] border-r border-[#1e1e1e] flex flex-col overflow-hidden">
        {/* Brand */}
        <div className="px-5 pt-6 pb-4">
          <div className="text-[18px] font-black text-white tracking-[3px] leading-none">VASTRA</div>
          <div className="text-[15px] font-extrabold text-white tracking-[2px] leading-tight">BHANDAR</div>
          <div className="text-[7px] text-[#666] tracking-[2px] mt-0.5 font-medium">SELLER PORTAL</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.path && navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-left w-full cursor-pointer border-none
                ${item.active
                  ? 'bg-[#E8490F] text-white font-semibold'
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

        {/* Sidebar banner */}
        <div className="mx-3 mb-4 mt-3 rounded-2xl overflow-hidden relative" style={{ height: '190px' }}>
          <div className="absolute inset-0 bg-no-repeat"
            style={{ backgroundImage: "url('/model.jpg')", backgroundSize: '170%', backgroundPosition: '80% center' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0d0d0d 38%, rgba(13,13,13,0.7) 62%, rgba(13,13,13,0.1) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
          <div className="relative z-10 p-4 flex flex-col h-full">
            <div className="text-[13px] font-black text-white leading-snug tracking-wide">
              STYLE<br />STARTS<br /><span className="text-[#E8490F]">WITH YOU.</span>
            </div>
            <p className="text-[8px] text-[#aaa] mt-2 leading-relaxed tracking-wide font-semibold uppercase m-0">
              Manage your listings<br />and reach the culture.
            </p>
            <div className="mt-auto">
              <span className="text-[18px] font-black text-[#E8490F] italic drop-shadow-[0_0_10px_rgba(232,73,15,0.6)]">VB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="h-[60px] shrink-0 bg-[#111111] border-b border-[#1e1e1e] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="flex items-center gap-1.5 text-[#666] hover:text-white text-[12px] font-medium transition-colors cursor-pointer border-none bg-transparent"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Dashboard
            </button>
            <span className="text-[#333]">/</span>
            <span className="text-[#aaa] text-[12px] font-medium truncate max-w-[200px]">{product.title}</span>
          </div>
          <div className="flex items-center gap-2.5 bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 py-1.5 cursor-pointer hover:border-[#333] transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#E8490F] flex items-center justify-center text-white text-[11px] font-black">
              {(user?.fullname || user?.name)?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white text-[12px] font-semibold">{user?.fullname || user?.name || 'Seller'}</span>
              <span className="text-[#777] text-[9px] tracking-wide">Seller</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-6 p-6 items-start">

            {/* ═══ LEFT COLUMN ═══ */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Page heading */}
              <div>
                <h1 className="text-[22px] font-black text-white m-0">Product Variants</h1>
                <p className="text-[13px] text-[#888] mt-1 m-0">
                  Manage variants for <span className="text-[#E8490F] font-bold">{product.title}</span>
                </p>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#161616] border border-[#1e1e1e] rounded-xl p-1 w-fit">
                {[
                  { id: 'add', label: 'Add Variants', icon: 'M12 4v16m8-8H4' },
                  { id: 'existing', label: `Existing (${existingVariants.length})`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer border-none
                      ${activeTab === tab.id
                        ? 'bg-[#E8490F] text-white shadow-[0_2px_8px_rgba(232,73,15,0.3)]'
                        : 'text-[#666] hover:text-white bg-transparent'
                      }`}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Existing Variants Tab ── */}
              {activeTab === 'existing' && (
                <div className="flex flex-col gap-3">
                  {existingVariants.length === 0 ? (
                    <div className="bg-[#161616] border border-[#1e1e1e] rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#252525] flex items-center justify-center">
                        <svg width="24" height="24" fill="none" stroke="#444" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                          <path d="M16 3l-4 4-4-4" />
                        </svg>
                      </div>
                      <p className="text-white font-bold text-[15px] m-0">No variants yet</p>
                      <p className="text-[#666] text-[12px] m-0 max-w-[280px]">
                        This product has no variants. Switch to the "Add Variants" tab to create your first one.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('add')}
                        className="mt-2 px-5 py-2 bg-[#E8490F] rounded-xl text-white text-[12px] font-bold cursor-pointer border-none hover:bg-[#c73a0a] transition-colors"
                      >
                        Add First Variant
                      </button>
                    </div>
                  ) : (
                    existingVariants.map((v, i) => (
                      <ExistingVariantCard key={v._id || i} variant={v} index={i} />
                    ))
                  )}
                </div>
              )}

              {/* ── Add Variants Tab ── */}
              {activeTab === 'add' && (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-4">

                    {/* Variant cards */}
                    {newVariants.map((variant, idx) => (
                      <VariantFormCard
                        key={idx}
                        variantIndex={idx}
                        variant={variant}
                        onChange={handleVariantChange}
                        onRemove={removeVariant}
                        isOnly={newVariants.length === 1}
                      />
                    ))}

                    {/* Validation errors */}
                    {Object.values(errors).filter(Boolean).length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                        {Object.values(errors).filter(Boolean).map((err, i) => (
                          <p key={i} className="text-red-400 text-[12px] m-0 flex items-center gap-1.5">
                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {err}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Success */}
                    {successMsg && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-green-400 text-[13px] font-medium">{successMsg}</span>
                      </div>
                    )}

                    {/* Add another variant */}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="w-full h-[48px] flex items-center justify-center gap-2 bg-[#161616] border border-dashed border-[#2a2a2a] rounded-2xl text-[#666] hover:text-[#E8490F] hover:border-[#E8490F]/50 hover:bg-[#E8490F]/5 text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Another Variant
                    </button>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-[52px] btn-hover-gradient rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2.5 tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer shadow-[0_8px_24px_rgba(232,73,15,0.3)]"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Saving Variants…
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          Save {newVariants.length} Variant{newVariants.length > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ═══ RIGHT COLUMN — Product Info (sticky) ═══ */}
            <div className="w-[240px] shrink-0 flex flex-col gap-4 sticky top-6">

              {/* Product card */}
              <div className="bg-[#161616] border border-[#1e1e1e] rounded-2xl overflow-hidden">
                <div className="w-full aspect-square bg-[#111] relative overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="32" height="32" fill="none" stroke="#333" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {/* Tag */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 border border-white/10 rounded-lg">
                    <span className="text-[9px] text-[#aaa] font-semibold tracking-wide">BASE PRODUCT</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2.5">
                  <h3 className="text-white text-[14px] font-bold m-0 leading-tight line-clamp-2">{product.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#E8490F] font-black text-[16px]">
                      {sym}{Number(product.price?.amount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#555] text-[10px]">{product.price?.currency}</span>
                  </div>
                  <p className="text-[11px] text-[#777] leading-relaxed m-0 line-clamp-3">{product.description}</p>

                  <div className="pt-2 border-t border-[#1e1e1e] flex items-center justify-between">
                    <span className="text-[10px] text-[#555]">
                      {product.images?.length ?? 0} image{product.images?.length !== 1 ? 's' : ''}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
                      ${existingVariants.length > 0
                        ? 'bg-[#E8490F]/10 border-[#E8490F]/30 text-[#E8490F]'
                        : 'bg-[#1a1a1a] border-[#252525] text-[#555]'}`}>
                      {existingVariants.length} variant{existingVariants.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#161616] border border-[#1e1e1e] rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-[11px] font-bold text-[#aaa] tracking-wide m-0 uppercase">Inventory Overview</p>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: 'Total Variants',
                      value: existingVariants.length,
                      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
                    },
                    {
                      label: 'Total Stock',
                      value: existingVariants.reduce((acc, v) => acc + (v.stock || 0), 0),
                      icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z',
                    },
                    {
                      label: 'Out of Stock',
                      value: existingVariants.filter(v => !v.stock || v.stock === 0).length,
                      icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
                      danger: true,
                    },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${stat.danger ? 'bg-red-500/10' : 'bg-[#1a1a1a]'}`}>
                          <svg width="11" height="11" fill="none" stroke={stat.danger ? '#ef4444' : '#888'} strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-[#777] text-[11px]">{stat.label}</span>
                      </div>
                      <span className={`text-[13px] font-bold ${stat.danger && stat.value > 0 ? 'text-red-400' : 'text-white'}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick tip */}
              <div className="bg-[#E8490F]/5 border border-[#E8490F]/20 rounded-2xl p-4">
                <p className="text-[#E8490F] text-[10px] font-bold uppercase tracking-wide m-0 mb-2">💡 Quick Tip</p>
                <p className="text-[#aaa] text-[11px] leading-relaxed m-0">
                  Use the attribute chips to quickly tag Size, Color, or Fit. Each variant gets its own images, price, and stock.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailedPage;