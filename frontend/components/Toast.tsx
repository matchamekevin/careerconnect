import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
    const getColorClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
                return 'ℹ️';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${getColorClasses()}`}>
            <div className="flex items-center gap-2">
                <span className="text-lg">{getIcon()}</span>
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;
