import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../LandingPage/Header';
import HeroSection from './HeroSection';
import MissionSection from './MissionSection';
import VisionSection from './VisionSection';
import FoundersSection from './FoundersSection';
import AchievementsSection from './AchievementsSection';

const AboutUs = () => {
    const { section } = useParams();

    useEffect(() => {
        if (section) {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [section]);

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Header */}
            <Header />

            {/* Main container - Mobile compact spacing */}
            <div className="pt-24 md:pt-32 px-4 md:px-8 lg:px-12 pb-8 md:pb-12 space-y-8 md:space-y-16">
                {/* Hero Section */}
                <HeroSection />

                {/* Mission Section */}
                <MissionSection />

                {/* Vision Section */}
                <VisionSection />

                {/* Founders Section */}
                <FoundersSection />

                {/* Achievements Carousel */}
                <AchievementsSection />
            </div>
        </div>
    );
};

export default AboutUs;
