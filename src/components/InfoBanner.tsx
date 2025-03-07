import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface InfoBannerProps {
    onClose?: () => void;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(true);
    const [isRendered, setIsRendered] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        // Verzögerung für den Fade-In-Effekt
        const timer = setTimeout(() => {
            setIsRendered(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsRendered(false);
        // Warte auf die Animation, bevor der Banner entfernt wird
        setTimeout(() => {
            setVisible(false);
            if (onClose) {
                onClose();
            }
        }, 300);
    };

    if (!visible) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 mt-4">
            <div 
                className={`${isDarkMode ? 'bg-dark-800 border-dark-700' : 'bg-cyto-50 border-cyto-200'} 
                border text-${isDarkMode ? 'dark-200' : 'gray-800'} 
                p-4 transition-all duration-300 shadow-md rounded-xl hover:shadow-lg 
                relative flex items-center
                ${isRendered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}
            > 
                <AlertCircle className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'} flex-shrink-0`} />
                <span>Die Website ist aktuell in der ALPHA Phase. Bugs können auftreten und bitte melden!</span>
                <button 
                    onClick={handleClose} 
                    className={`ml-auto pl-4 ${isDarkMode ? 'text-dark-400 hover:text-dark-200' : 'text-gray-500 hover:text-gray-800'} transition-colors duration-200 text-lg font-medium`}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default InfoBanner;
