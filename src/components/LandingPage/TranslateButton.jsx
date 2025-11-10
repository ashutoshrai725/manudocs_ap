import React, { useEffect, useState, useRef } from 'react';
import './TranslateButton.css';

// Supported Indian languages (code and native name only)
const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'mr', label: 'मराठी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'as', label: 'অসমীয়া' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'ne', label: 'नेपाली' },
    { code: 'ur', label: 'اردو' }
];

const TranslateButton = ({ isMobile = false }) => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLangCode, setSelectedLangCode] = useState('en');
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Check if Google Translate is loaded
        const checkGoogleTranslate = setInterval(() => {
            if (window.google && window.google.translate) {
                setIsLoaded(true);
                clearInterval(checkGoogleTranslate);
            }
        }, 100);

        // Check current translation status
        const checkTranslationStatus = () => {
            const currentLang = getCookie('googtrans');
            if (currentLang) {
                const langCode = currentLang.split('/')[2] || 'en';
                setSelectedLangCode(langCode);
                setIsTranslated(langCode !== 'en');
            } else {
                setSelectedLangCode('en');
                setIsTranslated(false);
            }
        };

        checkTranslationStatus();

        // Observe changes in the document
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
        setCookie('googtrans', `/en/${language}`);
        setSelectedLangCode(language);
        setIsTranslated(language !== 'en');
        setIsDropdownOpen(false);
        window.location.reload();
    };

    const getLabel = (code) => {
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.label : code.toUpperCase();
    };

    return (
        <div className={`translate-button-container ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            <div className="translate-dropdown">
                <button
                    className={`translate-btn ${isTranslated ? 'translated' : ''} ${isMobile ? 'mobile' : ''}`}
                    onClick={toggleDropdown}
                    title={`Current: ${getLabel(selectedLangCode)}`}
                >
                    {!isMobile &&
                        <span className="translate-text">
                            {getLabel(selectedLangCode)}
                        </span>
                    }
                    <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        {LANGUAGES.map(lang => (
                            <div
                                key={lang.code}
                                className={`dropdown-item ${selectedLangCode === lang.code ? 'active' : ''}`}
                                onClick={() => selectLanguage(lang.code)}
                            >
                                <span className="dropdown-text">{lang.label}</span>
                                {selectedLangCode === lang.code && <span className="checkmark">✓</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranslateButton;
