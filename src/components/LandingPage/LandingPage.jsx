import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import HeroSection from './HeroSection.jsx';
import BackedBySection from './BackedBySection.jsx';
import Footer from './Footer.jsx';

const LandingPage = ({ user, onLogout }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const isMobileDevice = window.innerWidth <= 768;
            setIsMobile(isMobileDevice);
        };

        // Initial check
        checkDevice();

        // Add event listener for window resize
        window.addEventListener('resize', checkDevice);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    // Optional: Add scroll-to-top functionality for landing page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Always visible with user state */}
            <Header
                user={user}
                onLogout={onLogout}
            />

            {/* Main content sections */}
            <main>
                {/* Hero Section */}
                <HeroSection 
                    isMobile={isMobile} 
                    user={user} 
                />
                
                {/* Backed By Section */}
                <BackedBySection />
                
                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default LandingPage;