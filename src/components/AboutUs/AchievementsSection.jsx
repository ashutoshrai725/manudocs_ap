import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AchievementsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const achievements = [
        {
            title: "Invention Engine X Masters Union Winner",
            image: "https://i.postimg.cc/x8DtdqXL/inventionengine.jpg"
        },
        {
            title: "PW SOS Founders Battleground",
            image: "https://i.postimg.cc/tJ3Dny6V/founders_battleground_pw.jpg"
        },
        {
            title: "MOPSW",
            image: "https://i.postimg.cc/2yQTLmW2/mopsw.jpg"
        },

        {
            title: "OPESH SHARMA SIR - MoPSW Director Meeting",
            image: "https://i.postimg.cc/tJ3Dny6h/mopsw_opesh_sh_arma_sir.jpg"
        },
        {
            title: "South Park Commons",
            image: "https://i.postimg.cc/ZYBDTMw4/SPCs.jpg"
        },
        {
            title: "Rakesh Verma Sir - MAPPLS",
            image: "https://i.postimg.cc/nVjwHP3n/MAPPLS.jpg"
        },
        {
            title: "Ishan Bansal - Groww",
            image: "https://i.postimg.cc/v8gSQN0Z/ISHAN_SIR_GROWW.jpg"
        },
        {
            title: "Kanwal Rekhi Sir - TIE GLOBAL, INVENTUS CAPITAL PARTNERS",
            image: "https://i.postimg.cc/VsrHYVKs/TIE_GLOBAL_KANWAL_REKHI_SIR.jpg"
        },
        {
            title: "Phanindra Sama - RedBus",
            image: "https://i.postimg.cc/SQ2tyvgy/REDBUS.jpg"
        },
        {
            title: "CO-WORKING in BITS Pilani",
            image: "https://i.postimg.cc/Bt9z0SxZ/office.jpg"
        },
        {
            title: "Shailendra Nath Jha - INVENTION ENGINE",
            image: "https://i.postimg.cc/CL8y6tjx/Whats_App_Image_2026_01_17_at_1_22_36_PM.jpg"
        },
        {
            title: "PW EXPERTS",
            image: "https://i.postimg.cc/KvTXsVnc/Whats_App_Image_2026_01_17_at_1_24_43_PM.jpg"
        },
        {
            title: "Sagarmala Office Visit",
            image: "https://i.postimg.cc/mkYV1R9n/sagarmala_office.jpg"
        },
        {
            title: "PW Alakh Sir and Prateek Sir",
            image: "https://i.postimg.cc/wMXFRHN4/pw_alakh_sir_and_prateek_asir.jpg"
        },
        {
            title: "Incubated At BITS Pilani",
            image: "https://i.postimg.cc/zBdZWHwF/IMG_20251030_WA0708.jpg"
        },
        {
            title: "Incubated at PIEDS",
            image: "https://i.postimg.cc/NF6b2YX2/incubated_at_pieds.jpg"
        },
        {
            title: "Kandla Port Chairperson Shri Sushil Kumar Singh",
            image: "https://i.postimg.cc/nz7GNZ06/Screenshot_2025_12_06_144401.png"
        },
        {
            title: "Meeting with Experts",
            image: "https://i.postimg.cc/FshVCM3X/Screenshot_2025_12_02_184740.png"
        },
        {
            title: "IIT Madras x NTCPWC",
            image: "https://i.postimg.cc/zXDTFnYJ/Screenshot_2025_11_21_123158.png"
        },
        {
            title: "Avi Dutt sir @ Trademo",
            image: "https://i.postimg.cc/dQj8C5Xk/Screenshot_2025_11_21_171344.png"
        },
        {
            title: "Strategic Advisory from Mao Sir-COMVIVA",
            image: "https://i.postimg.cc/Zqv8y4tF/Screenshot_2025_11_28_093557.png"
        },
        {
            title: "Indian Customs BLR Visit",
            image: "https://i.postimg.cc/wjG15FHz/Whats_App_Image_2025_10_30_at_14_10_21_7e2b9f1b.jpg"
        },
        {
            title: "CONCOR DRY PORT BLR",
            image: "https://i.postimg.cc/bJYfs9nn/IMG_20251030_WA0714.jpg"
        },
        {
            title: "Exporters Meet at Noida Trade Fair",
            image: "https://i.postimg.cc/5NSyrnmr/IMG_20251003_16470697.jpg"
        },
        {
            title: "Trade Fair",
            image: "https://i.postimg.cc/FsmwTZzS/Picsart_25_10_03_17_16_19_698.jpg"
        },
        {
            title: "Platform Demo",
            image: "https://i.postimg.cc/j50MLxJw/IMG_20251003_16523181.jpg"
        },
        {
            title: "Platform Demo to Exporters",
            image: "https://i.postimg.cc/wBJVKCbd/IMG_20251003_16512244.jpg"
        },
        {
            title: "DG Systems Meet",
            image: "https://i.postimg.cc/7hSVpDYq/Whats-App-Image-2025-12-25-at-6-11-57-PM.jpg"
        }
    ];

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Auto-play
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % achievements.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isVisible, achievements.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % achievements.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section id="our_achievements" className="py-12" ref={sectionRef}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Section Header - Compact */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                        Our Journey So Far
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Moments from our journey of transforming Indian exports
                    </p>
                </div>

                {/* Carousel Container - Smaller */}
                <div className="relative">
                    {/* Main Image Carousel */}
                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl">
                        {/* Slides */}
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {achievements.map((achievement, index) => (
                                <div key={index} className="min-w-full">
                                    <div className="relative aspect-video">
                                        <img
                                            src={achievement.image}
                                            alt={achievement.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                                            [Image]
                                        </div>

                                        {/* Title Overlay - Smaller */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                            <h3 className="text-base md:text-lg font-bold text-white">
                                                {achievement.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows - Smaller */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 border border-gray-600 hover:border-manu-green z-10"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 border border-gray-600 hover:border-manu-green z-10"
                            aria-label="Next"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AchievementsSection;
