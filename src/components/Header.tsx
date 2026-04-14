import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, X, Menu, Smartphone, Tablet, Watch } from "lucide-react";
import { useRepairCart } from "../lib/repairCart";
import { searchCatalog, type SearchResultItem } from "../lib/api";

function slugifySegment(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Book a Repair", to: "/book-repair" },
  { label: "Track Repair", to: "/track-repair" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About Us", to: "/about-us" },
  { label: "FAQs", to: "/faqs" },
  { label: "Contact Us", to: "/contact-us" },
];

const NAV_FONT: React.CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  letterSpacing: "0.01em",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { itemCount } = useRepairCart();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const results = await searchCatalog(q);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, doSearch]);

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (link: string) => {
    navigate(link);
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  const getIcon = (tab: string) => {
    switch (tab) {
      case "phone": return <Smartphone size={14} className="text-gray-400" />;
      case "tablet": return <Tablet size={14} className="text-gray-400" />;
      case "watch": return <Watch size={14} className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-[#e8eaed] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-6 h-[100px] flex items-center">

          {/* LEFT: Logo + Nav tightly grouped */}
          <div className="flex items-center flex-1 min-w-0">
            <Link to="/" className="flex-shrink-0 mr-6">
              <img
                src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1773930131/repair-my-phone-screen-logo_jmngqv.webp"
                alt="Repair My Phone Screen"
                className="h-20 w-auto object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={NAV_FONT}
                  className="px-4 py-1 text-[#202124] hover:text-red-600 whitespace-nowrap transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Search + Cart + Mobile toggle */}
          <div className="flex items-center gap-1 flex-shrink-0 relative" ref={searchRef}>
            {searchOpen ? (
              <div className="flex items-center">
                <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1.5 mr-1 bg-white shadow-sm">
                  <Search size={15} className="text-gray-500 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search devices…"
                    style={NAV_FONT}
                    className="outline-none text-[#202124] w-32 sm:w-48 md:w-64 bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>

                {/* Search Results Dropdown */}
                {(searchResults.length > 0 || (searchQuery.length >= 2 && searchResults.length === 0)) && (
                  <div className="absolute top-full right-0 mt-3 w-72 sm:w-80 md:w-[450px] bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden z-[60] transform origin-top-right transition-all duration-200">
                    <div className="py-2">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                            Found {searchResults.length} {searchResults.length === 1 ? 'device' : 'devices'}
                          </div>
                          <div className="max-h-[60vh] overflow-y-auto">
                            {searchResults.map((result, idx) => (
                              <button
                                key={`${result.name}-${idx}`}
                                onClick={() => handleResultClick(`/book-repair/${result.tab}/${slugifySegment(result.brandName)}/models/${result.slug}`)}
                                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 text-left transition-colors group border-b border-gray-50 last:border-0"
                              >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors overflow-hidden border border-transparent group-hover:border-gray-100 shadow-sm">
                                  {result.image ? (
                                    <img 
                                      src={result.image} 
                                      alt={result.name} 
                                      className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" 
                                    />
                                  ) : (
                                    getIcon(result.tab)
                                  )}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <div className="text-[14px] font-semibold text-[#202124] group-hover:text-red-600 transition-colors truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                    <span className="font-medium text-gray-400">{result.brandName}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="capitalize">{result.tab}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Search size={14} className="text-red-600" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search size={20} className="text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">No results found</p>
                          <p className="text-xs text-gray-500 mt-1">We couldn't find any device matching "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-[#202124]" />
              </button>
            )}

            <Link
              to="/repair-cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-[#202124]" />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X size={20} className="text-[#202124]" />
              ) : (
                <Menu size={20} className="text-[#202124]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#e8eaed] flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                style={NAV_FONT}
                className="px-5 py-3 text-[#202124] hover:text-red-600 border-b border-gray-50 last:border-0 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
