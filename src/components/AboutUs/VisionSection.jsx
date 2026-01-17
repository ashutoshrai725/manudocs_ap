const VisionSection = () => {
    return (
        <section
            id="our_vision"
            className="flex items-center justify-center py-12 md:py-16"
        >
            {/* Floating container */}
            <div className="w-full max-w-6xl bg-gradient-to-br from-blue-950/30 via-gray-900 to-gray-800 rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-5 md:p-12 lg:p-14 border border-blue-500/20 shadow-2xl relative overflow-hidden">

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-manu-green/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-6 md:mb-10">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
                            Our Vision
                        </h2>
                        <div className="w-16 md:w-20 h-1 bg-manu-green mx-auto"></div>
                    </div>

                    {/* Vision Image - Landscape - Smaller on mobile */}
                    <div className="mb-6 md:mb-10">
                        <div className="w-full max-w-xl mx-auto h-32 md:h-64 lg:h-80 bg-gradient-to-r from-blue-600/10 to-manu-green/10 rounded-xl md:rounded-2xl overflow-hidden border border-blue-500/20 flex items-center justify-center">
                            <img
                                src="https://i.postimg.cc/fTCM1SdN/vision_(2).jpg"
                                alt="ManuDocs Vision"
                                className="w-full h-full object-contain p-2 md:p-4"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden w-full h-full flex items-center justify-center text-gray-500">
                                [Vision Image]
                            </div>
                        </div>
                    </div>

                    {/* Vision Content */}
                    <div className="space-y-5 md:space-y-8 max-w-5xl mx-auto">
                        {/* Main Vision Statement - Hero */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-manu-green/20 border-l-4 border-manu-green p-4 md:p-6 rounded-r-xl">
                            <p className="text-base md:text-xl lg:text-2xl text-white leading-relaxed font-bold mb-2">
                                Making India a GLOBAL TRADE POWERHOUSE
                            </p>
                            <p className="text-sm md:text-lg lg:text-xl text-gray-200 leading-relaxed font-semibold">
                                Transforming India from a trade-deficit nation into a trade-surplus nation.
                            </p>
                        </div>

                        {/* Key Vision Points - 3 Pillars - Stack on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Pillar 1 */}
                            <div className="bg-gray-800/60 border border-blue-500/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200 md:hover:scale-105">
                                <h3 className="text-base md:text-lg font-bold text-blue-400 mb-2 md:mb-3">
                                    Powering India's Global Economic Rise
                                </h3>
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                    Enabling Indian MSMEs to scale globally with confidence, unlocking export-led growth and establishing India as a dominant global trade powerhouse.
                                </p>
                            </div>

                            {/* Pillar 2 */}
                            <div className="bg-gray-800/60 border border-blue-500/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200 md:hover:scale-105">
                                <h3 className="text-base md:text-lg font-bold text-manu-green mb-2 md:mb-3">
                                    AI-Driven Discovery
                                </h3>
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                    Access globally trusted buyers through deep AI research, personalized insights, and intelligent product-buyer matching and reducing dependency from a single nation for exports.
                                </p>
                            </div>

                            {/* Pillar 3 */}
                            <div className="bg-gray-800/60 border border-blue-500/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200 md:hover:scale-105">
                                <h3 className="text-base md:text-lg font-bold text-purple-400 mb-2 md:mb-3">
                                    One-Click Exports
                                </h3>
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                    Any business — small or large — can export securely, compliantly, and effortlessly with a single click and compliantly with all the government regulations and compliances.
                                </p>
                            </div>
                        </div>

                        {/* Strategic Alignment */}
                        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-manu-green/30 rounded-lg md:rounded-xl p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-bold text-manu-green mb-2">
                                Government-Aligned, Policy-Driven
                            </h3>
                            <p className="text-xs md:text-sm lg:text-base text-gray-300 leading-relaxed">
                                Deeply aligned with Indian government policies and national trade initiatives, ManuDocs removes every barrier preventing Indian businesses from going global — providing real-time intelligence, compliance clarity, and actionable insights.
                            </p>
                        </div>

                        {/* Global Expansion Vision */}
                        <div className="text-center pt-4 md:pt-6 pb-2 md:pb-4">
                            <div className="inline-block bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl md:rounded-2xl px-5 md:px-8 py-4 md:py-6">
                                <div className="text-3xl md:text-5xl mb-3 md:mb-4">🌍</div>
                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3">
                                    From India to the World
                                </h3>
                                <p className="text-xs md:text-sm lg:text-base text-gray-300 leading-relaxed max-w-3xl">
                                    As we mature, ManuDocs will expand beyond India into coastline economies and global trade corridors — becoming the <span className="text-manu-green font-semibold">default digital trade interface for the world</span>, a trusted AI-driven backbone where international trade runs seamlessly, transparently, and intelligently.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionSection;
