import React, { useEffect, useState, useRef } from 'react';
import './TranslateButton.css';

// Custom image URLs
const customImages = {
    indiaFlag: 'https://i.postimg.cc/T2ZGpspq/image.png',
    enSymbol: 'https://i.postimg.cc/nLx6vbJB/image.png',
};

const TranslateButton = ({ isMobile = false }) => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                document.body.classList.add('telugu-active');
            } else {
                setIsTranslated(false);
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectLanguage = (language) => {
        if (!isLoaded) {
            alert('Translation service is loading. Please wait...');
            return;
        }

        if (language === 'te') {
            // Translate to Telugu
            setCookie('googtrans', '/en/te');
            document.body.classList.add('telugu-active');
            setIsTranslated(true);
        } else {
            // Switch to English
            setCookie('googtrans', '/en/en');
            document.body.classList.remove('telugu-active');
            setIsTranslated(false);
        }

        setIsDropdownOpen(false);

        // Reload page to apply translation
        window.location.reload();
    };

    // Get current active icon
    const getActiveIcon = () => {
        if (isTranslated) {
            return (
                <img
                    src={customImages.indiaFlag}
                    alt="Telugu"
                    className="translate-icon india-flag"
                    title="Telugu"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                    }}
                />
            );
        } else {
            return (
                <img
                    src={customImages.enSymbol}
                    alt="English"
                    className="translate-icon en-symbol"
                    title="English"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                    }}
                />
            );
        }
    };

    // Fallback content for when images fail to load
    const getActiveFallbackIcon = () => {
        if (isTranslated) {
            return (
                <span className="translate-fallback india-fallback" title="Telugu">
                    🇮🇳
                </span>
            );
        } else {
            return (
                <span className="translate-fallback en-fallback" title="English">
                    EN
                </span>
            );
        }
    };

    // Get current active text
    const getActiveText = () => {
        if (isTranslated) {
            return 'తెలుగు';
        } else {
            return 'English';
        }
    };

    return (
        <div className={`translate-button-container ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <div className="translate-dropdown">
                <button
                    className={`translate-btn ${isTranslated ? 'translated' : ''} ${isMobile ? 'mobile' : ''}`}
                    onClick={toggleDropdown}
                    title={`Current: ${getActiveText()}`}
                >
                    <div className="icon-container">
                        {getActiveIcon()}
                        {getActiveFallbackIcon()}
                    </div>
                    {!isMobile && (
                        <span className="translate-text">
                            {getActiveText()}
                        </span>
                    )}
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
                        ▼
                    </span>
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <div
                            className={`dropdown-item ${!isTranslated ? 'active' : ''}`}
                            onClick={() => selectLanguage('en')}
                        >
                            <div className="dropdown-icon">
                                <img
                                    src={customImages.enSymbol}
                                    alt="English"
                                    className="translate-icon en-symbol"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'inline';
                                    }}
                                />
                                <span className="translate-fallback en-fallback">
                                    EN
                                </span>
                            </div>
                            <span className="dropdown-text">English</span>
                            {!isTranslated && <span className="checkmark">✓</span>}
                        </div>

                        <div
                            className={`dropdown-item ${isTranslated ? 'active' : ''}`}
                            onClick={() => selectLanguage('te')}
                        >
                            <div className="dropdown-icon">
                                <img
                                    src={customImages.indiaFlag}
                                    alt="Telugu"
                                    className="translate-icon india-flag"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'inline';
                                    }}
                                />
                                <span className="translate-fallback india-fallback">
                                    🇮🇳
                                </span>
                            </div>
                            <span className="dropdown-text">తెలుగు</span>
                            {isTranslated && <span className="checkmark">✓</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranslateButton;