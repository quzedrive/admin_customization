import { Editor } from '@tiptap/react';
import { Table as TableIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Dropdown } from './Dropdown';
import { MenuButton } from './MenuButton';

export const TableSelector = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(0);
    const [hoveredCol, setHoveredCol] = useState(0);

    const handleCellHover = (row: number, col: number) => {
        setHoveredRow(row);
        setHoveredCol(col);
    };

    const handleCellClick = () => {
        if (hoveredRow > 0 && hoveredCol > 0) {
            editor.chain().focus().insertTable({ rows: hoveredRow, cols: hoveredCol, withHeaderRow: true }).run();
            setIsOpen(false);
        }
    };

    const resetHover = () => {
        setHoveredRow(0);
        setHoveredCol(0);
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => { setIsOpen(false); resetHover(); }}
            width="min-w-max" // Ensure width fits the grid
            trigger={
                <MenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    isActive={isOpen}
                    title="Insert Table"
                >
                    <TableIcon className="w-4 h-4" />
                </MenuButton>
            }
        >
            <div className="p-3">
                <div
                    className="grid gap-1.5 mb-2"
                    onMouseLeave={resetHover}
                    style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
                >
                    {Array.from({ length: 10 }).map((_, rowIndex) => (
                        Array.from({ length: 10 }).map((_, colIndex) => {
                            const r = rowIndex + 1;
                            const c = colIndex + 1;
                            const isActive = r <= hoveredRow && c <= hoveredCol;

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onMouseEnter={() => handleCellHover(r, c)}
                                    onClick={handleCellClick}
                                    className={`w-5 h-5 border rounded-sm cursor-pointer transition-colors ${isActive ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-200 hover:border-gray-400'
                                        }`}
                                />
                            );
                        })
                    ))}
                </div>
                <div className="text-center text-sm font-medium text-gray-700">
                    {hoveredRow > 0 && hoveredCol > 0 ? `${hoveredRow} x ${hoveredCol}` : 'Select Size'}
                </div>
            </div>
        </Dropdown>
    );
};
