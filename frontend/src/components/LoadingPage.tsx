import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center z-50">
            {/* Motif de fond subtil */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Logo JobTogo Étudiant moderne */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 mb-6">
                        <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Gradient de fond */}
                            <defs>
                                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#374151', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#f8fafc', stopOpacity: 0.9 }} />
                                </linearGradient>
                                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#6b7280', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>

                            {/* Cercle de base avec ombre */}
                            <circle cx="60" cy="60" r="55" fill="url(#bgGradient)" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />

                            {/* Lettre J moderne */}
                            <path d="M35 30 L50 30 Q55 30 55 35 L55 55 Q55 70 40 70 Q25 70 25 55 L25 50 L35 50 L35 55 Q35 60 40 60 Q45 60 45 55 L45 35 L35 35 Z"
                                fill="url(#textGradient)" strokeWidth="1" />

                            {/* Lettre T moderne */}
                            <path d="M60 30 L95 30 L95 40 L85 40 L85 90 L75 90 L75 40 L65 40 L65 90 L60 90 L60 40 L55 40 L55 30 Z"
                                fill="url(#textGradient)" strokeWidth="1" />

                            {/* Accent moderne - forme carrière */}
                            <rect x="25" y="75" width="12" height="4" fill="url(#accentGradient)" rx="2" />
                            <rect x="80" y="75" width="12" height="4" fill="url(#accentGradient)" rx="2" />

                            {/* Points décoratifs animés */}
                            <circle cx="30" cy="45" r="2.5" fill="#6b7280" className="decorative-dot">
                                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="90" cy="45" r="2.5" fill="#f59e0b" className="decorative-dot">
                                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="60" cy="20" r="2.5" fill="#ef4444" className="decorative-dot">
                                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.5s" />
                            </circle>

                            {/* Élément étudiant - chapeau de graduation stylisé */}
                            <path d="M40 85 L50 82 L60 85 L70 82 L80 85 L60 78 L40 85 Z"
                                fill="url(#accentGradient)" strokeWidth="1" />
                            <rect x="58" y="75" width="4" height="8" fill="url(#accentGradient)" />
                            <circle cx="62" cy="75" r="2" fill="#f59e0b" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
                        JobTogo Étudiant
                    </h1>

                    <p className="text-base text-gray-600 font-medium tracking-wide">
                        Votre avenir professionnel commence ici...
                    </p>
                </div>

                {/* Spinner moderne avec gradient */}
                <div className="modern-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-inner-ring"></div>
                    <div className="spinner-dot"></div>
                </div>

                {/* Points de progression */}
                <div className="flex space-x-2 mt-4">
                    <div className="loading-dot dot-1"></div>
                    <div className="loading-dot dot-2"></div>
                    <div className="loading-dot dot-3"></div>
                </div>

                <style>{`
                    /* Spinner moderne avec gradient et double anneau */
                    .modern-spinner {
                        width: 50px;
                        height: 50px;
                        position: relative;
                        margin: 20px auto;
                    }
                    
                    .spinner-ring {
                        width: 50px;
                        height: 50px;
                        border: 4px solid #f3f4f6;
                        border-top: 4px solid #1f2937;
                        border-right: 4px solid #374151;
                        border-radius: 50%;
                        animation: modern-spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    }
                    
                    .spinner-inner-ring {
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        width: 34px;
                        height: 34px;
                        border: 2px solid transparent;
                        border-bottom: 2px solid #6b7280;
                        border-left: 2px solid #9ca3af;
                        border-radius: 50%;
                        animation: inner-spin 1s linear infinite reverse;
                    }
                    
                    .spinner-dot {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 10px;
                        height: 10px;
                        background: linear-gradient(45deg, #1f2937, #374151);
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        animation: dot-pulse 1.8s ease-in-out infinite;
                        box-shadow: 0 0 10px rgba(31, 41, 55, 0.5);
                    }
                    
                    @keyframes modern-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes inner-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes dot-pulse {
                        0%, 100% { 
                            transform: translate(-50%, -50%) scale(0.7);
                            opacity: 0.7;
                        }
                        50% { 
                            transform: translate(-50%, -50%) scale(1.3);
                            opacity: 1;
                        }
                    }
                    
                    /* Points de progression améliorés */
                    .loading-dot {
                        width: 10px;
                        height: 10px;
                        background: linear-gradient(45deg, #1f2937, #374151);
                        border-radius: 50%;
                        animation: dot-bounce 1.6s ease-in-out infinite both;
                        box-shadow: 0 2px 8px rgba(31, 41, 55, 0.3);
                    }
                    
                    .dot-1 { animation-delay: -0.32s; }
                    .dot-2 { animation-delay: -0.16s; }
                    .dot-3 { animation-delay: 0s; }
                    
                    @keyframes dot-bounce {
                        0%, 80%, 100% { 
                            transform: scale(0.8) translateY(0);
                            opacity: 0.6;
                        }
                        40% { 
                            transform: scale(1.2) translateY(-10px);
                            opacity: 1;
                        }
                    }
                    
                    /* Animation du logo améliorée */
                    svg {
                        animation: logo-float 4s ease-in-out infinite;
                        filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.2));
                    }
                    
                    @keyframes logo-float {
                        0%, 100% { 
                            transform: translateY(0px) scale(1) rotate(0deg);
                            opacity: 1;
                        }
                        25% { 
                            transform: translateY(-5px) scale(1.02) rotate(1deg);
                            opacity: 0.98;
                        }
                        50% { 
                            transform: translateY(-8px) scale(1.05) rotate(0deg);
                            opacity: 0.95;
                        }
                        75% { 
                            transform: translateY(-5px) scale(1.02) rotate(-1deg);
                            opacity: 0.98;
                        }
                    }
                    
                    /* Animation du texte */
                    h1 {
                        animation: text-glow 3s ease-in-out infinite alternate;
                    }
                    
                    @keyframes text-glow {
                        0% { 
                            text-shadow: none;
                            opacity: 1;
                        }
                        100% { 
                            text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
                            opacity: 0.9;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default LoadingPage;
