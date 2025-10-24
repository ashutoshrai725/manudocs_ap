import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, HelpCircle, Phone, Mail, MessageCircle, ChevronDown, ExternalLink, Sun, Moon } from 'lucide-react';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [infoVisible, setInfoVisible] = useState(null);
    const [darkMode, setDarkMode] = useState(true); // Default to dark mode
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

                        {/* Logo Section */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 rounded-xl p-2 transition-all duration-200 hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                                        alt="MANUDOCS Logo"
                                        className="h-10 w-10 rounded-xl shadow-lg border-2 border-green-400/30"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute -inset-1 bg-green-500/10 rounded-xl blur-sm -z-10"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent tracking-tight">
                                        ManuDocs
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium -mt-1">
                                    </span>
                                </div>
                            </button>
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

                            <button
                                onClick={() => handleNavigation('/duty-calculator', true)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center space-x-2 ${isActiveRoute('/duty-calculator')
                                    ? 'bg-green-500 text-gray-900 shadow-lg shadow-green-500/25'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400 hover:shadow-md'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Duty Calculator</span>
                            </button>




                            {/* Help Dropdown */}
                            <div className="relative" ref={helpRef}>
                                <button
                                    onClick={() => setInfoVisible(infoVisible === 'help' ? null : 'help')}
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                >
                                    <HelpCircle size={16} />
                                    <span>Help</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${infoVisible === 'help' ? 'rotate-180' : ''}`} />
                                </button>

                                {infoVisible === 'help' && (
                                    <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/60 backdrop-blur-xl z-50 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-green-900/50 rounded-xl flex items-center justify-center">
                                                    <HelpCircle className="text-green-400" size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">Getting Started Guide</h3>
                                                    <p className="text-sm text-gray-400">Follow these steps to begin</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start space-x-3 p-3 bg-green-900/20 rounded-xl border border-green-800/30">
                                                    <div className="w-6 h-6 bg-green-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                                                    <div>
                                                        <p className="font-semibold text-green-300">Sign Up / Login</p>
                                                        <p className="text-sm text-green-200/80">Create your account or sign in</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start space-x-3 p-3 bg-blue-900/20 rounded-xl border border-blue-800/30">
                                                    <div className="w-6 h-6 bg-blue-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                                                    <div>
                                                        <p className="font-semibold text-blue-300">Upload Documents</p>
                                                        <p className="text-sm text-blue-200/80">Upload your identity and company documents</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start space-x-3 p-3 bg-purple-900/20 rounded-xl border border-purple-800/30">
                                                    <div className="w-6 h-6 bg-purple-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                                                    <div>
                                                        <p className="font-semibold text-purple-300">Generate Documents</p>
                                                        <p className="text-sm text-purple-200/80">Use AI Agent to create export documents</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full mt-4 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-500 transition-colors duration-200 flex items-center justify-center space-x-2">
                                                <ExternalLink size={14} />
                                                <span>View Full Documentation</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Dropdown */}
                            <div className="relative" ref={contactRef}>
                                <button
                                    onClick={() => setInfoVisible(infoVisible === 'contact' ? null : 'contact')}
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                >
                                    <Phone size={16} />
                                    <span>Contact</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${infoVisible === 'contact' ? 'rotate-180' : ''}`} />
                                </button>

                                {infoVisible === 'contact' && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/60 backdrop-blur-xl z-50 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-900/50 rounded-xl flex items-center justify-center">
                                                    <Phone className="text-blue-400" size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">Contact Support</h3>
                                                    <p className="text-sm text-gray-400">We're here to help you</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl border border-gray-600/30">
                                                    <Mail className="text-gray-400" size={16} />
                                                    <div>
                                                        <p className="font-semibold text-white">Email</p>
                                                        <p className="text-sm text-gray-300">manudocs.ai@gmail.com</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="font-semibold text-white text-sm">Phone Support</p>
                                                    <div className="space-y-1">
                                                        {['+91 89495 22947', '+91 7697546063', '+91 9958889387', '+91 6376400524'].map((phone, index) => (
                                                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-green-400 cursor-pointer transition-colors">
                                                                <Phone size={12} />
                                                                <span>{phone}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-green-900/30 rounded-xl border border-green-800/30">
                                                <p className="text-sm text-green-300 font-medium text-center">
                                                    📞 Available 24/7 for urgent export document queries
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Right Side - Auth or Profile */}
                        <div className="hidden lg:block">
                            {!user ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 hover:scale-105"
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




                                <button
                                    onClick={() => setInfoVisible('contact')}
                                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200"
                                >
                                    Contact Us
                                </button>

                                {/* Mobile Auth Section */}
                                <div className="pt-4 border-t border-gray-700">
                                    {!user ? (
                                        <button
                                            onClick={() => navigate('/auth')}
                                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-gray-900 rounded-xl hover:shadow-lg font-semibold transition-all duration-200"
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

            {/* Mobile Info Overlay */}
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