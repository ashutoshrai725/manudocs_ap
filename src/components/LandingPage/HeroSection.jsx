import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Pause, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = ({ isMobile, user }) => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isMobile) {
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    console.log('Mobile video play failed:', error);
                    setIsPlaying(false);
                });
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    }, [isMobile]);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    };

    const handleSearchClick = () => {
        if (user) navigate('/ai-agent');
        else {
            setShowAuthPrompt(true);
            setTimeout(() => {
                navigate('/auth');
                setShowAuthPrompt(false);
            }, 1500);
        }
    };

    const handleNavigation = (path, requiresAuth = false) => {
        if (requiresAuth && !user) navigate('/auth');
        else navigate(path);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    const getUserDisplayName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.parentElement.querySelector('.e-cha-fallback');
        if (fallback) fallback.style.display = 'flex';
    };

    const closeAuthPrompt = () => setShowAuthPrompt(false);

    // Optimized animations
    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
    };

    const rightSideVariants = {
        hidden: { opacity: 0, x: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.15,
                ease: "easeOut"
            }
        },
    };

    const floatingAnimation = {
        animate: {
            y: [0, -8, 0],
        },
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const textGlowAnimation = {
        animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        },
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "linear"
        }
    };

    return (
        <section className="relative min-h-screen w-full bg-manu-light overflow-hidden" id="backed-by">
            {/* Background Video */}
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
                autoPlay
                loop
                muted
                playsInline
                src="/videos/4KVIDE.mp4"
            >
                Your browser does not support the video tag.
            </video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-manu-dark/80 via-gray-900/70 to-manu-green/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-manu-dark/60 via-transparent to-transparent"></div>

            {/* Video Controls */}


            {/* Hero Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 mt-8">
                {/* Left Side - Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 w-full text-white space-y-4 lg:space-y-6 mt-12 lg:mt-0 lg:pr-4"
                >
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-manu-green/20 border border-manu-green/40 rounded-xl px-3 py-2 backdrop-blur-sm"
                        >
                            <Sparkles size={14} className="text-manu-green" />
                            <p className="text-manu-green text-xs font-medium">
                                Welcome back, {getUserDisplayName()}!
                            </p>
                        </motion.div>
                    )}

                    <div className="space-y-3">
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15
                                    }
                                }
                            }}
                        >
                            {/* AI-Powered */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }
                                    }
                                }}
                                className="overflow-hidden"
                            >
                                AI-Powered
                            </motion.div>

                            {/* Export Documentation */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }
                                    }
                                }}
                                className="overflow-hidden"
                            >
                                <motion.span
                                    className="text-manu-green bg-gradient-to-r from-manu-green via-green-300 to-green-500 bg-clip-text text-transparent bg-[length:200%_auto]"
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    Export Documentation
                                </motion.span>
                            </motion.div>

                            {/* for Global Trade */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -40 },
                                    visible: {
                                        opacity: 1,
                                        x: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            delay: 0.3
                                        }
                                    }
                                }}
                                className="overflow-hidden"
                            >
                                for Global Trade
                            </motion.div>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-lg leading-relaxed lg:ml-8"
                        >
                            Transform your export documentation process with AI. Upload invoices, extract data automatically, and generate professional export documents in minutes.
                        </motion.p>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4 sm:gap-6 pt-2 lg:ml-20"
                    >
                        {[
                            { value: "100%", label: "Accuracy Rate" },
                            { value: "3 Min", label: "Avg. Processing" },
                            { value: "1000+", label: "Documents Generated" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.value}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex flex-col items-start"
                            >
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 pt-4 lg:ml-16"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigation('/upload', true)}
                            className="group relative bg-gradient-to-r from-manu-green to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg overflow-hidden min-w-[140px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-manu-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center justify-center gap-2 text-sm">
                                {user ? 'Upload Documents' : 'Get Started Free'}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigation('/ai-agent', true)}
                            className="group relative bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 min-w-[140px]"
                        >
                            <span className="flex items-center justify-center gap-2 text-sm">
                                {user ? 'Generate Documents' : 'Watch Demo'}
                                <Play size={14} />
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right Side - AI Agent */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={rightSideVariants}
                    className="flex-1 w-full flex justify-center lg:justify-end items-center py-6 lg:py-0 lg:pl-4"
                >
                    <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm lg:max-w-md">
                        <motion.div
                            animate={floatingAnimation.animate}
                            transition={floatingAnimation.transition}
                            className="relative w-full flex justify-center"
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                        >
                            {/* Main Image Container */}
                            <div className="relative">
                                {/* Glow Effect */}
                                <motion.div
                                    animate={{
                                        opacity: isHovered ? 0.4 : 0.2,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-manu-green/30 blur-lg rounded-2xl -inset-2"
                                />

                                <img
                                    src="https://i.postimg.cc/XJbWW8k4/e0chaaigent.png"
                                    alt="E-CHA AI Agent"
                                    className="relative w-full max-w-[260px] sm:max-w-[240px] lg:max-w-[280px] h-auto object-contain drop-shadow-xl opacity-90 rounded-2xl z-10 "
                                    onError={handleImageError}
                                    loading="eager"
                                />

                                <div className="e-cha-fallback hidden w-full h-[200px] sm:h-[240px] lg:h-[280px] bg-gradient-to-br from-manu-green to-green-600 rounded-2xl flex items-center justify-center shadow-xl z-10">
                                    <div className="text-white text-center">
                                        <div className="text-4xl mb-3">🤖</div>
                                        <div className="text-xl font-bold">E-CHA</div>
                                        <div className="text-xs opacity-80 mt-1">AI Agent</div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar - Overlay on top of image */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-4 left-1/6 transform -translate-x-1/2 w-full max-w-[260px] sm:max-w-[300px] px-4 z-20  py-4 mb-5"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="bg-black/50 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-manu-green/40 relative overflow-hidden"
                                >
                                    {/* Animated border */}
                                    <motion.div
                                        animate={{
                                            background: [
                                                'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.4), transparent)',
                                                'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.8), transparent)',
                                                'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.4), transparent)'
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-xl"
                                    />

                                    <div className="relative flex items-center space-x-2 z-10 ">
                                        <Search className="text-manu-green flex-shrink-0" size={16} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={user ? "Generate Invoice..!" : "Try E-CHA & Generate Docs!!"}
                                            className="flex-1 bg-transparent outline-none text-white placeholder-green-200 text-sm font-medium min-w-0"
                                            onClick={handleSearchClick}
                                            onKeyDown={handleKeyDown}
                                            readOnly
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSearchClick}
                                            className="bg-gradient-to-r from-manu-green to-green-500 text-white p-2 rounded-lg hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-md transition-all duration-200 flex-shrink-0"
                                            aria-label="Search or access AI agent"
                                        >
                                            <Search size={14} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Auth Prompt Modal */}
            <AnimatePresence>
                {showAuthPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeAuthPrompt}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="bg-gradient-to-br from-gray-900 to-manu-dark rounded-2xl p-6 text-center max-w-sm mx-4 shadow-2xl border border-manu-green/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-4xl mb-4"
                            >
                                🤖
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Hello! I'm E-CHA
                            </h3>
                            <p className="text-gray-300 mb-4 text-sm">
                                To help you with document processing, please sign up or log in first.
                            </p>
                            <div className="w-full bg-manu-green/30 h-1.5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="h-full bg-manu-green rounded-full"
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                Redirecting to authentication...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HeroSection;