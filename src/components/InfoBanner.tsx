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
        <div className="w-full bg-dark-950 py-2">
            <div className="max-w-7xl mx-auto px-4">
                <div 
                    className={`
                        ${isDarkMode ? 'bg-cyto-600/10 border-cyto-600/30' : 'bg-cyto-50 border-cyto-200'} 
                        border text-cyto-400 p-2.5 transition-all duration-300 shadow-sm rounded-lg
                        relative flex items-center
                        ${isRendered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}
                    `}
                > 
                    <div className="flex items-center justify-center mr-2 text-cyto-400">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="text-sm">Die Website ist aktuell in der ALPHA Phase. Bugs können auftreten und bitte melden!</span>
                    <button 
                        onClick={handleClose} 
                        className="ml-auto text-cyto-400/70 hover:text-cyto-400 transition-colors duration-200"
                        aria-label="Banner schließen"
                    >
                        <span className="font-medium">&times;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoBanner;
