import React, { useEffect, useState, useCallback } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { useSelector } from 'react-redux';

// ── Image Carousel inside each card ──────────────────────────
const ImageCarousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    },
    [images.length]
  );

  const next = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    },
    [images.length]
  );

  if (!images.length) {
    return (
      <div className="w-full h-56 bg-[#1a1a1a] flex items-center justify-center">
        <span className="text-[#555] text-sm">No images</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 overflow-hidden bg-[#111] group select-none">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt={`product-image-${i + 1}`}
            className="min-w-full h-full object-cover flex-shrink-0"
            draggable={false}
          />
        ))}
      </div>

      {/* Arrow — Prev */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80 z-10"
            aria-label="Previous image"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Arrow — Next */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80 z-10"
            aria-label="Next image"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all duration-200 ${
                  i === current
                    ? 'w-4 h-1.5 bg-[#E8490F]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter badge */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
            {current + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

// ── Product Card ──────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { title, description, price, images, createdAt } = product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: price?.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(price?.amount || 0);

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-[#161616] border border-[#222] rounded-2xl overflow-hidden hover:border-[#E8490F]/40 hover:shadow-[0_0_24px_rgba(232,73,15,0.08)] transition-all duration-300 flex flex-col group">
      <ImageCarousel images={images} />

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <h3 className="text-white font-bold text-[15px] leading-snug line-clamp-1 group-hover:text-[#E8490F] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#888] text-[12.5px] leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-[#222]">
          <span className="text-[#E8490F] font-extrabold text-[16px] tracking-wide">
            {formattedPrice}
          </span>
          <span className="text-[#555] text-[10px] font-medium tracking-wide">
            {formattedDate}
          </span>
        </div>

        {/* Image count pill */}
        {images?.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <svg width="12" height="12" fill="none" stroke="#666" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-[#666] text-[10.5px]">
              {images.length} {images.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
    <div className="w-16 h-16 rounded-2xl border border-[#2a2a2a] bg-[#161616] flex items-center justify-center">
      <svg width="28" height="28" fill="none" stroke="#E8490F" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </div>
    <div>
      <p className="text-white font-bold text-[16px]">No products yet</p>
      <p className="text-[#666] text-[13px] mt-1">Your listed products will appear here.</p>
    </div>
  </div>
);

// ── Loading Skeleton ─────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#161616] border border-[#222] rounded-2xl overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-[#222]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#222] rounded-full w-3/4" />
      <div className="h-3 bg-[#1e1e1e] rounded-full w-full" />
      <div className="h-3 bg-[#1e1e1e] rounded-full w-2/3" />
      <div className="flex justify-between mt-2 pt-3 border-t border-[#222]">
        <div className="h-4 bg-[#222] rounded-full w-1/4" />
        <div className="h-3 bg-[#1e1e1e] rounded-full w-1/5" />
      </div>
    </div>
  </div>
);

// ── Dashboard Page ────────────────────────────────────────────
const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await handleGetSellerProducts();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1e1e1e] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-[20px] tracking-wide">
              MY <span className="text-[#E8490F]">PRODUCTS</span>
            </h1>
            <p className="text-[#555] text-[11px] tracking-[2px] font-medium">
              SELLER DASHBOARD
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <span className="bg-[#E8490F]/10 border border-[#E8490F]/20 text-[#E8490F] text-[12px] font-bold px-3 py-1 rounded-full">
                {sellerProducts?.length || 0} listed
              </span>
            )}
            <a
              href="/seller/create"
              className="flex items-center gap-2 bg-[#E8490F] hover:bg-[#c93d0d] text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </a>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !sellerProducts?.length ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-2 mb-6 text-[#666] text-[12px] font-medium">
              <span>{sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''} found</span>
              <span className="w-1 h-1 rounded-full bg-[#333]" />
              <span>
                {sellerProducts.reduce((acc, p) => acc + (p.images?.length || 0), 0)} total photos
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;