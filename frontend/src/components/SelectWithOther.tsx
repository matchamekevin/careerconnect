import React, { useState } from 'react';

interface SelectWithOtherProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    className?: string;
    name?: string;
    required?: boolean;
    allowOther?: boolean;
    otherRequired?: boolean; // Nouvelle prop pour rendre le champ "Autre" optionnel
}

const SelectWithOther: React.FC<SelectWithOtherProps> = ({
    value,
    onChange,
    options,
    placeholder,
    className = "",
    name,
    required = false,
    allowOther = true,
    otherRequired = false // Par défaut, le champ "Autre" est optionnel
}) => {
    const [isOtherSelected, setIsOtherSelected] = useState(
        value && !options.includes(value) && value !== ''
    );

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'other') {
            setIsOtherSelected(true);
            onChange('');
        } else {
            setIsOtherSelected(false);
            onChange(selectedValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    if (isOtherSelected) {
        return (
            <div className="space-y-2">
                <select
                    value="other"
                    onChange={handleSelectChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                >
                    <option value="">Sélectionnez...</option>
                    {options.map((option, index) => (
                        <option key={`${option}-${index}`} value={option}>
                            {option}
                        </option>
                    ))}
                    {allowOther && <option value="other">Autre</option>}
                </select>
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Saisissez votre option... (optionnel)"
                    required={otherRequired}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                />
            </div>
        );
    }

    return (
        <select
            name={name}
            value={value}
            onChange={handleSelectChange}
            required={required}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
                <option key={`${option}-${index}`} value={option}>
                    {option}
                </option>
            ))}
            {allowOther && <option value="other">Autre</option>}
        </select>
    );
};

export default SelectWithOther;
