import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, HelpCircle, Phone, Mail, MessageCircle, ChevronDown, ExternalLink, Sun, Moon, Info, FileText } from 'lucide-react'; // Added FileText
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [infoVisible, setInfoVisible] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const profileRef = useRef(null);
    const helpRef = useRef(null);
    const contactRef = useRef(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setInfoVisible(null);
    }, [location.pathname]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setInfoVisible(prev => prev === 'help' ? null : prev);
            }
            if (contactRef.current && !contactRef.current.contains(event.target)) {
                setInfoVisible(prev => prev === 'contact' ? null : prev);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdowns on ESC key
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                setIsProfileOpen(false);
                setInfoVisible(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleNavigation = (path, requiresAuth = false) => {
        if (requiresAuth && !user) {
            navigate('/auth');
        } else {
            navigate(path);
        }
        setIsMenuOpen(false);
        setInfoVisible(null);
    };

    const handleLogout = async () => {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        setInfoVisible(null);
        await onLogout();
    };

    const getUserDisplayName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <>
            <header className="fixed top-4 left-4 right-4 max-w-7xl mx-auto bg-blur-900/95 backdrop-blur-xl z-50 shadow-2xl rounded-2xl border border-gray-700/60 opacity-90">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo Section - DON'T CHANGE THIS PART */}
                        <div className="flex items-center space-x-1.5">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 rounded-xl p-2 transition-all duration-200 hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src="https://i.postimg.cc/GmQwgTBx/favicon_96x96.png"
                                        alt="MANUDOCS Logo"
                                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-lg border-2 border-green-400/30"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute -inset-1 bg-green-500/10 rounded-xl blur-sm -z-10"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg sm:text-2xl font-black bg-manu-green bg-clip-text text-transparent tracking-tight">
                                        ManuDocs
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium -mt-1"></span>
                                </div>
                            </button>

                            {/* ORIGINAL ABOUT US BUTTON - REVERTED BACK */}
                            <button
                                onClick={() => navigate('/about_us')}
                                className="lg:hidden p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                aria-label="About Us"
                            >
                                <Info size={18} /> {/* YEH ABOUT US ICON HI RAHEGA */}
                            </button>

                            {/* NEW BLOG BUTTON ADDED NEXT TO ABOUT US BUTTON */}
                            <a
                                href="https://blogs.manudocs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lg:hidden p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                aria-label="Blogs"
                            >
                                <FileText size={18} /> {/* YEH NAYA BLOG ICON */}
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <button
                                onClick={() => handleNavigation('/ai-agent', true)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center space-x-2 ${isActiveRoute('/ai-agent')
                                    ? 'bg-green-500 text-gray-900 shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400 hover:shadow-md'
                                    }`}
                            >
                                <MessageCircle size={16} />
                                <span>Generate Docs</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/upload', true)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center space-x-2 ${isActiveRoute('/upload')
                                    ? 'bg-green-500 text-gray-900 shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400 hover:shadow-md'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Upload Docs</span>
                            </button>

                            <Link
                                to="/about_us"
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-all duration-200"
                            >
                                <Info size={16} />
                                <span>About Us</span>
                            </Link>

                            {/* Blogs Button - Desktop */}
                            <a
                                href="https://blogs.manudocs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            >
                                <FileText size={16} />
                                <span>Blogs</span>
                                <ExternalLink size={14} className="opacity-70" />
                            </a>
                        </nav>

                        {/* Right Side - Auth or Profile */}
                        <div className="hidden lg:block">
                            {!user ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="bg-manu-green text-gray-900 px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 hover:scale-105"
                                >
                                    Sign Up / Login
                                </button>
                            ) : (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-3 bg-gray-800 border border-gray-700 hover:border-green-500/50 px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 group"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors max-w-32 truncate">
                                                {getUserDisplayName()}
                                            </p>
                                            <p className="text-xs text-gray-400">Active</p>
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/60 backdrop-blur-xl z-50 overflow-hidden">
                                            <div className="p-4 border-b border-gray-700">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {getUserDisplayName()}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate mt-1">{user.email}</p>
                                                {user.user_metadata?.phone && (
                                                    <p className="text-xs text-gray-400 mt-1">{user.user_metadata.phone}</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 transition-all duration-200 focus:outline-none"
                                            >
                                                <Settings size={16} />
                                                <span>Profile & Settings</span>
                                            </button>

                                            <hr className="border-gray-700" />

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/20 transition-all duration-200 focus:outline-none"
                                            >
                                                <LogOut size={16} />
                                                <span>Sign out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="lg:hidden border-t border-gray-700 pt-4 pb-6">
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleNavigation('/ai-agent', true)}
                                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveRoute('/ai-agent')
                                        ? 'bg-green-500 text-gray-900 shadow-lg'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400'
                                        }`}
                                >
                                    Generate Documents
                                </button>

                                <button
                                    onClick={() => handleNavigation('/upload', true)}
                                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveRoute('/upload')
                                        ? 'bg-green-500 text-gray-900 shadow-lg'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400'
                                        }`}
                                >
                                    Upload Documents
                                </button>

                                {/* About Us in Mobile Menu */}
                                <button
                                    onClick={() => navigate('/about_us')}
                                    className="flex items-center space-x-2 w-full text-left px-4 py-2 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200"
                                >
                                    <Info size={16} />
                                    <span>About Us</span>
                                </button>

                                {/* Blogs in Mobile Menu */}
                                <a
                                    href="https://blogs.manudocs.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200"
                                >
                                    <FileText size={16} />
                                    <span>Blogs</span>
                                    <ExternalLink size={14} className="ml-auto opacity-70" />
                                </a>

                                {/* Mobile Auth Section */}
                                <div className="pt-4 border-t border-gray-700">
                                    {!user ? (
                                        <button
                                            onClick={() => navigate('/auth')}
                                            className="block w-full text-center px-4 py-3 bg-manu-green text-gray-900 rounded-xl hover:shadow-lg font-semibold transition-all duration-200"
                                        >
                                            Sign Up / Login
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="px-4 py-3 bg-gray-800 rounded-xl">
                                                <p className="text-sm font-semibold text-white">{getUserDisplayName()}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200"
                                            >
                                                Profile & Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-900/20 hover:bg-red-900/30 transition-all duration-200"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Contact overlay - kept original */}
            {(infoVisible === 'help' || infoVisible === 'contact') && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={() => setInfoVisible(null)}>
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto border-t border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">
                                {infoVisible === 'help' ? 'Help & Support' : 'Contact Us'}
                            </h3>
                            <button onClick={() => setInfoVisible(null)} className="p-2 text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {infoVisible === 'help' && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        { step: 1, title: 'Sign Up / Login', desc: 'Create your account or sign in', color: 'green' },
                                        { step: 2, title: 'Upload Documents', desc: 'Upload your identity and company documents', color: 'blue' },
                                        { step: 3, title: 'Generate Documents', desc: 'Use AI Agent to create export documents', color: 'purple' }
                                    ].map((item) => (
                                        <div key={item.step} className={`flex items-start space-x-3 p-3 bg-${item.color}-900/20 rounded-xl border border-${item.color}-800/30`}>
                                            <div className={`w-6 h-6 bg-${item.color}-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5`}>
                                                {item.step}
                                            </div>
                                            <div>
                                                <p className={`font-semibold text-${item.color}-300`}>{item.title}</p>
                                                <p className={`text-sm text-${item.color}-200/80`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {infoVisible === 'contact' && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl border border-gray-600/30">
                                    <Mail className="text-gray-400" size={20} />
                                    <div>
                                        <p className="font-semibold text-white">Email</p>
                                        <p className="text-gray-300">manudocs.ai@gmail.com</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold text-white mb-2">Phone Support</p>
                                    <div className="space-y-2">
                                        {['+91 89495 22947', '+91 7697546063', '+91 9958889387', '+91 6376400524'].map((phone, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-gray-300">
                                                <Phone size={14} />
                                                <span>{phone}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;