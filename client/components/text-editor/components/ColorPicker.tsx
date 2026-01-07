import { Editor } from '@tiptap/react';
import { Palette, Eraser } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const ColorPicker = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'text' | 'highlight'>('text');

    const COLORS = [
        '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f4f6', '#ffffff',
        '#f03e3e', '#ff6b6b', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0', '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#fcc419', '#ff922b',
        '#800000', '#a61e4d', '#862e9c', '#5f3dc4', '#364fc7', '#1864ab', '#0b7285', '#087f5b', '#2b8a3e', '#5c940d', '#e67700', '#d9480f'
    ];

    const [selectedColor, setSelectedColor] = useState('#000000');

    // Derived value for initial load and tab switches
    const editorColor = activeTab === 'text' ? editor.getAttributes('textStyle').color : editor.getAttributes('highlight').color;

    useEffect(() => {
        if (!editor) return;

        const syncing = () => {
            // When editor updates, we sync our local state to match the editor's truth
            const newColor = activeTab === 'text' ? editor.getAttributes('textStyle').color : editor.getAttributes('highlight').color;
            if (newColor) setSelectedColor(newColor);
            // If no color is set (e.g. cleared), default to black or transparent
            else setSelectedColor(activeTab === 'text' ? '#000000' : 'transparent');
        };

        // Sync initially
        syncing();

        editor.on('transaction', syncing);
        editor.on('selectionUpdate', syncing);

        return () => {
            editor.off('transaction', syncing);
            editor.off('selectionUpdate', syncing);
        };
    }, [editor, activeTab]);

    const handleColorSelect = (color: string, closeDropdown: boolean = true) => {
        // Optimistically update local state for instant feedback
        setSelectedColor(color);

        if (activeTab === 'text') {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().setHighlight({ color }).run();
        }
        if (closeDropdown) {
            setIsOpen(false);
        }
    };

    const handleReset = () => {
        const resetColor = activeTab === 'text' ? '#000000' : 'transparent';
        setSelectedColor(resetColor);

        if (activeTab === 'text') {
            editor.chain().focus().unsetColor().run();
        } else {
            editor.chain().focus().unsetHighlight().run();
        }
        setIsOpen(false);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setSelectedColor(newColor); // Instant update
        handleColorSelect(newColor, false);
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            width="w-64"
            trigger={
                <MenuButton onClick={() => setIsOpen(!isOpen)} hasDropdown isActive={isOpen} title="Colors">
                    <div className="flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{
                                backgroundColor: selectedColor || (activeTab === 'text' ? '#000000' : 'transparent'),
                                backgroundImage: !selectedColor && activeTab === 'highlight' ? 'linear-gradient(to bottom right, transparent 48%, #ff0000 50%, transparent 52%)' : 'none'
                            }}
                        />
                    </div>
                </MenuButton>
            }
        >
            <div className="w-64 overflow-hidden">
                <div className="flex border-b border-gray-100 p-1 bg-gray-50/80">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 cursor-pointer py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Text Color
                    </button>
                    <button
                        onClick={() => setActiveTab('highlight')}
                        className={`flex-1 cursor-pointer py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'highlight' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Highlight
                    </button>
                </div>

                <div className="p-3">
                    <div className="grid grid-cols-8 gap-1.5 mb-3">
                        <button
                            onClick={handleReset}
                            className="w-6 h-6 cursor-pointer rounded-md border border-gray-200 hover:border-red-400 flex items-center justify-center group bg-transparent shadow-sm"
                            title="Reset / None"
                        >
                            <Eraser className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
                        </button>
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`w-6 h-6 cursor-pointer rounded-md border transition-all shadow-sm flex items-center justify-center ${selectedColor === color
                                    ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                                    : 'border-transparent hover:scale-110 ring-1 ring-black/5'
                                    }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            >
                                {selectedColor === color && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`w-3 h-3 ${['#ffffff', '#f3f4f6', '#eeeeee'].includes(color) ? 'text-black' : 'text-white'}`}
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 mt-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                            <label className="flex-1 flex items-center justify-between text-xs text-gray-500 hover:text-gray-900 cursor-pointer group px-1">
                                <span className="font-medium mr-2">Custom</span>
                                <div className="w-full h-8 relative rounded-md border border-gray-200 overflow-hidden shadow-sm group-hover:border-gray-300 transition-colors">
                                    <input
                                        type="color"
                                        value={selectedColor.startsWith('#') ? selectedColor : '#000000'}
                                        onChange={handleCustomColorChange}
                                        className="absolute cursor-pointer -top-2 -left-2 w-32 h-32 p-0 border-0 cursor-pointer opacity-0"
                                    />
                                    <div
                                        className="w-full h-full flex items-center justify-center text-[10px] font-mono"
                                        style={{ backgroundColor: selectedColor }}
                                    >
                                        <span className="bg-white/40 backdrop-blur-[2px] px-1.5 py-0.5 rounded text-black font-semibold shadow-sm">
                                            {selectedColor}
                                        </span>
                                    </div>
                                </div>
                            </label>
                            <button
                                onClick={handleReset}
                                className="px-3 py-1.5 cursor-pointer bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors shadow-sm"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => handleColorSelect(selectedColor, true)}
                                className="px-3 py-1.5 cursor-pointer bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dropdown>
    );
};
