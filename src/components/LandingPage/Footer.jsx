import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    Linkedin,
    ArrowUp,
    Globe,
    Shield,
    Heart,
    Rocket,
    FileText,
    CheckCircle,
    Users,
    Target,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [activePage, setActivePage] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        services: false,
        company: false
    });
    const contentRef = useRef(null);

    // Scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Show/hide scroll to top button
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleContactClick = (type) => {
        switch (type) {
            case 'email':
                window.location.href = 'mailto:manudocs.ai@gmail.com';
                break;
            case 'phone':
                window.location.href = 'tel:+918949522947';
                break;
            default:
                break;
        }
    };

    const handleServiceClick = (service) => {
        if (activePage === service && activeType === 'service') {
            setActivePage(null);
            setActiveType(null);
        } else {
            setActivePage(service);
            setActiveType('service');
        }
    };

    const handleCompanyClick = (page) => {
        if (activePage === page && activeType === 'company') {
            setActivePage(null);
            setActiveType(null);
        } else {
            setActivePage(page);
            setActiveType('company');
        }
    };

    useEffect(() => {
        if (activePage && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activePage]);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
    };

    const services = [
        {
            name: 'Import Documentation',
            icon: FileText,
            description: 'Complete automated import documentation solutions'
        },
        {
            name: 'Export Documentation',
            icon: Rocket,
            description: 'Streamlined export document management'
        },
        {
            name: 'AI Document Processing',
            icon: CheckCircle,
            description: 'Intelligent document extraction and validation'
        },
        {
            name: 'Compliance Check',
            icon: Shield,
            description: 'Regulatory compliance verification'
        }
    ];

    const companyPages = [
        {
            name: 'About Us',
            icon: Users,
            description: 'Learn about our mission and team'
        },
        {
            name: 'Contact Us',
            icon: Mail,
            description: 'Get in touch with our team'
        },
        {
            name: 'Help Center',
            icon: Target,
            description: 'Find answers and support'
        },
        {
            name: 'Privacy Policy',
            icon: Shield,
            description: 'Your data protection matters'
        }
    ];

    const contactInfo = [
        {
            type: 'email',
            icon: Mail,
            label: 'Email us',
            value: 'manudocs.ai@gmail.com',
            action: () => handleContactClick('email')
        },
        {
            type: 'phone',
            icon: Phone,
            label: 'Call us',
            value: '+91 89495 22947',
            action: () => handleContactClick('phone')
        },
        {
            type: 'linkedin',
            icon: Linkedin,
            label: 'LinkedIn',
            value: '@manudocs',
            action: () => window.open('https://linkedin.com/company/manudocs', '_blank')
        }
    ];

    const stats = [
        { number: '100%', label: 'Accuracy' },
        { number: '24/7', label: 'Support' },
        { number: '50+', label: 'Countries' },
        { number: '10x', label: 'Faster' }
    ];

    const companyContent = {
        'About Us': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    About MANUDOCS
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    MANUDOCS is revolutionizing global trade documentation through AI-powered automation.
                    Our platform combines cutting-edge technology with deep industry expertise to streamline
                    import-export processes for businesses worldwide.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {['AI-Powered Automation', 'Global Compliance', 'Real-time Processing', 'Enterprise Security'].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-manu-green-400 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-300">{item}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        ),
        'Contact Us': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 md:space-y-6"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Get in Touch
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {contactInfo.map((contact, index) => (
                        <motion.div
                            key={contact.type}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-manu-green-500/30 hover:border-manu-green-400/50 transition-all duration-300"
                        >
                            <div className="w-10 h-10 bg-manu-green-500/20 rounded-lg flex items-center justify-center border border-manu-green-500/30 flex-shrink-0">
                                <contact.icon className="w-5 h-5 text-manu-green-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white text-sm">{contact.label}</p>
                                <p className="text-gray-300 text-xs truncate">{contact.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="p-3 bg-manu-green-500/10 border border-manu-green-500/20 rounded-xl">
                    <p className="text-manu-green-300 text-xs text-center">
                        📞 Additional: +91 7697546063, +91 9958889387
                    </p>
                </div>
            </motion.div>
        ),
        'Help Center': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Help Center
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    Comprehensive support resources and troubleshooting guides for MANUDOCS users.
                    Our dedicated support team is available 24/7 to assist with any questions or issues.
                </p>
                <div className="grid gap-2 mt-4">
                    {['Document Upload Guide', 'AI Processing FAQ', 'Compliance Standards', 'API Integration'].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-gray-700/30">
                            <CheckCircle className="w-3 h-3 text-manu-green-400 flex-shrink-0" />
                            <span className="text-gray-300 text-xs">{item}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        ),
        'Privacy Policy': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Privacy Policy
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    We are committed to protecting your privacy and ensuring the security of your data.
                    Our comprehensive privacy policy outlines how we collect, use, and protect your information.
                </p>
                <div className="p-3 bg-manu-green-500/10 border border-manu-green-500/20 rounded-xl mt-4">
                    <p className="text-manu-green-300 text-xs">
                        🔒 Your data is encrypted and protected with enterprise-grade security measures.
                    </p>
                </div>
            </motion.div>
        )
    };

    const serviceContent = {
        'Import Documentation': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Import Documentation
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    Complete automated solutions for all your import documentation needs.
                    Ensure smooth customs clearance and compliance with intelligent document processing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {['Customs Declarations', 'Import Licenses', 'Bill of Entry', 'Certificate of Origin'].map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <FileText className="w-3 h-3 text-manu-green-400 flex-shrink-0" />
                            <span className="text-gray-300 text-xs">{doc}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        ),
        'Export Documentation': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Export Documentation
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    Reliable export documentation management to support your global trade operations.
                    Generate accurate documents with speed and precision using our AI-powered platform.
                </p>
            </motion.div>
        ),
        'AI Document Processing': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    AI Document Processing
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    Leverage artificial intelligence to extract, validate, and process trade documents efficiently.
                    Our advanced algorithms ensure error-free processing and compliance verification.
                </p>
            </motion.div>
        ),
        'Compliance Check': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-xl md:text-2xl font-bold text-manu-green-400 mb-4">
                    Compliance Check
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    Ensure your import-export documents comply with all regulatory standards.
                    Reduce risk and eliminate delays with our comprehensive compliance verification system.
                </p>
            </motion.div>
        )
    };

    return (
        <>
            <footer className="relative bg-black text-white overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-100"
                    style={{
                        backgroundImage: "url('/images/009.jpg')"
                    }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/75"></div>

                <div className="relative container mx-auto px-4 py-8 md:py-16">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
                        {/* Brand Section - Full width on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative">
                                    <img
                                        src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                                        alt="MANUDOCS Logo"
                                        className="h-12 w-12 md:h-14 md:w-14 rounded-xl shadow-lg border-2 border-manu-green-400/30"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute -inset-1 bg-manu-green-500/10 rounded-xl blur-sm -z-10"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-manu-green-400">
                                        ManuDocs
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm">AI-Powered Export Documentation</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
                                Revolutionizing global trade documentation through intelligent automation.
                                Streamline your import-export processes with our AI-powered platform.
                            </p>

                            {/* Stats - Compact on mobile */}
                            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 shadow-lg"
                                    >
                                        <div className="text-sm md:text-lg font-bold text-manu-green-400">{stat.number}</div>
                                        <div className="text-xs text-gray-400">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Icons */}
                            <div className="flex space-x-3">
                                {contactInfo.map((contact, index) => {
                                    const IconComponent = contact.icon;
                                    return (
                                        <motion.button
                                            key={contact.type}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.2 }}
                                            onClick={contact.action}
                                            className="group p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 hover:border-manu-green-400/50 hover:bg-manu-green-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-manu-green-400 focus:ring-opacity-50 shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-manu-green-400 transition-colors" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Services - Accordion on mobile */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => toggleSection('services')}
                                className="flex items-center justify-between w-full p-4 text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <Rocket className="w-5 h-5 text-manu-green-400" />
                                    <span className="font-semibold">Services</span>
                                </div>
                                {expandedSections.services ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>

                            <AnimatePresence>
                                {expandedSections.services && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="space-y-2 pl-6 pb-3">
                                            {services.map((service, index) => {
                                                const IconComponent = service.icon;
                                                return (
                                                    <motion.li
                                                        key={service.name}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <button
                                                            onClick={() => handleServiceClick(service.name)}
                                                            className="flex items-center space-x-2 w-full p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group text-left text-sm"
                                                        >
                                                            <IconComponent className="w-3 h-3 text-manu-green-400" />
                                                            <span>{service.name}</span>
                                                        </button>
                                                    </motion.li>
                                                );
                                            })}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Services - Desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center space-x-2">
                                <Rocket className="w-5 h-5 text-manu-green-400" />
                                <span>Services</span>
                            </h3>
                            <ul className="space-y-3">
                                {services.map((service, index) => {
                                    const IconComponent = service.icon;
                                    return (
                                        <motion.li
                                            key={service.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <button
                                                onClick={() => handleServiceClick(service.name)}
                                                className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-manu-green-400 focus:ring-opacity-50 text-sm"
                                            >
                                                <IconComponent className="w-4 h-4 text-manu-green-400 group-hover:scale-110 transition-transform" />
                                                <span className="flex-1">{service.name}</span>
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>

                        {/* Company - Accordion on mobile */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => toggleSection('company')}
                                className="flex items-center justify-between w-full p-4 text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-manu-blue-400" />
                                    <span className="font-semibold">Company</span>
                                </div>
                                {expandedSections.company ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>

                            <AnimatePresence>
                                {expandedSections.company && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="space-y-2 pl-6 pb-3">
                                            {companyPages.map((page, index) => {
                                                const IconComponent = page.icon;
                                                return (
                                                    <motion.li
                                                        key={page.name}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <button
                                                            onClick={() => handleCompanyClick(page.name)}
                                                            className="flex items-center space-x-2 w-full p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group text-left text-sm"
                                                        >
                                                            <IconComponent className="w-3 h-3 text-manu-blue-400" />
                                                            <span>{page.name}</span>
                                                        </button>
                                                    </motion.li>
                                                );
                                            })}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Company - Desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center space-x-2">
                                <Users className="w-5 h-5 text-manu-blue-400" />
                                <span>Company</span>
                            </h3>
                            <ul className="space-y-3">
                                {companyPages.map((page, index) => {
                                    const IconComponent = page.icon;
                                    return (
                                        <motion.li
                                            key={page.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <button
                                                onClick={() => handleCompanyClick(page.name)}
                                                className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-manu-green-400 focus:ring-opacity-50 text-sm"
                                            >
                                                <IconComponent className="w-4 h-4 text-manu-blue-400 group-hover:scale-110 transition-transform" />
                                                <span className="flex-1">{page.name}</span>
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar - Stacked on mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-700/50 pt-6"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                                    <span className="text-xs md:text-sm">
                                        © {currentYear} MANUDOCS. All rights reserved.
                                    </span>
                                </div>
                                <span className="hidden sm:inline text-gray-500">•</span>
                                <span className="text-xs md:text-sm text-gray-500">
                                    Powered by AI & N8N Innovation
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:justify-between">
                                <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
                                    <button
                                        onClick={() => handleCompanyClick('Terms of Service')}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        Terms of Service
                                    </button>
                                    <button
                                        onClick={() => handleCompanyClick('Support')}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        Support
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm">
                                    <Globe className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>Global</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll to Top Button - Smaller on mobile */}
                <AnimatePresence>
                    {isVisible && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={scrollToTop}
                            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 p-2 md:p-3 bg-manu-green-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-manu-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-manu-green-400 focus:ring-opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </footer>

            {/* Content Modal - Responsive */}
            <AnimatePresence>
                {activePage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-2 md:p-4"
                        onClick={() => { setActivePage(null); setActiveType(null); }}
                    >
                        <motion.div
                            ref={contentRef}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-md md:max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto shadow-2xl border border-manu-green-500/30 mt-16 md:mt-0"
                        >
                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                <div className="flex-1 pr-2">
                                    {activeType === 'company' && companyContent[activePage]}
                                    {activeType === 'service' && serviceContent[activePage]}
                                </div>
                                <button
                                    onClick={() => { setActivePage(null); setActiveType(null); }}
                                    className="ml-2 p-1 md:p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-manu-green-400"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Footer;