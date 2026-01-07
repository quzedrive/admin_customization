'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import Strike from '@tiptap/extension-strike';
import History from '@tiptap/extension-history';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import React, { useEffect } from 'react';

import { Toolbar } from './Toolbar';
import { FontFamily } from './extensions/FontFamily';
import { Indent } from './extensions/Indent';
import { FontSize } from './extensions/FontSize';
import { TableBubbleMenu } from './components/TableBubbleMenu';
import { ResizableImage } from './components/ResizableImage';

interface TipTapEditorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}

const TipTapEditor = ({ label, value, onChange, error, placeholder = 'Start writing...' }: TipTapEditorProps) => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Blockquote,
            HardBreak,
            HorizontalRule,
            ListItem,
            Strike,
            History,
            Bold,
            Italic,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Code,
            CodeBlock,
            BulletList.extend({
                addAttributes() {
                    return {
                        type: {
                            default: 'disc',
                            parseHTML: element => element.getAttribute('type'),
                            renderHTML: attributes => {
                                return {
                                    class: `ml-5 space-y-1 ${attributes.type === 'circle' ? 'list-[circle]' : attributes.type === 'square' ? 'list-[square]' : 'list-disc'}`,
                                };
                            },
                        },
                    };
                },
            }),
            OrderedList.extend({
                addAttributes() {
                    return {
                        type: {
                            default: '1',
                            parseHTML: element => element.getAttribute('type'),
                            renderHTML: attributes => {
                                let listStyle = 'list-decimal';
                                if (attributes.type === 'a') listStyle = 'list-[lower-alpha]';
                                else if (attributes.type === 'A') listStyle = 'list-[upper-alpha]';
                                else if (attributes.type === 'i') listStyle = 'list-[lower-roman]';
                                else if (attributes.type === 'I') listStyle = 'list-[upper-roman]';

                                return {
                                    class: `ml-5 space-y-1 ${listStyle}`,
                                    // Also pass the type attribute for semantic correctness/export
                                    type: attributes.type,
                                };
                            },
                        },
                    };
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: false, // Disable autolink to prevent sticking http:// to {{link}}
                defaultProtocol: 'https',
                validate: href => true, // Allow any href, including {{link}}
                HTMLAttributes: {
                    // Default styling, but allowing overrides if merged correctly
                    class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
                },
            }),
            Image.configure({
                allowBase64: true,
                inline: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }).extend({
                addNodeView() {
                    return ReactNodeViewRenderer(ResizableImage);
                },
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        width: {
                            default: null,
                            renderHTML: attributes => ({
                                width: attributes.width,
                            }),
                            parseHTML: element => element.getAttribute('width'),
                        },
                        src: {
                            default: null,
                        },
                        alt: {
                            default: null,
                        },
                    };
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
            FontSize,
            Indent,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full border border-gray-300',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 border border-gray-300 p-2 font-bold text-left',
                }
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 p-2',
                }
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl text-black mx-3 my-1 focus:outline-none min-h-[150px] max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:my-2 [&_hr]:my-6 [&>:first-child]:mt-0 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:before:content-['“'] [&_blockquote]:before:text-gray-400 [&_blockquote]:before:mr-1 [&_blockquote]:after:content-['”'] [&_blockquote]:after:text-gray-400 [&_blockquote]:after:ml-1 [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:my-4 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
            },
        },
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (editor.isEmpty && !value) return;
            if (!editor.isFocused) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}
            <div className={`editor-container border rounded-xl bg-white overflow-visible transition-all shadow-sm ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
                }`}>
                <Toolbar editor={editor} />
                {editor && <TableBubbleMenu editor={editor} />}
                <EditorContent editor={editor} className="px-4 py-3 min-h-[300px] cursor-text" />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default TipTapEditor;
