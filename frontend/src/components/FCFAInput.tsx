import React, { useState } from 'react';

interface FCFAInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    name?: string;
    required?: boolean;
}

const FCFAInput: React.FC<FCFAInputProps> = ({
    value,
    onChange,
    placeholder = "Ex: 50,000 - 75,000 FCFA",
    className = "",
    name,
    required = false
}) => {
    const [focused, setFocused] = useState(false);

    const formatValue = (val: string) => {
        // Enlever tout sauf les chiffres, virgules, tirets et espaces
        let cleaned = val.replace(/[^\d,\-\s]/g, '');

        // Ajouter FCFA à la fin si pas déjà présent et si il y a du contenu
        if (cleaned && !cleaned.includes('FCFA')) {
            cleaned += ' FCFA';
        }

        return cleaned;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Si on supprime tout, permettre la suppression complète
        if (newValue === '' || newValue === 'FCFA' || newValue === ' FCFA') {
            onChange('');
            return;
        }

        // Sinon, formater la valeur
        const formatted = formatValue(newValue);
        onChange(formatted);
    };

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
        if (value && !value.includes('FCFA')) {
            onChange(value + ' FCFA');
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                required={required}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            />
            {!focused && !value && (
                <span className="absolute right-3 top-2 text-gray-400 text-sm pointer-events-none">
                    FCFA
                </span>
            )}
        </div>
    );
};

export default FCFAInput;
