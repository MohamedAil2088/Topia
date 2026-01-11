import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiHeart, FiBell, FiSettings, FiGrid } from 'react-icons/fi';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { items } = useAppSelector((state) => state.cart);
    const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
    const { userInfo } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Socket.io for Live Notifications
    useEffect(() => {
        if (userInfo?.isAdmin) {
            const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

            socket.on('new_order', (data) => {
                toast.info(`🚀 New Order from ${data.customerName}! (${data.totalPrice} EGP)`, {
                    position: "top-right",
                    autoClose: 5000,
                });

                setNotifications(prev => [{
                    id: Date.now(),
                    message: `New Order: ${data.totalPrice} EGP`,
                    time: new Date().toLocaleTimeString(),
                    read: false
                }, ...prev]);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userInfo]);

    // Handle Scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    // Live Search Logic
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim().length > 2) {
                setSearchLoading(true);
                try {
                    const { data } = await import('../utils/api').then(module => module.default.get(`/products?keyword=${searchQuery}&limit=5`));
                    setSearchResults(data.data || []);
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setSearchLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        };

        const timeoutId = setTimeout(fetchSearchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setShowUserMenu(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed w-full z-50">
            {/* Main Navbar */}
            <nav className="bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/50 py-4 transition-all duration-300">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 z-50 ml-2 lg:ml-0">
                            <span className="text-2xl font-black tracking-tight text-gray-900">
                                TOPIA
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop', path: '/shop' },
                                { name: 'New Arrivals', path: '/shop?sort=-createdAt' },
                                { name: 'Designs', path: '/designs' },
                                { name: 'About', path: '/about' },
                                { name: 'Contact', path: '/contact' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-semibold transition-colors ${isActive(link.path)
                                        ? 'text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Icons */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {/* Search */}
                            <div className={`relative flex items-center transition-all duration-300 ${showSearch ? 'w-64 bg-gray-100 rounded-lg px-3' : 'w-auto'
                                }`}>
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                                    aria-label="Toggle search"
                                >
                                    <FiSearch size={20} />
                                </button>
                                {showSearch && (
                                    <div className="flex-1">
                                        <form onSubmit={handleSearchSubmit}>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm py-1 text-gray-900 placeholder-gray-500"
                                                autoComplete="off"
                                            />
                                        </form>

                                        {/* Live Results */}
                                        {(searchLoading || searchResults.length > 0) && (
                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg border border-gray-200 mt-2 overflow-hidden z-50">
                                                {searchLoading ? (
                                                    <div className="p-4 text-center text-gray-400 text-xs">Searching...</div>
                                                ) : (
                                                    <ul>
                                                        {searchResults.map((product) => (
                                                            <li key={product._id} className="border-b border-gray-100 last:border-none">
                                                                <Link
                                                                    to={`/product/${product._id}`}
                                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                                                    onClick={() => {
                                                                        setShowSearch(false);
                                                                        setSearchQuery('');
                                                                        setSearchResults([]);
                                                                    }}
                                                                >
                                                                    <img src={product.images?.[0] || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                                                        <p className="text-xs text-gray-600">{product.price} EGP</p>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li className="p-2 text-center bg-gray-50">
                                                            <Link
                                                                to={`/shop?search=${searchQuery}`}
                                                                className="text-xs font-semibold text-gray-900 hover:underline"
                                                                onClick={() => setShowSearch(false)}
                                                            >
                                                                View all results →
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors" aria-label="View wishlist">
                                <FiHeart size={20} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors" aria-label="View shopping cart">
                                <FiShoppingBag size={20} />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>

                            {/* Notifications (Admin) */}
                            {userInfo?.isAdmin && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        <FiBell size={20} />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                                <span className="text-xs font-semibold text-gray-700">Notifications</span>
                                                <button onClick={() => setNotifications([])} className="text-xs text-gray-600 hover:text-gray-900">Clear</button>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-center text-gray-400 text-xs">No new notifications</div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <p className="text-xs text-gray-800 font-medium">{n.message}</p>
                                                            <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* User Menu */}
                            {userInfo ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                                            {userInfo.name.charAt(0).toUpperCase()}
                                        </div>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{userInfo.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                            </div>

                                            <div className="py-1">
                                                {userInfo.isAdmin && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        <FiGrid size={16} />
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <FiUser size={16} />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    to="/profile/orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <FiPackage size={16} />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    to="/custom-orders/my-orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <span className="text-purple-600">🎨</span>
                                                    Custom Orders
                                                </Link>
                                                <Link
                                                    to="/profile/settings"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <FiSettings size={16} />
                                                    Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-200">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <FiLogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-3">
                            <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-gray-700">
                                <FiSearch size={20} />
                            </button>
                            <Link to="/cart" className="relative p-2 text-gray-700">
                                <FiShoppingBag size={20} />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-900 z-50">
                                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ${showSearch ? 'h-12 mb-3' : 'h-0'}`}>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-gray-900"
                            />
                        </form>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-8">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop', path: '/shop' },
                                { name: 'New Arrivals', path: '/shop?sort=-createdAt' },
                                { name: 'Designs', path: '/designs' },
                                { name: 'About', path: '/about' },
                                { name: 'Contact', path: '/contact' },
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="w-16 h-px bg-gray-200 my-4"></div>

                            {userInfo ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-semibold text-gray-600 hover:text-gray-900"
                                    >
                                        My Account
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="text-base font-semibold text-red-500 hover:text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
