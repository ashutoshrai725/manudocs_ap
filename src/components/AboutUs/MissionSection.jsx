const MissionSection = () => {
    return (
        <section
            id="our_mission"
            className="flex items-center justify-center py-12 md:py-16"
        >
            {/* Floating container */}
            <div className="w-full max-w-6xl bg-gradient-to-br from-green-950/40 via-gray-900 to-gray-800 rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-5 md:p-12 lg:p-14 border border-manu-green/30 shadow-2xl">

                {/* Section Header */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-manu-green mb-2 md:mb-3">
                        Our Mission
                    </h2>
                    <div className="w-16 md:w-20 h-1 bg-manu-green mx-auto"></div>
                </div>



                {/* Mission Content */}
                <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
                    {/* Main Mission Statement - Highlighted */}
                    <div className="bg-manu-green/10 border-l-4 border-manu-green p-4 md:p-6 rounded-r-xl">
                        <p className="text-sm md:text-lg lg:text-xl text-gray-100 leading-relaxed font-medium">
                            Our mission is to <span className="text-manu-green font-bold">unify, automate, and intelligently orchestrate</span> the entire global trade supply chain through AI — eliminating fragmentation and bringing every stakeholder onto a single, unified digital trade interface.
                        </p>
                    </div>

                    {/* Key Points Grid - Single column on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Card 1 */}
                        <div className="bg-gray-800/50 border border-manu-green/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200">
                            <h3 className="text-base md:text-lg font-bold text-manu-green mb-2">Unified Platform</h3>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                One AI-native trade operating system for documentation, freight forwarding, shipping, customs, banking, and logistics.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gray-800/50 border border-manu-green/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200">
                            <h3 className="text-base md:text-lg font-bold text-manu-green mb-2">Intelligent Automation</h3>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                Agentic workflows reduce manual intervention, delays, errors, and compliance risks across the trade lifecycle.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gray-800/50 border border-manu-green/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200">
                            <h3 className="text-base md:text-lg font-bold text-manu-green mb-2">AI-Powered e-CHA</h3>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                Digital customs and compliance layer with AI-driven risk checks and policy intelligence for fast, secure trade execution.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-gray-800/50 border border-manu-green/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-manu-green/40 transition-all duration-200">
                            <h3 className="text-base md:text-lg font-bold text-manu-green mb-2">UPI for Trade</h3>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                Transforming complex multi-party trade processes into intuitive, automated flows — making global trade simpler and faster.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Statement */}
                    <div className="text-center pt-4 md:pt-6">
                        <p className="text-xs md:text-base lg:text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                            ManuDocs empowers exporters, importers, CHAs, freight forwarders, shipping lines, terminals, customs, banks, and regulators to operate with <span className="text-manu-green font-semibold">confidence, speed, and transparency</span> — making global trade accessible to all.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
