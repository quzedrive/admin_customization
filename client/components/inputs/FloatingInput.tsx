
import React from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    color?: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';
    error?: string;
    icon?: React.ElementType;
    type?: string;
}

// Map possible colors to their full Tailwind class strings.
// Tailwind scans code for complete class names, so string interpolation like `border-${color}-600` fails.
const colorClasses = {
    teal: {
        input: 'focus:border-teal-600',
        label: 'peer-focus:text-teal-600',
    },
    blue: {
        input: 'focus:border-blue-600',
        label: 'peer-focus:text-blue-600',
    },
    red: {
        input: 'focus:border-red-600',
        label: 'peer-focus:text-red-600',
    },
    green: {
        input: 'focus:border-green-600',
        label: 'peer-focus:text-green-600',
    },
    yellow: {
        input: 'focus:border-yellow-600',
        label: 'peer-focus:text-yellow-600',
    },
    purple: {
        input: 'focus:border-purple-600',
        label: 'peer-focus:text-purple-600',
    },
};

const FloatingInput: React.FC<FloatingInputProps> = ({ label, className = '', color = 'teal', error, icon: Icon, type = 'text', ...props }) => {
    // Generate a unique ID if one isn't provided to ensure label focusing works
    const generatedId = React.useId();
    const inputId = props.id || generatedId;

    // If error exists, force red color
    const usedColor = error ? 'red' : color;
    const activeColor = colorClasses[usedColor] || colorClasses['teal'];

    if (type === 'textarea') {
        // Minimal textarea implementation matching style (simplified)
        return (
            <div className="w-full">
                <div className="relative">
                    <textarea
                        {...props}
                        id={inputId}
                        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 peer ${activeColor.input} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 min-h-[100px]`}
                        placeholder=" "
                    />
                    <label
                        htmlFor={inputId}
                        className={`absolute text-sm cursor-text ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:top-0 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${activeColor.label}`}
                    >
                        {label}
                    </label>
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    {...props}
                    type={type}
                    id={inputId}
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 peer ${activeColor.input} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${Icon ? 'pl-10' : ''}`}
                    placeholder=" "
                />
                {Icon && (
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:${activeColor.label.replace('peer-focus:', '')} transition-colors`}>
                        <Icon size={18} />
                    </div>
                )}
                <label
                    htmlFor={inputId}
                    className={`absolute text-sm cursor-text ${error ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${Icon ? 'left-8' : 'left-1'} ${activeColor.label}`}
                >
                    {label}
                </label>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default FloatingInput;
