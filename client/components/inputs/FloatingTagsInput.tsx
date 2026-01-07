import React, { useState, KeyboardEvent } from 'react';

interface FloatingTagsInputProps {
    label: string;
    color?: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

// Map possible colors to their full Tailwind class strings.
const colorClasses = {
    teal: {
        input: 'focus:border-teal-600',
        label: 'peer-focus:text-teal-600',
        tag: 'bg-teal-100 text-teal-800',
    },
    blue: {
        input: 'focus:border-blue-600',
        label: 'peer-focus:text-blue-600',
        tag: 'bg-blue-100 text-blue-800',
    },
    red: {
        input: 'focus:border-red-600',
        label: 'peer-focus:text-red-600',
        tag: 'bg-red-100 text-red-800',
    },
    green: {
        input: 'focus:border-green-600',
        label: 'peer-focus:text-green-600',
        tag: 'bg-green-100 text-green-800',
    },
    yellow: {
        input: 'focus:border-yellow-600',
        label: 'peer-focus:text-yellow-600',
        tag: 'bg-yellow-100 text-yellow-800',
    },
    purple: {
        input: 'focus:border-purple-600',
        label: 'peer-focus:text-purple-600',
        tag: 'bg-purple-100 text-purple-800',
    },
};

const FloatingTagsInput: React.FC<FloatingTagsInputProps> = ({
    label,
    className = '',
    color = 'teal',
    value = [],
    onChange,
    placeholder = '',
    disabled = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>(value);
    const activeColor = colorClasses[color] || colorClasses['teal'];

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !tags.includes(trimmedValue)) {
            const newTags = [...tags, trimmedValue];
            setTags(newTags);
            onChange?.(newTags);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        onChange?.(newTags);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedTags = pastedText
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && !tags.includes(tag));
        
        if (pastedTags.length > 0) {
            const newTags = [...tags, ...pastedTags];
            setTags(newTags);
            onChange?.(newTags);
        }
    };

    return (
        <div className="relative">
            <div
                className={`block px-2.5 pb-2.5 pt-4 w-full min-h-[56px] text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 focus-within:outline-none focus-within:ring-0 peer ${activeColor.input} ${className}`}
            >
                <div className="flex flex-wrap gap-2 items-center">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${activeColor.tag}`}
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1.5 hover:opacity-70 focus:outline-none"
                                disabled={disabled}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onBlur={addTag}
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none focus:ring-0 p-0"
                        placeholder={tags.length === 0 ? placeholder : ''}
                        disabled={disabled}
                    />
                </div>
            </div>
            <label
                className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1 ${activeColor.label}`}
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingTagsInput;