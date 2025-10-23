import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Award, Users, Rocket, Star } from 'lucide-react';

const BackedBySection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loadedImages, setLoadedImages] = useState({});

    const partners = [
        {
            name: 'IIT MADRAS',
            logo: 'https://i.postimg.cc/CZmcV5vk/iitm.png',
            description: 'NIRF 1 Ranked Institute',
            type: 'Premier Institute',
            achievements: ['NIRF Rank #1', 'Established 1959', '300+ Patents', '1500+ Research Papers'],
            color: 'from-manu-iitm to-manu-iitm'
        },
        {
            name: 'BITS Pilani',
            logo: 'https://i.postimg.cc/bG3mjr6t/BITS-Pilani-Logo.png',
            description: 'Premier Engineering Institute',
            type: 'Deemed University',
            achievements: ['NAAC A++', '4 Campuses', '50K+ Alumni', 'Top Recruiters'],
            color: 'from-manu-bits to-manu-bits'
        },
        {
            name: 'IIT PATNA',
            logo: 'https://i.postimg.cc/qtj1dqmC/IIT-PATNA.jpg',
            description: 'Top National Institute',
            type: 'TOP IIT',
            achievements: ['Established 2008', '120+ Faculty', 'Research Focus', 'Global Collaborations'],
            color: 'from-manu-light to-manu-light'
        },
        {
            name: 'PIEDS',
            logo: 'https://i.postimg.cc/CB5mM0tz/pieds-logo.jpg',
            description: 'Incubation Program',
            type: 'Incubator',
            achievements: ['Startup Support', 'Mentorship', 'Guidance', 'Networking'],
            color: 'from-manu-light to-manu-light'
        },
        {
            name: 'RKIC',
            logo: 'https://i.postimg.cc/N9FpGtVy/rkic.jpg',
            description: 'Rakesh Kapoor Innovation Centre',
            type: 'Innovation Hub',
            achievements: ['Industry Connect', 'Prototyping', 'Networking', 'Workshops'],

        },
        {
            name: 'IOI',
            logo: 'https://i.postimg.cc/phrqVv7T/IOI-B.jpg',
            description: 'Innovation Centre Bengaluru',
            type: 'Tech Hub',
            achievements: ['Bengaluru Base', 'Tech Innovation', 'Startup Ecosystem', 'Entrepreneurship'],
            color: 'from-manu-light to-manu-light'
        }
    ];

    // Auto-rotate carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % partners.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, partners.length]);

    // Preload images
    useEffect(() => {
        partners.forEach((partner) => {
            const img = new Image();
            img.src = partner.logo;
            img.onload = () => {
                setLoadedImages(prev => ({ ...prev, [partner.logo]: true }));
            };
            img.onerror = () => {
                setLoadedImages(prev => ({ ...prev, [partner.logo]: false }));
            };
        });
    }, []);

    const nextPartner = () => {
        setActiveIndex((current) => (current + 1) % partners.length);
        setIsAutoPlaying(false);
    };

    const prevPartner = () => {
        setActiveIndex((current) => (current - 1 + partners.length) % partners.length);
        setIsAutoPlaying(false);
    };

    const goToPartner = (index) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
    };

    const handleImageError = (e, partnerLogo) => {
        console.warn(`Failed to load logo: ${partnerLogo}`);
        e.target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'w-full h-full flex items-center justify-center text-white font-bold text-xs';
        fallback.textContent = e.target.alt?.split(' ')[0] || 'LOGO';
        e.target.parentNode.appendChild(fallback);
    };

    const getLogoContent = (partner, className = "") => {
        const isLoaded = loadedImages[partner.logo];

        if (isLoaded === false || !partner.logo) {
            return (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${partner.color} rounded-xl ${className}`}>
                    <span className="text-white font-bold text-sm">{partner.name.split(' ')[0]}</span>
                </div>
            );
        }

        return (
            <img
                src={partner.logo}
                alt={partner.name}
                className={`w-full h-full object-contain ${className}`}
                onError={(e) => handleImageError(e, partner.logo)}
                loading="lazy"
            />
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const activeCardVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 }
    };

    return (
        <section className="relative py-12 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden" id="backed-by">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/videos/backed-by.mp4"
                >
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-manu-dark/80 via-gray-900/60 to-manu-green/50"></div>

            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
                        <Award className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-xs md:text-sm font-semibold text-green-400 tracking-wider">TRUSTED PARTNERSHIPS</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 px-2">
                        Backed By <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Excellence</span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                        Supported by India's premier institutions and innovation ecosystems driving
                        cutting-edge research and entrepreneurial growth
                    </p>
                </motion.div>

                {/* Main Content - Mobile First Design */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                    {/* Mobile Navigation - Only show on small screens */}
                    <div className="lg:hidden w-full">
                        <div className="flex justify-center space-x-4 mb-6">
                            <motion.button
                                onClick={prevPartner}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </motion.button>

                            <div className="flex items-center space-x-2">
                                {partners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToPartner(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? 'bg-green-400 w-6'
                                            : 'bg-gray-600 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <motion.button
                                onClick={nextPartner}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Left - Carousel Navigation - Hidden on mobile */}
                    <div className="hidden lg:block lg:w-2/5">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {partners.map((partner, index) => (
                                <motion.button
                                    key={partner.name}
                                    variants={itemVariants}
                                    onClick={() => goToPartner(index)}
                                    className={`p-4 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 group ${activeIndex === index
                                        ? 'bg-white/10 border-green-400/50 shadow-lg shadow-green-400/20'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-400/30'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300`}>
                                            {getLogoContent(partner, "w-full h-full object-contain")}
                                        </div>
                                        <span className={`text-sm font-semibold text-center ${activeIndex === index ? 'text-white' : 'text-gray-400'
                                            } group-hover:text-white transition-colors`}>
                                            {partner.name}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right - Active Partner Showcase */}
                    <div className="w-full lg:w-3/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                variants={activeCardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 backdrop-blur-sm mx-auto max-w-2xl"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                                    {/* Logo and Basic Info */}
                                    <div className="flex-shrink-0 text-center md:text-left">
                                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${partners[activeIndex].color} flex items-center justify-center p-3 md:p-4 shadow-lg mx-auto md:mx-0 mb-4`}>
                                            {getLogoContent(partners[activeIndex], "w-full h-full object-contain")}
                                        </div>

                                        <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1 md:px-4 md:py-2 border border-white/10">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                                            <span className="text-xs md:text-sm font-semibold text-yellow-400">{partners[activeIndex].type}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Information */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                            {partners[activeIndex].name}
                                        </h3>

                                        <p className="text-base md:text-lg text-gray-300 mb-4 md:mb-6 leading-relaxed">
                                            {partners[activeIndex].description}
                                        </p>

                                        {/* Achievements */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center space-x-2 text-green-400 justify-center md:justify-start">
                                                <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                                                <span className="font-semibold text-sm md:text-base">Key Achievements</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {partners[activeIndex].achievements.map((achievement, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2 text-xs md:text-sm text-gray-300">
                                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                                                        <span className="break-words">{achievement}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation Controls - Hidden on mobile, shown on desktop */}
                                        <div className="hidden md:flex items-center justify-center md:justify-start space-x-4">
                                            <motion.button
                                                onClick={prevPartner}
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                            </motion.button>

                                            <div className="flex space-x-2">
                                                {partners.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => goToPartner(index)}
                                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                                            ? 'bg-green-400 w-6'
                                                            : 'bg-gray-600 hover:bg-gray-400'
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                            <motion.button
                                                onClick={nextPartner}
                                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                >
                    {[
                        { icon: Users, number: '6', label: 'Premier Partners' },
                        { icon: Award, number: '50+', label: 'Years Excellence' },
                        { icon: Rocket, number: '1000+', label: 'Startups Supported' },
                        { icon: Star, number: 'NIRF #1', label: 'Top Rankings' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex flex-col items-center space-y-2 md:space-y-3">
                                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-white">{stat.number}</div>
                                <div className="text-xs md:text-sm text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:px-8 md:py-4">
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-sm md:text-base text-gray-300 font-semibold">
                            Building the future of export documentation with India's best
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BackedBySection;