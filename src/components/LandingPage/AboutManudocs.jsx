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
        sub: 'Orders, SKUs, inventory snapshots'
    },
    {
        icon: FileText,
        label: 'Documentation Hub',
        sub: 'Invoices, packing lists, shipping bills'
    },
    {
        icon: Shield,
        label: 'Customs & Compliance',
        sub: 'DGFT, ICEGATE, duties, licences'
    },
    {
        icon: Truck,
        label: 'Logistics & Ports',
        sub: 'Transporters, CFS, terminals'
    },
    {
        icon: Ship,
        label: 'Shipping Line & Bank',
        sub: 'BL, eBRC, remittances'
    },
    {
        icon: Building2,
        label: 'Buyer Delivery',
        sub: 'POD, claims, dispute-free closure'
    }
];

const AboutManuDocs = () => {
    // More concise feature descriptions
    const features = [
        {
            icon: Brain,
            title: 'What is ManuDocs?',
            subtitle: 'India\'s Unified Trade Interface for exports.',
            bullets: [
                'Single digital layer unifying India\'s fragmented import-export ecosystem',
                'Orchestrates key government systems: DGFT, ICEGATE, ULIP, NLP Marine, PCS',
                'Integrates shipping lines, logistics, banks, and buyer systems',
                'Does not replace existing systems — unifies them into one exporter experience'
            ],
            color: 'from-sky-500 to-cyan-400',
            gradient: 'bg-gradient-to-br from-sky-900/20 to-cyan-900/20'
        },
        {
            icon: Target,
            title: 'Our Mission',
            subtitle: 'To make exporting simple, transparent and self-service for Indian MSMEs.',
            bullets: [
                'Unify multiple government portals and private platforms into one interface',
                'Remove documentation complexity and prevent compliance errors',
                'Reduce exporter dependency on agents and manual coordination',
                'Enable transparent workflows with real-time visibility for exporters and buyers',
                'Lower time, cost, and friction in export shipments'
            ],
            color: 'from-emerald-500 to-green-400',
            gradient: 'bg-gradient-to-br from-emerald-900/20 to-green-900/20'
        },
        {
            icon: Zap,
            title: 'What We Do',
            subtitle: 'Everything to move shipments from factory to buyer — on one platform.',
            bullets: [
                'AI-driven export documentation with intelligent data validation',
                'Auto-preparation for invoices, packing lists, and shipping bills',
                'End-to-end shipment visibility across ports and destinations',
                'Digital document management with secure e-doc sharing',
                'Predictive alerts for delays, demurrage risk, and compliance gaps',
                'Single exporter dashboard replacing multiple portals'
            ],
            color: 'from-indigo-500 to-fuchsia-500',
            gradient: 'bg-gradient-to-br from-indigo-900/20 to-fuchsia-900/20'
        }
    ];

    const impactStats = [
        {
            icon: FileText,
            value: '60–80%',
            label: 'Lower Manual Effort',
            description: 'Automation across export documentation & filings',
            color: 'text-cyan-400'
        },
        {
            icon: Shield,
            value: '99%+',
            label: 'Data Accuracy',
            description: 'Pre-validation before Customs & DGFT submission',
            color: 'text-emerald-400'
        },
        {
            icon: TrendingUp,
            value: 'Faster',
            label: 'Clearances',
            description: 'Reduced rejections, delays & follow-ups',
            color: 'text-sky-400'
        },
        {
            icon: Globe,
            value: 'End-to-End',
            label: 'Visibility',
            description: 'Factory → Port → Destination',
            color: 'text-indigo-400'
        }
    ];

    const extraMetrics = [
        {
            label: 'Shipments orchestration ',
            value: '10K+',
            hint: 'Building on real exporter workflows',
            icon: GitBranch,
            color: 'text-cyan-400'
        },
        {
            label: 'System unifying orchestration ',
            value: '12+',
            hint: 'DGFT, ICEGATE, logistics, and banks',
            icon: Network,
            color: 'text-sky-400'
        },
        {
            label: 'Setup time reduction',
            value: '70%',
            hint: 'From weeks of manual setup to days',
            icon: Zap,
            color: 'text-emerald-400'
        }
    ];

    const futureVision = [
        {
            title: 'Unified Trade Infrastructure',
            description:
                'A single digital layer connecting DGFT, ICEGATE, ports, shipping lines, and banks — eliminating fragmentation.',
            icon: Sparkles,
            features: ['Interoperability', 'Real-time sync', 'Standardized protocols']
        },
        {
            title: 'Agentic AI for Exports',
            description:
                'AI that acts like a digital export manager — guiding, predicting risks, and automating decisions.',
            icon: Brain,
            features: ['Predictive analytics', 'Risk assessment', 'Smart recommendations']
        },
        {
            title: 'Trust & Transparency Layer',
            description:
                'Shared visibility for exporters and buyers to build confidence and reduce disputes.',
            icon: Users,
            features: ['Role-based access', 'Document sharing', 'Audit trails']
        }
    ];

    const platformFeatures = [
        {
            title: 'Intelligent AI,RAG Automation',
            description: 'AI-powered document processing and compliance checks',
            icon: Cpu,
            color: 'from-cyan-500 to-blue-500'
        },
        {
            title: 'Real-time Personalized Analytics',
            description: 'Live dashboards with predictive insights and reporting',
            icon: BarChart,
            color: 'from-emerald-500 to-green-500'
        },
        {
            title: 'Blockchain Secure Ecosystem',
            description: 'Bank-grade security with encrypted data transmission',
            icon: Lock,
            color: 'from-violet-500 to-purple-500'
        },
        {
            title: 'Cloud & RBAC, ABAC Infrastructure',
            description: 'Scalable platform with 99.9% uptime guarantee',
            icon: Cloud,
            color: 'from-orange-500 to-red-500'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: 'easeOut' }
        }
    };

    const floatVariant = {
        initial: { y: 0 },
        animate: {
            y: -6,
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
            }
        }
    };

    return (
        <section
            id="about"
            className="relative py-16 md:py-24 overflow-hidden min-h-screen bg-slate-950"
        >
            {/* Professional gradient background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            {/* Soft radial highlights */}
            <div className="pointer-events-none absolute -top-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

            {/* Subtle grid overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:80px_80px]" />

            {/* Subtle animated network nodes */}
            <div className="pointer-events-none absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-[1px] w-[1px] rounded-full bg-cyan-400/15"
                        initial={{
                            x: Math.random() * 100 + 'vw',
                            y: Math.random() * 100 + 'vh',
                        }}
                        animate={{
                            x: Math.random() * 100 + 'vw',
                            y: Math.random() * 100 + 'vh',
                        }}
                        transition={{
                            duration: 25 + Math.random() * 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* ALL CONTENT GOES HERE - WITH RELATIVE POSITIONING */}
            <div className="relative container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16 pt-6"
                >
                    <motion.div
                        variants={floatVariant}
                        initial="initial"
                        animate="animate"
                        className="inline-flex items-center gap-3 bg-slate-900/80 border border-slate-600/40 rounded-2xl px-5 py-2.5 mb-6 backdrop-blur-md shadow-[0_0_0_1px_rgba(15,23,42,0.8)]"
                    >
                        <Rocket className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">
                            About ManuDocs
                        </span>
                    </motion.div>

                    <div className="flex flex-col items-center gap-6 mb-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-50 leading-tight">
                            India&apos;s{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                                Unified Trade Interface
                            </span>
                        </h1>

                        {/* UTI Logo */}
                        <div className="relative group mt-4 mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                            <div className="relative bg-slate-900/900 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-xl shadow-4xl">
                                <img
                                    src="https://i.postimg.cc/FsJ1rRg6/UTI-logo.jpg"
                                    alt="UTI Logo"
                                    className="w-80 h-auto"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Trade Rail Animation - MOVED BELOW LOGO */}
                    <div className="mb-12">
                        <div className="relative rounded-3xl border border-slate-700/60 bg-slate-950/80 px-4 py-6 md:px-6 md:py-8 shadow-[0_22px_55px_rgba(8,47,73,0.8)] backdrop-blur-xl overflow-hidden">
                            {/* Glow */}
                            <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-cyan-500/15 to-transparent" />

                            {/* Rail */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true, margin: '-100px' }}
                                className="relative"
                            >
                                {/* Header */}
                                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300 mb-1">
                                            Unified export rail
                                        </p>
                                        <h4 className="text-lg md:text-xl font-semibold text-slate-50">
                                            One continuous line of sight from first document to final delivery
                                        </h4>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-300">
                                        <span className="flex items-center gap-2">
                                            <span className="h-1.5 w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                                            Live milestones
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="h-1.5 w-6 rounded-full bg-indigo-400/80" />
                                            Multi-party events
                                        </span>
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
                                                        <stop offset="0%" stopColor="#22d3ee" />
                                                        <stop offset="50%" stopColor="#3b82f6" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
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
                                                    strokeOpacity="0.35"
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
                                                        fill="#22ee47ff"
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
                                                                <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="relative w-12 h-12 rounded-2xl bg-slate-950 border border-slate-600 flex items-center justify-center shadow-lg shadow-slate-900/70 hover:border-cyan-400/60 transition-all duration-300">
                                                                    <step.icon className="w-5 h-5 text-slate-100 hover:text-cyan-300 transition-colors" />
                                                                </div>
                                                            </div>

                                                            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse" />
                                                        </motion.div>

                                                        {/* Labels */}
                                                        <div className="mt-2">
                                                            <p className="text-sm font-semibold text-slate-100 mb-1">
                                                                {step.label}
                                                            </p>
                                                            <p className="text-xs text-slate-400 max-w-[150px] mx-auto leading-tight">
                                                                {step.sub}
                                                            </p>
                                                        </div>

                                                        {/* Connector arrow */}
                                                        {index < railSteps.length - 1 && (
                                                            <ChevronRight className="absolute -right-6 top-7 w-5 h-5 text-slate-600" />
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

                    <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        ManuDocs unifies export documentation, compliance, logistics, shipment
                        visibility, and buyer collaboration into one intelligent operating
                        system for Indian exporters.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-slate-300">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                            As simple for exports as UPI is for payments — fast, simple, low-cost, and secure.
                        </span>
                    </div>
                </motion.div>

                {/* Feature cards - Now comes after the rail section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20"
                >
                    {features.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={itemVariants}
                            whileHover={{
                                y: -6,
                                rotateX: 2,
                                rotateY: -2,
                                transition: { type: 'spring', stiffness: 220, damping: 18 }
                            }}
                        >
                            <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_25px_60px_rgba(8,47,73,0.85)]">
                                <div
                                    className={`pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br ${item.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
                                />
                                <div className="relative flex flex-col gap-5">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-slate-900/70`}
                                    >
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
                                            {item.title}
                                        </h3>

                                        {/* description vs bullets */}
                                        {item.bullets ? (
                                            <div className="space-y-3">
                                                {item.subtitle && (
                                                    <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                                <ul className="space-y-1.5 text-sm md:text-base text-slate-300">
                                                    {item.bullets.map((point) => (
                                                        <li key={point} className="flex gap-2">
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Platform capabilities */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
                            Platform{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
                                Capabilities
                            </span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            A connected stack for documentation, compliance, logistics, and finance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {platformFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                viewport={{ once: true, margin: '-60px' }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-300 h-full">
                                    <div
                                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 mb-4`}
                                    >
                                        <feature.icon className="w-6 h-6 text-slate-100" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-50 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm">{feature.description}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                                            Learn more →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Impact stats */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                            Our Impact
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base">
                            Built with real exporter workflows, compliance demands, and logistics
                            constraints in mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.45,
                                    delay: i * 0.06,
                                    ease: 'easeOut'
                                }}
                                viewport={{ once: true, margin: '-60px' }}
                                whileHover={{
                                    y: -4,
                                    scale: 1.02,
                                    transition: { type: 'spring', stiffness: 220, damping: 18 }
                                }}
                                className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-5 text-center shadow-[0_14px_38px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/60"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/[0.03] to-transparent opacity-80" />
                                <div className="relative flex flex-col items-center gap-1.5">
                                    <div className="mb-3 w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md shadow-slate-900/70">
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-semibold text-slate-50">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-slate-200">
                                        {stat.label}
                                    </div>
                                    <div className="text-[11px] md:text-xs text-slate-400 mt-1">
                                        {stat.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Extra metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
                            <div className="grid md:grid-cols-3 gap-8">
                                {extraMetrics.map((metric) => (
                                    <div key={metric.label} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                                            <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-50 mb-1">
                                                {metric.value}
                                            </div>
                                            <div className="text-sm text-slate-300 mb-1">
                                                {metric.label}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {metric.hint}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Vision */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                            Our Vision
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base">
                            Building India&apos;s digital export backbone for compliant, predictable
                            cross-border trade.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {futureVision.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.08,
                                    ease: 'easeOut'
                                }}
                                viewport={{ once: true, margin: '-60px' }}
                                whileHover={{
                                    y: -5,
                                    transition: { type: 'spring', stiffness: 230, damping: 19 }
                                }}
                                className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/75 px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/65"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50/[0.06] via-transparent to-slate-50/[0.02]" />
                                <div className="relative flex gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-md shadow-slate-900/80 flex-shrink-0">
                                        <v.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-semibold text-slate-50 mb-1.5">
                                            {v.title}
                                        </h4>
                                        <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                                            {v.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {v.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-slate-800/50 rounded-full text-xs text-slate-200"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true, margin: '-80px' }}
                    className="pb-10 md:pb-14"
                >
                    <div className="relative mx-auto flex max-w-4xl flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 px-7 py-7 md:px-10 md:py-8 backdrop-blur-xl shadow-[0_22px_55px_rgba(8,47,73,0.85)] overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/6 via-transparent to-white/4 opacity-80" />
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl" />
                        <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-sky-400/25 blur-3xl" />

                        <div className="relative flex items-center gap-4 md:gap-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70 border border-cyan-400/60 shadow-md shadow-slate-900/80">
                                <Lightbulb className="w-6 h-6 text-cyan-300" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xl md:text-2xl font-semibold text-slate-50 mb-1.5">
                                    Build, ship, and scale globally without friction.
                                </h4>
                                <p className="text-sm md:text-base text-slate-200 max-w-xl">
                                    ManuDocs removes paperwork chaos, agent dependency, and visibility
                                    gaps so exporters can run compliant, predictable exports with
                                    confidence.
                                </p>
                            </div>
                        </div>

                        <div className="relative flex items-center gap-4">
                            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                                Start Free Trial
                            </button>
                            <button className="px-6 py-3 bg-slate-900/70 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:bg-slate-800/80 transition-all duration-300">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutManuDocs;