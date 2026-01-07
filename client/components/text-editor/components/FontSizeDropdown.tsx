import { Editor } from '@tiptap/react';
import { Type, Check, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const FontSizeDropdown = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [_, forceUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;

        const onUpdate = () => forceUpdate((n) => n + 1);

        editor.on('transaction', onUpdate);
        editor.on('selectionUpdate', onUpdate);

        return () => {
            editor.off('transaction', onUpdate);
            editor.off('selectionUpdate', onUpdate);
        };
    }, [editor]);

    const FONT_SIZES = [
        '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'
    ];

    const currentSize = editor.getAttributes('textStyle').fontSize || '16px';

    const handleSizeSelect = (size: string) => {
        editor.chain().focus().setFontSize(size).run();
        setIsOpen(false);
    };

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let size = inputValue.trim();
            if (size && !isNaN(Number(size))) {
                size = `${size}px`;
            }
            if (size) {
                handleSizeSelect(size);
                setInputValue('');
            }
        }
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            width="w-24"
            trigger={
                <MenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    hasDropdown
                    isActive={isOpen}
                    title="Font Size"
                    className="w-[70px] justify-between px-2"
                >
                    <span className="text-sm font-medium truncate">{currentSize.replace('px', '')}</span>
                </MenuButton>
            }
        >
            <div className="p-1 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Custom"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="w-full px-2 py-1 text-sm text-gray-600 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1">
                {FONT_SIZES.map((size) => (
                    <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`w-full cursor-pointer text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between group ${currentSize === size ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                    >
                        <span>{size}</span>
                        {currentSize === size && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                ))}
            </div>
        </Dropdown>
    );
};
