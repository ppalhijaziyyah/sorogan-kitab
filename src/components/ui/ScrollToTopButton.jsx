import { useState, useEffect, useRef } from 'react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const lastScrollY = useRef(0);
    const hideTimer = useRef(null);

    const handleScroll = () => {
        const currentScrollY = window.pageYOffset;

        // Clear any existing timer to hide the button
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
        }

        // Show button if scrolling up & past a certain threshold
        if (currentScrollY > 300 && currentScrollY < lastScrollY.current) {
            setIsVisible(true);
            // Set a new timer to hide the button after 2 seconds of inactivity
            hideTimer.current = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
        } else {
            // Hide immediately if scrolling down or near the top
            setIsVisible(false);
        }

        // Update last scroll position for the next event
        lastScrollY.current = currentScrollY;
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (hideTimer.current) {
                clearTimeout(hideTimer.current);
            }
        };
    }, []);

    return (
        <button
            title="Kembali ke Atas"
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 z-30 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
