import { useState } from 'react';
import { Linkedin, Twitter, Instagram, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FoundersSection = () => {
    const [expandedFounders, setExpandedFounders] = useState({});

    const toggleExpand = (index) => {
        setExpandedFounders(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const founders = [
        {
            name: "Sumit Singh Rahar",
            role: "Co-Founder & CEO",
            image: "https://i.postimg.cc/Gm2kGrQz/rkic3.jpg",
            quote: "I don’t build for quarters or years...I build systems meant to shape nations, industries, and governments over decades",
            bio: `I am a long term thinker and a visionary observer who plans in decades, not years. My work is driven by the belief that nations are not transformed by shortterm products, but by systems that reshape how people, industries, and governments operate together.

I naturally observe systems and structures—how people behave, how societies evolve, how cultures and religions influence decision making, how nations rise or fall through politics, geopolitics, philosophy, and technology. This deep curiosity across disciplines allows me to see patterns others miss and design solutions that are not limited to one industry or one moment in time.

By temperament, I am introverted with the unknown and extroverted with the known. I prefer deep thinking over noise, clarity over speed, and structured execution over hype. This balance helps me operate both as a strategic planner and a hands on builder.

From class 11, I began conceptualizing a platform with a single ambition: to transform the manufacturing ecosystem at a national and global level. That vision was named Manuverse—short for Manufacturing Universe—an ecosystem designed to strengthen manufacturing, trade, and economic resilience across nations.

With mentorship and strategic guidance, I deliberately narrowed this vision into a focused, execution ready platform-ManuDocs. Instead of attempting to solve everything at once, ManuDocs was created to solve one critical bottleneck first, and then expand systematically. This approach reflects how real infrastructure is built: layer by layer, problem by problem, nation by nation.`,
            socials: {
                linkedin: "https://www.linkedin.com/in/sumit-singh-rahar/",
                twitter: "https://twitter.com/founder1",
                instagram: "https://www.instagram.com/sumitrahar2025?igsh=Zmc2MHg2cTJldTI5",
                email: "rahar1919sumit@gmail.com"
            },
            photoPosition: "left"
        },
        {
            name: "Ashutosh Rai",
            role: "Co-Founder & CTO",
            image: "https://i.postimg.cc/9fXFrFYW/ashutoshrai.png",
            quote: "Empowering MSMEs with the right technology isn’t just business...it’s how economies grow and nations move forward",
            bio: `I believe in understanding problems at their deepest level and then building solutions that solve the entire challenge in a simple, intuitive, and user friendly way. From a very young age, I’ve been deeply fascinated by technology...not just using digital systems, but exploring how they actually work beneath the surface.

I’ve always enjoyed diving into emerging technologies and studying how they can disrupt existing industries and create entirely new ecosystems. When I talk about building ecosystems, that’s where ManuDocs comes into the picture. Along with my co-founder, I’m building ManuDocs to create a unified trade ecosystem that connects every stakeholder involved in global trade, while eliminating delays, fragmentation, and manual workflows.

I’m a deep thinker by nature...largely introverted, but highly expressive and collaborative with people I trust. Long, in depth discussions with my co-founder, Sumit, eventually led to the birth of ManuDocs. What started as conversations around inefficiencies in trade gradually evolved into a shared mission: to build a unified digital trade ecosystem for India that empowers MSMEs and strengthens the country’s economic foundation.

I strongly believe that the backbone of any nation’s economy lies in its MSMEs, businesses, and enterprises that export globally...bringing foreign capital into the country and strengthening the value of its currency. Empowering these businesses with the right technology is key to sustainable economic growth.

My approach to problem solving has always been rooted in first understanding the problem completely identifying root causes, mapping workflows end-to-end, and then applying technology in a structured and meaningful way. This philosophy led to the creation of ManuDocs’ agentic workflows — systems designed to seamlessly connect government portals, agencies, banks, exporters, importers, buyers, sellers, logistics providers, and documentation processes into a single, intelligent, unified flow.

I believe that with deep research, clear thinking, and the right technological advancements, every complex problem can be broken down and solved step by step. ManuDocs is a reflection of that belief.`,
            socials: {
                linkedin: "https://www.linkedin.com/in/ashutoshrai725/",
                twitter: "https://x.com/AshutoshRa77518",
                instagram: "https://www.instagram.com/a5hutoshrai/",
                email: "ashutoshrai7205@gmail.com"
            },
            photoPosition: "right"
        },
        {
            name: "Mohit Jangir",
            role: "Co-Founder & CMO",
            image: "https://i.postimg.cc/3xFx8Dmw/mohit.jpg",
            quote: "Connecting exporters worldwide ",
            bio: `Marketing is about storytelling, and every exporter has a powerful story to tell. My mission is to amplify those voices.

The export industry is fragmented, with countless businesses operating in isolation. ManuDocs isn't just a tool – it's a community, a movement towards smarter, collaborative trade.

Through strategic partnerships, content, and community building, we're creating a global network of informed, empowered exporters.

I believe that when we simplify compliance and documentation, we unlock human potential – allowing entrepreneurs to focus on what they do best: building great products and serving customers worldwide.`,
            socials: {
                linkedin: "https://www.linkedin.com/in/mohitjangirworks/",
                twitter: "https://x.com/mohiit_jangid",
                instagram: "https://www.instagram.com/mohiit.jangid/",
                email: "mohitjangirworks@gmail.com"
            },
            photoPosition: "left"
        },
        {
            name: "Rudra Purohit",
            role: "Co-Founder & COO",
            image: "https://i.postimg.cc/N06jqFmg/1000071098.jpg",
            quote: "I Question Assumptions and Build with Intent.",
            bio: `I see the world through observation...how systems function, how value is created, and why execution fails more often than vision. Growing up, dhanda was a word used casually in my family, but over time it became central to how I think about building anything meaningful.

            That way of thinking naturally pulled me toward understanding people how they think, how decisions are made, and how real knowledge is formed through practice rather than assumptions. For me, identifying a problem is only the beginning. What matters equally is explaining it clearly, earning trust around it, and taking responsibility for how it is carried forward. Sales, partnerships, and growth are not separate functions in my mind they are ways of validating whether a solution actually works in the real world. At the same time, understanding how processes operate on the ground is essential, because growth without operational clarity only scales confusion.

            This perspective also shapes how I view the trade industry. I believe meaningful change comes from those who enter an industry with fresh eyes and question accepted norms, not from those who understand every loop but grow comfortable saying, “this is how it works.” Knowing the system explains problems; challenging assumptions creates progress.

            ManuDocs emerged from this way of thinking. Our North Star is to bring clarity, structure, and trust to a trade ecosystem that has long operated through fragmentation and manual effort. Our aim is to make export and import processes as clear and accessible as operating in the domestic market by increasing transparency, reducing dependency, and removing unnecessary complexity. We focus on building systems that work within real world constraints and are practical to adopt, rather than imagining solutions disconnected from how trade actually functions today.

            I believe meaningful progress comes from asking the right questions, respecting reality, and executing with discipline. When trade systems become clearer and more reliable, businesses operate with greater confidence and that strength compounds at a national level. ManuDocs is being built with this mindset: strengthening self reliance through better systems, reducing dependency through clarity, and contributing to a more resilient and capable trade ecosystem over time.
`,
            socials: {
                linkedin: "https://www.linkedin.com/in/rudrra-purohit-4a59a1312/",
                twitter: "https://x.com/rudrapurohit72",
                instagram: "https://www.instagram.com/rudrra_purohit/",
                email: "rudrapurohit72@gmail.com"
            },
            photoPosition: "right"
        }
    ];

    return (
        <section id="our_founders" className="py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Meet the Team Behind ManuDocs
                    </h2>
                    <p className="text-base md:text-lg text-gray-400">
                        "Designing the unified infrastructure behind global trade."
                    </p>
                </div>

                {/* Individual founder cards */}
                <div className="space-y-10">
                    {founders.map((founder, index) => {
                        const isExpanded = expandedFounders[index];
                        const paragraphs = founder.bio.split('\n\n');

                        return (
                            <div
                                key={index}
                                className={`relative rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 
                                    ${index % 2 === 0
                                        ? 'bg-gradient-to-br from-pink-200/95 via-pink-300/85 to-pink-200/95'
                                        : 'bg-gradient-to-br from-rose-200/95 via-rose-300/85 to-rose-200/95'}
                                    shadow-2xl overflow-hidden`}
                            >
                                {/* Decorative stars */}
                                <div className={`absolute ${index % 2 === 0 ? 'top-6 right-6' : 'bottom-6 left-6'} opacity-50`}>
                                    <div className={`${index % 2 === 0 ? 'text-blue-400' : 'text-green-400'} text-3xl`}>
                                        {index % 2 === 0 ? '✦' : '✧'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                                    {/* Left Column - Photo & Quote */}
                                    <div className={`lg:col-span-4 ${founder.photoPosition === 'right' ? 'lg:order-2 lg:ml-6' : 'lg:order-1 lg:ml-4'}`}>
                                        {/* Quote */}
                                        <h3 className="text-xl md:text-xl font-serif font-bold text-gray-900 mb-4 leading-snug">
                                            "{founder.quote}"
                                        </h3>

                                        {/* Photo */}
                                        <div className="relative w-52 h-52 mx-auto lg:mx-0 mb-4">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white p-2 shadow-xl lg:ml-12">
                                                <div className="w-full h-full rounded-full overflow-hidden ">
                                                    <img
                                                        src={founder.image}
                                                        alt={founder.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                                                        [Photo]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Name & Role */}
                                        <div className="text-center lg:text-left lg:ml-16 mb-3">
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                                {founder.name}
                                            </h4>
                                            <p className="text-sm md:text-base text-gray-700 font-medium mb-3">
                                                {founder.role}
                                            </p>

                                            {/* Social Icons */}
                                            <div className="flex items-center justify-center lg:justify-start space-x-2">
                                                {founder.socials.linkedin && (
                                                    <a
                                                        href={founder.socials.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="LinkedIn"
                                                    >
                                                        <Linkedin size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.twitter && (
                                                    <a
                                                        href={founder.socials.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Twitter"
                                                    >
                                                        <Twitter size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.instagram && (
                                                    <a
                                                        href={founder.socials.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Instagram"
                                                    >
                                                        <Instagram size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.email && (
                                                    <a
                                                        href={`mailto:${founder.socials.email}`}
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Email"
                                                    >
                                                        <Mail size={15} className="text-white" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Bio with Read More */}
                                    <div className={`lg:col-span-8 ${founder.photoPosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                                        {/* Bio Content */}
                                        <div className="md:columns-2 md:gap-5 space-y-2.5">
                                            {/* Mobile: Show first para only unless expanded, Desktop: Show all */}
                                            {paragraphs.map((paragraph, pIndex) => (
                                                <p
                                                    key={pIndex}
                                                    className={`text-xs md:text-sm text-gray-800 leading-relaxed text-left break-inside-avoid
                                                        ${!isExpanded && pIndex > 0 ? 'hidden md:block' : ''}`}
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Read More Button - Only on mobile when there are multiple paragraphs */}
                                        {paragraphs.length > 1 && (
                                            <div className="md:hidden mt-4 text-center">
                                                <button
                                                    onClick={() => toggleExpand(index)}
                                                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-medium transition-all duration-200 shadow-lg"
                                                >
                                                    <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FoundersSection;
