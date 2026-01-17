const HeroSection = () => {
    return (
        <section
            id="about"
            className="flex items-center justify-center py-4 md:py-0"
        >
            {/* Floating container */}
            <div className="w-full max-w-6xl bg-manu-green/30 rounded-2xl md:rounded-3xl lg:rounded-[3rem] p-4 md:p-10 relative overflow-hidden border border-gray-800/50 shadow-2xl">

                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-manu-green rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-manu-green/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                    {/* Main Heading */}
                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 leading-tight">
                        Simplifying Global
                        <span className="block text-white">Trade Operations</span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-base md:text-xl text-gray-400 mb-4 md:mb-8 max-w-2xl mx-auto">
                        AI-powered ecosystem for automating end to end trade process.
                    </p>

                    {/* Illustration */}
                    <div className="mt-3 md:mt-8">
                        <div className="w-full max-w-4xl mx-auto rounded-xl md:rounded-2xl overflow-hidden border border-white">
                            <img
                                src="https://i.postimg.cc/PJKW21D1/new-f-low.png"
                                alt="Export Documentation Illustration"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
