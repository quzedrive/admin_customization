import React from 'react';

const colorClasses = {
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
};

interface StatusToggleProps {
    status: number; // 1 for Active, 2 for Inactive
    onToggle: () => void;
    isLoading?: boolean;
    color?: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';
}

const StatusToggle: React.FC<StatusToggleProps> = ({
    status,
    onToggle,
    isLoading = false,
    color = 'green'
}) => {
    const isActive = status === 1;
    const activeClass = colorClasses[color] || colorClasses.green;

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!isLoading) onToggle();
            }}
            disabled={isLoading}
            className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-600 focus-visible:ring-offset-2
        ${isActive ? activeClass : 'bg-gray-200'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
            title={isActive ? 'Deactivate' : 'Activate'}
        >
            <span className="sr-only">Toggle Status</span>
            <span
                aria-hidden="true"
                className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${isActive ? 'translate-x-5' : 'translate-x-0'}
        `}
            />
        </button>
    );
};

export default StatusToggle;
