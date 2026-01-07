import { Editor } from '@tiptap/react';
import { Type, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const FontFamilyDropdown = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const FONTS = [
        { name: 'Inter', value: 'Inter' },
        { name: 'Comic Sans', value: 'Comic Sans MS' },
        { name: 'Serif', value: 'serif' },
        { name: 'Monospace', value: 'monospace' },
        { name: 'Cursive', value: 'cursive' },
        { name: 'Times New Roman', value: 'Times New Roman' },
        { name: 'Bebas Neue', value: 'Bebas Neue' },
        { name: 'Playfair Display', value: 'Playfair Display' },
        { name: 'Montserrat', value: 'Montserrat' },
        { name: 'Lobster', value: 'Lobster' },
    ];

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

    // Helper to check if a font is active
    const isFontActive = (fontValue: string) => {
        if (fontValue === 'Inter') {
            // Inter is active if explicit set OR if no font family is set (default)
            return editor.isActive('textStyle', { fontFamily: 'Inter' }) || !editor.getAttributes('textStyle').fontFamily;
        }
        return editor.isActive('textStyle', { fontFamily: fontValue });
    };

    // Find the currently active font object to display its name
    const activeFontItem = FONTS.find(font => isFontActive(font.value)) || FONTS[0];

    const handleFontSelect = (font: string) => {
        editor.chain().focus().setFontFamily(font).run();
        setIsOpen(false);
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            width="w-48"
            trigger={
                <MenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    hasDropdown
                    isActive={isOpen}
                    title="Font Family"
                    className="w-[120px] justify-between px-2"
                >
                    <span className="text-sm font-medium truncate" style={{ fontFamily: activeFontItem.value }}>
                        {activeFontItem.name}
                    </span>
                </MenuButton>
            }
        >
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1">
                {FONTS.map((font) => (
                    <button
                        key={font.name}
                        onClick={() => handleFontSelect(font.value)}
                        className={`w-full cursor-pointer text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between group ${isFontActive(font.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                        style={{ fontFamily: font.value }}
                    >
                        <span>{font.name}</span>
                        {isFontActive(font.value) && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                ))}
            </div>
        </Dropdown>
    );
};
