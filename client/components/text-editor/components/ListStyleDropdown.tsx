import { Editor } from '@tiptap/react';
import { ListOrdered, List as ListIcon, Check } from 'lucide-react';
import React, { useState } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const ListStyleDropdown = ({ editor, type }: { editor: Editor, type: 'ordered' | 'bullet' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Note: TipTap's standard OrderedList extension supports 'type' attribute if configured properly.
    // For style preview, we use Tailwind classes that approximate the look.
    const orderedOptions = [
        { label: 'Default (1, 2, 3)', value: '1', cssClass: 'list-decimal' },
        { label: 'Lower Alpha (a, b, c)', value: 'a', cssClass: 'list-[lower-alpha]' },
        { label: 'Lower Roman (i, ii, iii)', value: 'i', cssClass: 'list-[lower-roman]' },
        { label: 'Upper Alpha (A, B, C)', value: 'A', cssClass: 'list-[upper-alpha]' },
        { label: 'Upper Roman (I, II, III)', value: 'I', cssClass: 'list-[upper-roman]' },
    ];

    const bulletOptions = [
        { label: 'Default (Disc)', value: 'disc', cssClass: 'list-disc' },
        { label: 'Circle', value: 'circle', cssClass: 'list-[circle]' },
        { label: 'Square', value: 'square', cssClass: 'list-[square]' },
    ];

    const options = type === 'ordered' ? orderedOptions : bulletOptions;

    const applyList = (styleType: string) => {
        const listName = type === 'ordered' ? 'orderedList' : 'bulletList';
        const isListActive = editor.isActive(listName);

        if (isListActive) {
            // If the list is already active, just update the attributes to change the style
            editor.chain().focus().updateAttributes(listName, { type: styleType }).run();
        } else {
            // If the list is NOT active, toggle it on (creates it) and then update attributes
            if (type === 'ordered') {
                editor.chain().focus().toggleOrderedList().updateAttributes(listName, { type: styleType }).run();
            } else {
                editor.chain().focus().toggleBulletList().updateAttributes(listName, { type: styleType }).run();
            }
        }
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            trigger={
                <MenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    hasDropdown
                    isActive={isOpen || (type === 'ordered' ? editor.isActive('orderedList') : editor.isActive('bulletList'))}
                    title={type === 'ordered' ? 'Ordered List' : 'Bullet List'}
                >
                    {type === 'ordered' ? <ListOrdered className="w-4 h-4" /> : <ListIcon className="w-4 h-4" />}
                </MenuButton>
            }
        >
            <div className="p-1">
                {options.map((opt) => {
                    const isActive = type === 'ordered'
                        ? editor.isActive('orderedList', { type: opt.value })
                        : editor.isActive('bulletList', { type: opt.value });

                    return (
                        <button
                            key={opt.label}
                            onClick={() => { applyList(opt.value); setIsOpen(false); }}
                            className={`w-full cursor-pointer text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between group ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 flex items-center justify-center bg-gray-50 rounded text-xs font-serif border border-gray-100 ${opt.cssClass}`}>
                                    {type === 'ordered' ? (
                                        opt.value === '1' ? '1' : opt.value === 'a' ? 'a' : 'I'
                                    ) : (
                                        opt.value === 'circle' ? (
                                            <div className="w-1.5 h-1.5 rounded-full border border-gray-600" />
                                        ) : opt.value === 'square' ? (
                                            <div className="w-1.5 h-1.5 bg-gray-600" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                        )
                                    )}
                                </div>
                                {opt.label}
                            </div>
                            {isActive && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                    );
                })}
            </div>
        </Dropdown>
    );
};
