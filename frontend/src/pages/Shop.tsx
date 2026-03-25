import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaSearch,
  FaTimes,
  FaSortAmountDown,
} from "react-icons/fa";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import ProductCard from "./Products/ProductCard";
import Metadata from "../components/Metadata";
import BackToTopBtn from "../components/BackToTopBtn";
import { ProductSkeletonGrid } from "../components/ProductSkeleton";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "name_az", label: "Name A → Z" },
];

const PAGE_SIZE = 12;

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 dark:border-white/[0.06] pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </span>
        {open ? (
          <FaChevronUp size={10} className="text-zinc-400" />
        ) : (
          <FaChevronDown size={10} className="text-zinc-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state: any) => state.shop,
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const { t } = useTranslation();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  // Populate categories
  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Filter + set products
  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let result = [...filteredProductsQuery.data];

      if (priceFilter) {
        result = result.filter(
          (p) =>
            p.price.toString().includes(priceFilter) ||
            p.price === parseInt(priceFilter, 10),
        );
      }

      if (selectedBrand) {
        result = result.filter((p) => p.brand === selectedBrand);
      }

      dispatch(setProducts(result));
      setVisibleCount(PAGE_SIZE); // reset paging on filter change
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    priceFilter,
    selectedBrand,
  ]);

  // Sort + search on the already-filtered products list
  const displayProducts = (() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "name_az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  })();

  // Infinite scroll: observe sentinel div
  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + PAGE_SIZE, displayProducts.length),
    );
  }, [displayProducts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset visible count when sort/search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sortBy, searchQuery]);

  const visibleProducts = displayProducts.slice(0, visibleCount);
  const hasMore = visibleCount < displayProducts.length;

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((p) => p.brand)
        .filter(Boolean) as string[],
    ),
  ];

  const handleCheckCategory = (value: boolean, id: string) => {
    const updated = value
      ? [...checked, id]
      : checked.filter((c: string) => c !== id);
    dispatch(setChecked(updated));
  };

  const resetFilters = () => {
    dispatch(setChecked([]));
    setPriceFilter("");
    setSelectedBrand(null);
    setSortBy("default");
    setSearchQuery("");
  };

  const activeFiltersCount =
    checked.length + (priceFilter ? 1 : 0) + (selectedBrand ? 1 : 0);

  const isLoading =
    filteredProductsQuery.isLoading || categoriesQuery.isLoading;

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Sidebar header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
          <FaFilter size={12} className="text-emerald-500" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-zinc-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
          >
            <FaTimes size={10} />
            Reset
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <FilterSection title={t("filter_by_categories")}>
          <div className="space-y-2">
            {categories?.map((c: any) => (
              <label
                key={c._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checked.includes(c._id)}
                    onChange={(e) =>
                      handleCheckCategory(e.target.checked, c._id)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-200 flex items-center justify-center">
                    {checked.includes(c._id) && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title={t("filter_by_brands")}>
          <div className="flex flex-wrap gap-2">
            {uniqueBrands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setSelectedBrand(selectedBrand === brand ? null : brand)
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  selectedBrand === brand
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection title={t("filter_by_price")}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
              $
            </span>
            <input
              type="number"
              placeholder="Max price..."
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm rounded-xl outline-none transition-all duration-200"
            />
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      <Metadata title="Shop" />
      <BackToTopBtn />

      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-[1600px] mx-auto flex">
          {/* ── Desktop sidebar ──────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-zinc-100 dark:border-white/[0.06] px-6 py-8">
            <SidebarContent />
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0 px-4 lg:px-8 py-8">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Title + count */}
              <div>
                <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                  {t("shop")}
                </h1>
                {!isLoading && (
                  <p className="text-zinc-400 text-sm mt-0.5">
                    {displayProducts.length === products.length
                      ? `${products.length} products`
                      : `${displayProducts.length} of ${products.length} products`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <FaSearch
                    size={11}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-4 py-2.5 w-48 sm:w-64 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-emerald-500/50 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <FaSortAmountDown
                    size={11}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-8 pr-8 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-transparent text-zinc-900 dark:text-white text-sm rounded-xl outline-none appearance-none cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                  <FaFilter size={11} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {checked.map((id: string) => {
                    const cat = categories?.find((c: any) => c._id === id);
                    return cat ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full"
                      >
                        {cat.name}
                        <button onClick={() => handleCheckCategory(false, id)}>
                          <FaTimes size={8} />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedBrand && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                      {selectedBrand}
                      <button onClick={() => setSelectedBrand(null)}>
                        <FaTimes size={8} />
                      </button>
                    </span>
                  )}
                  {priceFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                      Max ${priceFilter}
                      <button onClick={() => setPriceFilter("")}>
                        <FaTimes size={8} />
                      </button>
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid */}
            {isLoading ? (
              <ProductSkeletonGrid count={PAGE_SIZE} />
            ) : displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                  <FaSearch
                    size={20}
                    className="text-zinc-300 dark:text-zinc-600"
                  />
                </div>
                <p className="text-zinc-500 text-lg font-medium mb-2">
                  No products found
                </p>
                <p className="text-zinc-400 text-sm mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((p, i) => (
                      <motion.div
                        key={p._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i % PAGE_SIZE, 8) * 0.05,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                      >
                        <ProductCard p={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Infinite scroll sentinel + loading indicator */}
                <div
                  ref={sentinelRef}
                  className="mt-12 flex flex-col items-center gap-4"
                >
                  {hasMore && (
                    <>
                      {/* Skeleton rows while loading more */}
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({
                          length: Math.min(
                            PAGE_SIZE,
                            displayProducts.length - visibleCount,
                          ),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse shimmer-bg"
                          />
                        ))}
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Showing {visibleCount} of {displayProducts.length}
                      </p>
                    </>
                  )}

                  {!hasMore && displayProducts.length > PAGE_SIZE && (
                    <p className="text-zinc-400 text-sm py-4">
                      All {displayProducts.length} products loaded ✓
                    </p>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-white/[0.06] z-50 px-6 py-8 overflow-y-auto"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
              >
                <FaTimes size={14} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;
