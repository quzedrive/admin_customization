import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo,
    Minus, Table as TableIcon, Indent as IndentIcon, Outdent as OutdentIcon,
    Code as CodeIcon
} from 'lucide-react';
import React, { useState } from 'react';
import { MenuButton } from './components/MenuButton';
import { HeadingDropdown } from './components/HeadingDropdown';
import { ListStyleDropdown } from './components/ListStyleDropdown';
import { ColorPicker } from './components/ColorPicker';
import { FontSizeDropdown } from './components/FontSizeDropdown';
import { FontFamilyDropdown } from './components/FontFamilyDropdown';
import { TableSelector } from './components/TableSelector';
import { LinkDropdown } from './components/LinkDropdown';
import { ImageDropdown } from './components/ImageDropdown';
import { EditHTMLModal } from './components/EditHTMLModal';

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const [isHTMLModalOpen, setIsHTMLModalOpen] = useState(false);

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border-b border-gray-200 p-1.5 flex flex-wrap gap-1 bg-gray-50/50 rounded-t-xl items-center">

            <HeadingDropdown editor={editor} />
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <FontFamilyDropdown editor={editor} />
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <FontSizeDropdown editor={editor} />

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ListStyleDropdown editor={editor} type="bullet" />
            <ListStyleDropdown editor={editor} type="ordered" />

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <MenuButton
                onClick={() => {
                    const isList = editor.isActive('bulletList') || editor.isActive('orderedList');
                    if (isList) {
                        editor.chain().focus().liftListItem('listItem').run();
                    } else {
                        editor.chain().focus().outdent().run();
                    }
                }}
                title="Decrease Indent"
            >
                <OutdentIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton
                onClick={() => {
                    const isList = editor.isActive('bulletList') || editor.isActive('orderedList');
                    if (isList) {
                        editor.chain().focus().sinkListItem('listItem').run();
                    } else {
                        editor.chain().focus().indent().run();
                    }
                }}
                title="Increase Indent"
            >
                <IndentIcon className="w-4 h-4" />
            </MenuButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ColorPicker editor={editor} />

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                <Bold className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                <Italic className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                <UnderlineIcon className="w-4 h-4" />
            </MenuButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                <AlignLeft className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
                <AlignCenter className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                <AlignRight className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
                <AlignJustify className="w-4 h-4" />
            </MenuButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />
            <TableSelector editor={editor} />
            <LinkDropdown editor={editor} />
            <ImageDropdown editor={editor} />

            <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                <Minus className="w-4 h-4" />
            </MenuButton>

            <div className="ml-auto flex items-center gap-1 border-l border-gray-200 pl-2">
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} title="Undo">
                    <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} title="Redo">
                    <Redo className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-5 bg-gray-200 mx-2" />

                <MenuButton onClick={() => setIsHTMLModalOpen(true)} title="Edit Source Code (HTML)" isActive={isHTMLModalOpen}>
                    <CodeIcon className="w-4 h-4" />
                </MenuButton>
            </div>

            <EditHTMLModal
                editor={editor}
                isOpen={isHTMLModalOpen}
                onClose={() => setIsHTMLModalOpen(false)}
            />
        </div>
    );
};
