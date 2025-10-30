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
    ChevronLeft,
    ChevronRight,
    Play,
    Pause
} from 'lucide-react';

// Professional Carousel Component
const ProfessionalGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for previous

    // High-quality professional images with titles
    const images = [
        {
            url: "https://i.postimg.cc/XY75kpCd/Gemini_Generated_Image_jev1mujev1mujev1_2.jpg",
            title: "AI-Powered Document Processing",
            description: "Advanced machine learning algorithms for intelligent document analysis"
        },
        {
            url: "https://i.postimg.cc/vm8vDGMS/image.png",
            title: "Real-time Analytics Dashboard",
            description: "Comprehensive insights into your trade documentation process"
        },
        {
            url: "https://i.postimg.cc/wjG15FHz/Whats_App_Image_2025_10_30_at_14_10_21_7e2b9f1b.jpg",
            title: "Indian Customs CONCOR Bengaluru visit",
            description: "Bank-grade security for all your sensitive trade documents"
        },
        {
            url: "https://i.postimg.cc/B6h9DP58/IMG-20251030-WA0715.jpg",
            title: "Indian Customs ICD WHITEFIELD ",
            description: "Meeting with Indian Customs officials at Whitefield ICD"
        },
        {
            url: "https://i.postimg.cc/85kgjmvC/IMG-20251030-WA0716.jpg",
            title: "Indian Customs ICD WHITEFIELD ",
            description: "taking review from customers at Whitefield ICD"
        },
        {
            url: "https://i.postimg.cc/zBdZWHwF/IMG-20251030-WA0708.jpg",
            title: "Incubated at RKIC BITS PILANI",
            description: ""
        },
        {
            url: "https://i.postimg.cc/cH1GrB3r/IMG-20251030-WA0712.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/509W6Szj/IMG-20251030-WA0710.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/mDZWty9z/IMG-20251030-WA0713.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/j580Nn6g/IMG-20251030-WA0709.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/26HRvLdG/IMG-20251030-WA0573.jpg",
            title: "Ministry of Port, Shipping and Waterways Visit",
            description: ""
        },
        {
            url: "https://i.postimg.cc/zBdZWHwV/IMG-20251030-WA0705.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/5y0JkS9S/image.png",
            title: "understanding the customs process",
            description: "Pain points of import-export documentation at ICD WHITEFIELD"
        },
        {
            url: "https://i.postimg.cc/C1bnxYjw/image.png",
            title: "CONCOR DRY PORT",
            description: "PORT VISIT TO UNDERSTAND THE LOGISTICS"
        },
        {
            url: "https://i.postimg.cc/5NSyrnmr/IMG-20251003-16470697.jpg",
            title: "CUSTOMER FEEDBACK AT NOIDA TRADE FAIR",
            description: "showcasing manudocs to real customers"
        },
        {
            url: "https://i.postimg.cc/wBJVKCbd/IMG-20251003-16512244.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/j50MLxJw/IMG-20251003-16523181.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/FsmwTZzS/Picsart-25-10-03-17-16-19-698.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/1XfxKRJh/IMG-20251021-WA0137.jpg",
            title: "MEETING WITH GOVT OFFICIALS",
            description: "Discussing trade documentation challenges and solutions"
        },
        {
            url: "https://i.postimg.cc/5y6cm9pR/IMG-20251021-WA0151.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/nzdb79KN/IMG-20251021-WA0155.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/J0GwQ7KP/IMG-20251021-WA0156.jpg",
            title: "",
            description: ""
        },
        {
            url: "https://i.postimg.cc/c4hkXtvG/image.png",
            title: "MEETING WITH SACHIN GUPTA",
            description: ""
        }
    ];

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Auto-scroll functionality
    useEffect(() => {
        if (!isPlaying || isHovered) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 1000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [isPlaying, isHovered, currentIndex]);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const nextSibling = e.target.nextElementSibling;
        if (nextSibling) {
            nextSibling.style.display = 'flex';
        }
    };

    // Animation variants for different directions
    // Animation variants for different directions
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.95
        })
    };
    return (
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="relative container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                        Innovation in Action
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Witness how MANUDOCS is transforming global trade documentation through cutting-edge AI technology
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div
                    className="relative max-w-6xl mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >


                    {/* Main Carousel */}
                    <div className="relative h-[600px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
                        <AnimatePresence mode="popLayout" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.7,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                className="absolute inset-0"
                            >
                                {/* Image with Gradient Overlay */}
                                <div className="relative w-full h-full">
                                    <img
                                        src={images[currentIndex].url}
                                        alt={images[currentIndex].title}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />

                                    {/* Fallback */}
                                    <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                        <div className="text-center text-gray-400">
                                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-2xl flex items-center justify-center">
                                                <FileText className="w-10 h-10" />
                                            </div>
                                            <p className="text-xl">Image not available</p>
                                        </div>
                                    </div>

                                    {/* Enhanced Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-12">
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, duration: 0.1 }}
                                            className="max-w-3xl mx-auto text-center"
                                        >
                                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                                {images[currentIndex].title}
                                            </h3>
                                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                                {images[currentIndex].description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <motion.button
                            onClick={prevSlide}
                            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/40 backdrop-blur-sm text-white rounded-2xl hover:bg-blue-600/80 transition-all duration-300 border border-white/10 hover:border-blue-400/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>

                        <motion.button
                            onClick={nextSlide}
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/40 backdrop-blur-sm text-white rounded-2xl hover:bg-blue-600/80 transition-all duration-300 border border-white/10 hover:border-blue-400/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </div>

                    {/* Enhanced Indicators */}
                    <div className="flex justify-center space-x-3 mt-8">
                        {images.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`relative rounded-full transition-all duration-500 ${currentIndex === index
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-12'
                                    : 'bg-gray-600 hover:bg-gray-500 w-3'
                                    } h-3`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {currentIndex === index && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-white/20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Enhanced Slide Counter */}
                    <motion.div
                        className="text-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-gray-400 text-lg font-medium">
                            <span className="text-white text-xl">{currentIndex + 1}</span>
                            <span className="mx-2">/</span>
                            <span>{images.length}</span>
                        </span>
                    </motion.div>
                </div>


            </div>
        </section>
    );
};


const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [activePage, setActivePage] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
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
        { number: '100%', label: 'Accuracy Rate' },
        { number: '24/7', label: 'Support' },
        { number: '50+', label: 'Countries' },
        { number: '10x', label: 'Faster Processing' }
    ];

    const companyContent = {
        'About Us': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    About MANUDOCS
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    MANUDOCS is revolutionizing global trade documentation through AI-powered automation.
                    Our platform combines cutting-edge technology with deep industry expertise to streamline
                    import-export processes for businesses worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">AI-Powered Automation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Global Compliance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Real-time Processing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Enterprise Security</span>
                    </div>
                </div>
            </motion.div>
        ),
        'Contact Us': (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Get in Touch
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {contactInfo.map((contact, index) => (
                        <motion.div
                            key={contact.type}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-400/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <contact.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">{contact.label}</p>
                                <p className="text-gray-300 text-sm">{contact.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-blue-300 text-sm text-center">
                        📞 Additional Numbers: +91 7697546063, +91 9958889387, +91 6376400524
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Help Center
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    Comprehensive support resources and troubleshooting guides for MANUDOCS users.
                    Our dedicated support team is available 24/7 to assist with any questions or issues.
                </p>
                <div className="grid gap-3 mt-6">
                    {['Document Upload Guide', 'AI Processing FAQ', 'Compliance Standards', 'API Integration'].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{item}</span>
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Privacy Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    We are committed to protecting your privacy and ensuring the security of your data.
                    Our comprehensive privacy policy outlines how we collect, use, and protect your information.
                </p>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mt-4">
                    <p className="text-green-300 text-sm">
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Import Documentation
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    Complete automated solutions for all your import documentation needs.
                    Ensure smooth customs clearance and compliance with intelligent document processing.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {['Customs Declarations', 'Import Licenses', 'Bill of Entry', 'Certificate of Origin'].map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{doc}</span>
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Export Documentation
                </h2>
                <p className="text-gray-300 leading-relaxed">
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    AI Document Processing
                </h2>
                <p className="text-gray-300 leading-relaxed">
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    Compliance Check
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    Ensure your import-export documents comply with all regulatory standards.
                    Reduce risk and eliminate delays with our comprehensive compliance verification system.
                </p>
            </motion.div>
        )
    };

    return (
        <>
            {/* Professional Gallery Section */}
            <ProfessionalGallery />

            {/* Footer Section */}
            <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                        {/* Brand Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative">
                                    <img
                                        src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                                        alt="MANUDOCS Logo"
                                        className="h-14 w-14 rounded-xl shadow-lg border-2 border-green-400/30"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute -inset-1 bg-green-500/10 rounded-xl blur-sm -z-10"></div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                        ManuDocs
                                    </h3>
                                    <p className="text-gray-400 text-sm">AI-Powered Export Documentation</p>
                                </div>
                            </div>

                            <p className="text-gray-300 max-w-md mb-8 leading-relaxed">
                                Revolutionizing global trade documentation through intelligent automation.
                                Streamline your import-export processes with our AI-powered platform.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                                    >
                                        <div className="text-lg font-bold text-green-400">{stat.number}</div>
                                        <div className="text-xs text-gray-400">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Icons */}
                            <div className="flex space-x-4">
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
                                            className="group p-3 bg-white/5 rounded-xl border border-white/10 hover:border-green-400/50 hover:bg-green-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Services */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center space-x-2">
                                <Rocket className="w-5 h-5 text-green-400" />
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
                                                className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            >
                                                <IconComponent className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                                <span className="flex-1">{service.name}</span>
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>

                        {/* Company */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center space-x-2">
                                <Users className="w-5 h-5 text-blue-400" />
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
                                                className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            >
                                                <IconComponent className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                                <span className="flex-1">{page.name}</span>
                                                {page.name === 'Privacy Policy' && (
                                                    <Shield className="w-3 h-3 opacity-60" />
                                                )}
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-700 pt-8"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-2 text-gray-400">
                                <Heart className="w-4 h-4 text-red-400" />
                                <span className="text-sm">
                                    © {currentYear} MANUDOCS. All rights reserved.
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-sm text-gray-500">
                                    Powered by AI & N8N Innovation
                                </span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm">
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
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <Globe className="w-4 h-4" />
                                    <span>Global</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll to Top Button */}
                <AnimatePresence>
                    {isVisible && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={scrollToTop}
                            className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </footer>

            {/* Content Modal */}
            <AnimatePresence>
                {activePage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => { setActivePage(null); setActiveType(null); }}
                    >
                        <motion.div
                            ref={contentRef}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700/50"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    {activeType === 'company' && companyContent[activePage]}
                                    {activeType === 'service' && serviceContent[activePage]}
                                </div>
                                <button
                                    onClick={() => { setActivePage(null); setActiveType(null); }}
                                    className="ml-4 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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