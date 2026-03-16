import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface ModernDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  placeholder?: string;
  align?: "left" | "right";
  error?: string;
  label?: string;
  required?: boolean;
  width?: string;
  disabled?: boolean;
}

/**
 * Modern Dropdown Component
 */
const ModernDropdown: React.FC<ModernDropdownProps> = ({
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = "Select option",
  align = "left",
  error,
  label,
  required = false,
  width = 'w-full',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside and handle position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRequired = 250; // Dropdown max height + some buffer
      setOpenTop(spaceBelow < spaceRequired && rect.top > spaceRequired);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg transition-all duration-200 group w-full justify-between ${disabled
            ? 'cursor-not-allowed opacity-60 bg-gray-50'
            : 'cursor-pointer hover:bg-gray-50'
            } ${error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : isOpen
                ? 'ring-2 ring-blue-100 border-blue-500'
                : 'border-gray-300 hover:border-blue-500'
            }`}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className={`text-gray-400 group-hover:text-blue-500 transition-colors ${isOpen ? 'text-blue-500' : ''}`} />}
            <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>{selectedLabel}</span>
          </div>
          <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute z-[100] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 ${width} ${isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            } ${align === 'right' ? 'right-0' : 'left-0'} ${openTop
              ? 'bottom-full mb-2 origin-bottom'
              : 'top-full mt-2 origin-top'
            }`}
        >
          <div className="p-1 max-h-[250px] overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${value === option.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={14} className="text-blue-600" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="p-3 text-center text-sm text-gray-400 font-medium">
                No options available
              </div>
            )}
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ModernDropdown;