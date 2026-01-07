import { Editor } from '@tiptap/react';
import { Type, Heading1, Heading2, Heading3, Quote, Code, Check } from 'lucide-react';
import React, { useState } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const HeadingDropdown = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const OPTIONS = [
        { label: 'Paragraph', icon: Type, action: () => editor.chain().focus().setParagraph().run(), isActive: () => editor.isActive('paragraph'), className: 'font-normal' },
        { label: 'Heading 1', icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }), className: 'text-xl font-bold' },
        { label: 'Heading 2', icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }), className: 'text-lg font-bold' },
        { label: 'Heading 3', icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }), className: 'text-md font-bold' },
        { label: 'Quote', icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote'), className: 'italic text-gray-500' },
        { label: 'Code', icon: Code, action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive('code'), className: 'font-mono text-sm bg-gray-100 p-0.5 rounded' },
    ];

    const activeOption = OPTIONS.find(opt => opt.isActive()) || OPTIONS[0];

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            trigger={
                <MenuButton onClick={() => setIsOpen(!isOpen)} hasDropdown isActive={isOpen} title="Text Style">
                    {/* Show icon of active style, fallback to Type */}
                    <activeOption.icon className="w-4 h-4" />
                </MenuButton>
            }
        >
            {OPTIONS.map((opt) => (
                <button
                    key={opt.label}
                    onClick={() => { opt.action(); setIsOpen(false); }}
                    className={`w-full cursor-pointer text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between group ${opt.isActive() ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                >
                    <span className={`flex items-center gap-2 ${opt.className}`}>
                        <opt.icon className="w-4 h-4 opacity-50" />
                        {opt.label}
                    </span>
                    {opt.isActive() && <Check className="w-4 h-4 text-blue-600" />}
                </button>
            ))}
        </Dropdown>
    );
};
