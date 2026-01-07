import { ChevronDown } from 'lucide-react';
import React from 'react';

export const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
    hasDropdown = false,
    className = ''
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
    hasDropdown?: boolean;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 cursor-pointer rounded-lg transition-colors flex items-center gap-1 ${isActive
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
        {hasDropdown && <ChevronDown className="w-3 h-3 opacity-70" />}
    </button>
);
