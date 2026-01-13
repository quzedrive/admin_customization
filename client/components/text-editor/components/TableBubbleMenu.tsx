import { Editor } from '@tiptap/react';
import { BubbleMenu } from './BubbleMenu';
import {
    ChevronDown,
    Columns,
    Rows,
    Trash2,
    Combine,
    Split,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    MoreVertical
} from 'lucide-react';
import React, { useState } from 'react';

export const TableBubbleMenu = ({ editor }: { editor: Editor }) => {
    if (!editor) return null;

    return (
        <BubbleMenu
            pluginKey="tableMenu"
            editor={editor}
            shouldShow={({ editor }: { editor: Editor }) => editor.isActive('table')}
            className="flex flex-wrap items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
            <div className="flex items-center gap-1 border-r border-gray-200 pr-1 mr-1">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().updateAttributes('table', { align: 'left' }).run()}
                    className={`p-1.5 cursor-pointer rounded flex items-center gap-1 text-xs ${editor.isActive('table', { align: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    title="Align Table Left"
                >
                    <div className="flex flex-col gap-[2px]">
                        <div className="w-3 h-[2px] bg-current"></div>
                        <div className="w-2 h-[2px] bg-current mr-auto"></div>
                        <div className="w-3 h-[2px] bg-current"></div>
                    </div>
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().updateAttributes('table', { align: 'center' }).run()}
                    className={`p-1.5 cursor-pointer rounded flex items-center gap-1 text-xs ${editor.isActive('table', { align: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    title="Align Table Center"
                >
                    <div className="flex flex-col gap-[2px] items-center">
                        <div className="w-3 h-[2px] bg-current"></div>
                        <div className="w-2 h-[2px] bg-current"></div>
                        <div className="w-3 h-[2px] bg-current"></div>
                    </div>
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().updateAttributes('table', { align: 'right' }).run()}
                    className={`p-1.5 cursor-pointer rounded flex items-center gap-1 text-xs ${editor.isActive('table', { align: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    title="Align Table Right"
                >
                    <div className="flex flex-col gap-[2px] items-end">
                        <div className="w-3 h-[2px] bg-current"></div>
                        <div className="w-2 h-[2px] bg-current ml-auto"></div>
                        <div className="w-3 h-[2px] bg-current"></div>
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 pr-1 mr-1">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-xs"
                    title="Add Column Left"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <Columns className="w-3.5 h-3.5" />
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-xs"
                    title="Add Column Right"
                >
                    <Columns className="w-3.5 h-3.5" />
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 pr-1 mr-1">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-xs"
                    title="Add Row Above"
                >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <Rows className="w-3.5 h-3.5" />
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-xs"
                    title="Add Row Below"
                >
                    <Rows className="w-3.5 h-3.5" />
                    <ArrowDown className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 pr-1 mr-1">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded"
                    title="Merge Cells"
                >
                    <Combine className="w-4 h-4" />
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().splitCell().run()}
                    className="p-1.5 cursor-pointer text-gray-600 hover:bg-gray-100 rounded"
                    title="Split Cell"
                >
                    <Split className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded"
                    title="Delete Column"
                >
                    <Columns className="w-4 h-4" />
                    <span className="sr-only">Del Col</span>
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded"
                    title="Delete Row"
                >
                    <Rows className="w-4 h-4" />
                    <span className="sr-only">Del Row</span>
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded"
                    title="Delete Table"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </BubbleMenu>
    );
};
