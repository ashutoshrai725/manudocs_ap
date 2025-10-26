import React, { useEffect, useState } from 'react';
import './TranslateButton.css';

const TranslateButton = ({ isMobile = false }) => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if Google Translate is loaded
        const checkGoogleTranslate = setInterval(() => {
            if (window.google && window.google.translate) {
                setIsLoaded(true);
                clearInterval(checkGoogleTranslate);
            }
        }, 100);

        // Check current translation status on mount
        const checkTranslationStatus = () => {
            const currentLang = getCookie('googtrans');
            if (currentLang && currentLang.includes('/te')) {
                setIsTranslated(true);
                // Add class to body for Telugu styling
                document.body.classList.add('telugu-active');
            } else {
                setIsTranslated(false);
                // Remove class when not in Telugu
                document.body.classList.remove('telugu-active');
            }
        };

        checkTranslationStatus();

        // Monitor translation changes
        const observer = new MutationObserver(() => {
            checkTranslationStatus();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang', 'class']
        });

        return () => {
            clearInterval(checkGoogleTranslate);
            observer.disconnect();
        };
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const setCookie = (name, value, days = 365) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const toggleTranslation = () => {
        if (!isLoaded) {
            alert('Translation service is loading. Please wait...');
            return;
        }

        if (isTranslated) {
            // Switch back to English
            setCookie('googtrans', '/en/en');
            document.body.classList.remove('telugu-active');
            setIsTranslated(false);
        } else {
            // Translate to Telugu
            setCookie('googtrans', '/en/te');
            document.body.classList.add('telugu-active');
            setIsTranslated(true);
        }

        // Reload page to apply translation
        window.location.reload();
    };

    return (
        <div className={`translate-button-container ${isMobile ? 'mobile' : ''}`}>
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <button
                className={`translate-btn ${isTranslated ? 'translated' : ''} ${isMobile ? 'mobile' : ''}`}
                onClick={toggleTranslation}
                title={isTranslated ? 'Switch to English' : 'Translate to Telugu'}
            >
                <span className="translate-icon">
                    {isTranslated ? '🇮🇳' : '🌐'}
                </span>
                {!isMobile && (
                    <span className="translate-text">
                        {isTranslated ? 'తెలుగు' : 'తెలుగు'}
                    </span>
                )}
            </button>
        </div>
    );
};

export default TranslateButton;