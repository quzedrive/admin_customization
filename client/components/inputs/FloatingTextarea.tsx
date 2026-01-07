import React from 'react';

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    color?: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';
}

// Map possible colors to their full Tailwind class strings.
const colorClasses = {
    teal: {
        textarea: 'focus:border-teal-600',
        label: 'peer-focus:text-teal-600',
    },
    blue: {
        textarea: 'focus:border-blue-600',
        label: 'peer-focus:text-blue-600',
    },
    red: {
        textarea: 'focus:border-red-600',
        label: 'peer-focus:text-red-600',
    },
    green: {
        textarea: 'focus:border-green-600',
        label: 'peer-focus:text-green-600',
    },
    yellow: {
        textarea: 'focus:border-yellow-600',
        label: 'peer-focus:text-yellow-600',
    },
    purple: {
        textarea: 'focus:border-purple-600',
        label: 'peer-focus:text-purple-600',
    },
};

const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
    label,
    className = '',
    color = 'teal',
    rows = 4,
    ...props
}) => {
    const generatedId = React.useId();
    const id = props.id || generatedId;
    const activeColor = colorClasses[color] || colorClasses['teal'];

    return (
        <div className="relative">
            <textarea
                {...props}
                id={id}
                rows={rows}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer resize-none ${activeColor.textarea} ${className}`}
                placeholder=" "
            />
            <label
                htmlFor={id}
                className={`absolute text-sm cursor-text text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${activeColor.label}`}
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingTextarea;