import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Zap,
    Globe,
    Shield,
    TrendingUp,
    Users,
    FileText,
    Lightbulb,
    BarChart,
    Rocket,
    Brain,
    Sparkles,
    Factory,
    Truck,
    Ship,
    Banknote,
    Building2,
    CheckCircle2,
    Cpu,
    Database,
    Network,
    Lock,
    Cloud,
    GitBranch,
    ArrowRight,
    Circle,
    ChevronRight
} from 'lucide-react';

const railSteps = [
    {
        icon: Factory,
        label: 'Factory & Warehouse',
        sub: ''
    },
    {
        icon: FileText,
        label: 'Documentation Hub',
        sub: ''
    },
    {
        icon: Shield,
        label: 'Customs & Compliance',
        sub: ''
    },
    {
        icon: Truck,
        label: 'Logistics & Ports',
        sub: ''
    },
    {
        icon: Ship,
        label: 'Shipping Line & Bank',
        sub: ''
    },
    {
        icon: Building2,
        label: 'Buyer Delivery',
        sub: ''
    }
];

const AboutManuDocs = () => {
    return (
        <section
            id="about"
            className="relative py-16 md:py-24 overflow-hidden min-h-screen"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-100"
                style={{
                    backgroundImage: "url('/images/0055.jpg')" // Replace with your image path
                }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/75"></div>

            {/* Main container with manu-green styling */}
            <div className="relative container mx-auto px-4 max-w-7xl z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-20 pt-6"
                >
                    <div className="flex flex-col items-center justify-center mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-center">
                            <span
                                className="bg-clip-text text-transparent"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg, #ff8000ff 0%, #f97316 20%, #f5f5f5 40%, #ffffff 60%, #02ff5fff 80%, #138808 100%)",
                                }}
                            >
                                India&apos;s
                                Unified Digital Trade Interface
                            </span>{" "}
                        </h1>



                    </div>

                </motion.div>

                {/* Trade Rail Container - manu-green styling */}
                <div className="mb-16 md:mb-20">
                    <div
                        className="relative rounded-3xl px-4 py-6 md:px-6 md:py-8 overflow-hidden  border-2 border-manu-green "
                    >
                        {/* Rail */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="relative"
                        >
                            {/* Header */}
                            <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                                <div>
                                    <p className=" uppercase tracking-[0.28em] text-white mb-2 font-bold text-xl">
                                        Unified export workflow
                                    </p>
                                    <h4 className="text-lg md:text-xl font-semibold text-white">
                                        One continuous line of sight from first document to final delivery
                                    </h4>
                                </div>
                            </div>

                            {/* Rail Container */}
                            <div className="relative overflow-x-auto">
                                <div className="min-w-[760px] md:min-w-0">
                                    <div className="relative flex items-center py-6">
                                        {/* Rail line */}
                                        <svg
                                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 w-full pointer-events-none"
                                        >
                                            <defs>
                                                <linearGradient id="rail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#22c55e" />
                                                    <stop offset="50%" stopColor="#22c55e" />
                                                    <stop offset="100%" stopColor="#22c55e" />
                                                </linearGradient>
                                            </defs>

                                            {/* Base rail */}
                                            <line
                                                x1="0"
                                                y1="1"
                                                x2="100%"
                                                y2="1"
                                                stroke="url(#rail-gradient)"
                                                strokeWidth="2"
                                                strokeOpacity="0.6"
                                                strokeDasharray="6 6"
                                            />

                                            {/* Animated highlight */}
                                            <motion.line
                                                x1="0"
                                                y1="1"
                                                x2="100%"
                                                y2="1"
                                                stroke="url(#rail-gradient)"
                                                strokeWidth="2"
                                                strokeDasharray="6 6"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                transition={{ duration: 2.2, ease: 'easeInOut' }}
                                            />

                                            {/* Moving signal */}
                                            <svg className="w-full h-16" viewBox="0 0 100 20" preserveAspectRatio="none">
                                                <motion.line
                                                    x1="0"
                                                    y1="10"
                                                    x2="100"
                                                    y2="10"
                                                    stroke="url(#rail-gradient)"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="6 6"
                                                />
                                                <motion.circle
                                                    r="4"
                                                    cy="20"
                                                    initial={{ cx: -5 }}
                                                    animate={{ cx: 105 }}
                                                    transition={{
                                                        duration: 4,
                                                        ease: 'linear',
                                                        repeat: Infinity
                                                    }}
                                                    fill="#22c55e"
                                                />
                                            </svg>
                                        </svg>

                                        {/* Nodes */}
                                        <div className="relative z-10 flex w-full items-start justify-between">
                                            {railSteps.map((step, index) => (
                                                <motion.div
                                                    key={step.label}
                                                    initial={{ opacity: 0, y: 14 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.45,
                                                        delay: index * 0.08,
                                                        ease: 'easeOut'
                                                    }}
                                                    viewport={{ once: true, margin: '-100px' }}
                                                    className="relative flex flex-col items-center text-center px-2"
                                                >
                                                    {/* Node */}
                                                    <motion.div
                                                        whileHover={{ y: -6, scale: 1.06 }}
                                                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                                                        className="mb-3 flex flex-col items-center gap-2"
                                                    >
                                                        <div className="relative">
                                                            <div
                                                                className="absolute inset-0 rounded-2xl blur-lg opacity-60 transition-opacity bg-manu-green"
                                                            />
                                                            <div
                                                                className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white/90 shadow-xl border border-manu-green"
                                                            >
                                                                <step.icon className="w-5 h-5 text-manu-green" />
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="h-2 w-2 rounded-full animate-pulse bg-manu-green shadow-lg"
                                                        />
                                                    </motion.div>

                                                    {/* Labels */}
                                                    <div className="mt-2">
                                                        <p className="text-sm font-semibold text-white mb-1">
                                                            {step.label}
                                                        </p>
                                                        <p className="text-xs text-gray-300 max-w-[150px] mx-auto leading-tight">
                                                            {step.sub}
                                                        </p>
                                                    </div>

                                                    {/* Connector arrow */}
                                                    {index < railSteps.length - 1 && (
                                                        <ChevronRight className="absolute -right-6 top-7 w-5 h-5 text-white" />
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutManuDocs;
