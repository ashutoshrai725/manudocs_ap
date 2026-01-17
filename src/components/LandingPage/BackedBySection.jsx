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
            description: 'Incubation Centre BITS Pilani',
            type: 'Incubator',
            achievements: ['Startup Support', 'Mentorship', 'Guidance', 'Networking'],
            color: 'from-manu-light to-manu-light'
        },
        {
            name: 'RKIC',
            logo: 'https://i.postimg.cc/sghhx5tS/rkic.png',
            description: 'Rakesh Kapoor Innovation Centre',
            type: 'Innovation Hub',
            achievements: ['Industry Connect', 'Prototyping', 'Networking', 'Workshops'],
            color: 'from-manu-light to-manu-light'
        },
        {
            name: 'IOI',
            logo: 'https://i.postimg.cc/phrqVv7T/IOI-B.jpg',
            description: 'PW Innovation Centre Bengaluru',
            type: 'Tech Hub',
            achievements: ['Bengaluru Base', 'Tech Innovation', 'Startup Ecosystem'],
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
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${partner.color || 'from-gray-600 to-gray-700'} rounded-xl ${className}`}>
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
        <section className="relative py-12 md:py-20 overflow-hidden" id="backed-by">
            {/* Background Image - Replace with your image source */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-100"
                style={{
                    backgroundImage: "url('/images/007.jpg')" // Replace with your image path
                }}
            />
            {/* Dark overlay for better text readability - EXACTLY LIKE FOOTER */}
            <div className="absolute inset-0 bg-black/75"></div>

            <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >


                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-manu-green mb-4 md:mb-6 px-2">
                        Backed By <span className="text-transparent bg-clip-text bg-manu-green">Excellence</span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4">
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
                                className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-300" />
                            </motion.button>

                            <div className="flex items-center space-x-2">
                                {partners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToPartner(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? 'bg-manu-green-400 w-6 shadow-lg'
                                            : 'bg-gray-600 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <motion.button
                                onClick={nextPartner}
                                className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-300" />
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
                                    className={`p-4 rounded-2xl  border-2 transition-all duration-300 group hover:shadow-xl ${activeIndex === index
                                        ? 'bg-white/15 border-manu-green-400/50 shadow-lg shadow-manu-green-400/25'
                                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-manu-green-400/30'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.color || 'from-gray-600 to-gray-700'} flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            {getLogoContent(partner, "w-full h-full object-contain")}
                                        </div>
                                        <span className={`text-sm font-semibold text-center ${activeIndex === index ? 'text-white' : 'text-gray-300'
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
                                className="bg-white/5  rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 mx-auto max-w-2xl hover:shadow-3xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                                    {/* Logo and Basic Info */}
                                    <div className="flex-shrink-0 text-center md:text-left">
                                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${partners[activeIndex].color || 'from-gray-600 to-gray-700'} flex items-center justify-center p-3 md:p-4 shadow-xl mx-auto md:mx-0 mb-4 border border-white/20`}>
                                            {getLogoContent(partners[activeIndex], "w-full h-full object-contain")}
                                        </div>

                                        <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 md:px-4 md:py-2 border border-white/20">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                                            <span className="text-xs md:text-sm font-semibold text-yellow-400">{partners[activeIndex].type}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Information */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                            {partners[activeIndex].name}
                                        </h3>

                                        <p className="text-base md:text-lg text-gray-200 mb-4 md:mb-6 leading-relaxed">
                                            {partners[activeIndex].description}
                                        </p>

                                        {/* Achievements */}
                                        <div className="space-y-3 mb-6">

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {partners[activeIndex].achievements.map((achievement, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2 text-xs md:text-sm text-gray-200">
                                                        <div className="w-1.5 h-1.5 bg-manu-green-400 rounded-full flex-shrink-0 shadow-sm"></div>
                                                        <span className="break-words">{achievement}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BackedBySection;
