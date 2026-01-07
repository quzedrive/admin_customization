import { Editor } from '@tiptap/react';
import { Link as LinkIcon, Check, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';

interface LinkDropdownProps {
    editor: Editor;
}

export const LinkDropdown = ({ editor }: LinkDropdownProps) => {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [className, setClassName] = useState('');
    const [openInNewTab, setOpenInNewTab] = useState(false);
    const [noFollow, setNoFollow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Sync state with editor selection when menu opens
    useEffect(() => {
        if (!isOpen) return;

        const attrs = editor.getAttributes('link');
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        setUrl(attrs.href || '');
        setText(attrs.text || selectedText || '');
        setClassName(attrs.class || '');
        setOpenInNewTab(attrs.target === '_blank');
        setNoFollow(attrs.rel?.includes('nofollow') || false);
    }, [isOpen, editor]);

    const handleSubmit = () => {
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setIsOpen(false);
            return;
        }

        // Prepare attributes
        const linkAttrs = {
            href: url,
            target: openInNewTab ? '_blank' : null,
            rel: noFollow ? 'nofollow' : null,
            class: className || null,
        };

        // If text was changed and we have a selection or it's new
        if (text) {
            // If we are updating an existing link or inserting new text with link
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink(linkAttrs)
                .command(({ tr, dispatch }) => {
                    // If user wants to change text, we might need a more complex insertContent or replace
                    // For now, simple setLink is safest. Updating text is tricky in TipTap without replacing content.
                    if (dispatch) {
                        const { from, to } = editor.state.selection;
                        if (from !== to) {
                            tr.insertText(text, from, to);
                            // Re-apply mark to new text
                            // This is a bit complex, relying on simple setLink for now is better for MVP unless text replacement is critical.
                            // TipTap setLink usually applies to selection.
                        }
                    }
                    return true;
                })
                .run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
        }

        // Handling text replacement separately for robustness
        // If there is a selection, we update the link. 
        // If the user changed the text field, we should theoretically replace the selected text with the new text 
        // and apply the link to it.
        if (text && text !== editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ')) {
            editor.chain().focus().extendMarkRange('link').insertContent({
                type: 'text',
                text: text,
                marks: [{
                    type: 'link',
                    attrs: linkAttrs
                }]
            }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
        }

        setIsOpen(false);
    };

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setIsOpen(false);
    };

    const isActive = editor.isActive('link');

    return (
        <Dropdown
            trigger={
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type='button'
                    className={`p-1.5 cursor-pointer rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
            }
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            width="w-72"
        >
            <div className="p-3 space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full text-sm p-1.5 border border-gray-200 rounded text-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Text</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Link text"
                        className="w-full text-sm p-1.5 border border-gray-200 rounded text-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Class Name</label>
                    <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="e.g. btn-primary"
                        className="w-full text-sm p-1.5 border border-gray-200 rounded text-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={openInNewTab}
                            onChange={(e) => setOpenInNewTab(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Open in new tab</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={noFollow}
                            onChange={(e) => setNoFollow(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">No follow</span>
                    </label>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                        Insert
                    </button>
                    {isActive && (
                        <button
                            onClick={removeLink}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100"
                            title="Remove Link"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </Dropdown>
    );
};
