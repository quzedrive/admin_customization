import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { X } from 'lucide-react';

interface EditHTMLModalProps {
    editor: Editor;
    isOpen: boolean;
    onClose: () => void;
}

export const EditHTMLModal = ({ editor, isOpen, onClose }: EditHTMLModalProps) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        if (isOpen && editor) {
            const content = editor.getHTML();
            setHtmlContent(content);
        }
    }, [isOpen, editor]);

    const processHTML = (html: string): Promise<string> => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');

            // Positioning - Visible to engine, hidden to user
            iframe.style.position = 'absolute';
            iframe.style.width = '1024px';    // Standard desktop width
            iframe.style.height = '768px';    // Standard height
            iframe.style.visibility = 'hidden';
            iframe.style.pointerEvents = 'none';
            iframe.style.top = '-9999px';
            iframe.style.left = '-9999px';

            document.body.appendChild(iframe);

            const checkStylesAndProcessing = (attempts = 0) => {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;

                if (!doc) {
                    cleanup();
                    resolve(html);
                    return;
                }

                // Check if stylesheets are ready
                // We verify if any checkable stylesheets exist
                const hasStyles = doc.styleSheets.length > 0;
                // Also check if we have any cssRules in them (if accessible)
                let hasRules = false;
                if (hasStyles) {
                    try {
                        hasRules = Array.from(doc.styleSheets).some(s => {
                            try { return s.cssRules.length > 0; } catch { return false; }
                        });
                    } catch (e) { }
                }

                // If no styles found yet, wait longer (up to 2.5s)
                if ((!hasStyles || !hasRules) && attempts < 50) {
                    // Force a layout recalc?
                    const _ = doc.body?.offsetHeight;
                    setTimeout(() => checkStylesAndProcessing(attempts + 1), 50);
                    return;
                }

                try {
                    // Force Layout Calculation
                    if (doc.body) { const _ = doc.body.offsetHeight; }

                    // Inline styles
                    const styleSheets = Array.from(doc.styleSheets);
                    styleSheets.forEach((sheet) => {
                        try {
                            const rules = Array.from(sheet.cssRules || []);
                            rules.forEach((rule) => {
                                if (rule instanceof CSSStyleRule) {
                                    const selector = rule.selectorText;
                                    try {
                                        const elements = doc.querySelectorAll(selector);
                                        elements.forEach((el) => {
                                            if (el.tagName === 'BODY') return;
                                            const element = el as HTMLElement;

                                            // Copy all properties
                                            for (let i = 0; i < rule.style.length; i++) {
                                                const propName = rule.style[i];
                                                const propValue = rule.style.getPropertyValue(propName);
                                                const priority = rule.style.getPropertyPriority(propName);

                                                if (!element.style.getPropertyValue(propName) || priority === 'important') {
                                                    element.style.setProperty(propName, propValue, priority);
                                                }
                                            }
                                        });
                                    } catch (err) {
                                        // Ignore invalid selectors
                                    }
                                }
                            });
                        } catch (e) {
                            console.warn('Error reading stylesheet rules', e);
                        }
                    });

                    // Capture Body Styles
                    const body = doc.body;
                    let bodyStyleString = '';
                    if (body) {
                        styleSheets.forEach((sheet) => {
                            try {
                                const rules = Array.from(sheet.cssRules || []);
                                rules.forEach((rule) => {
                                    if (rule instanceof CSSStyleRule && (rule.selectorText === 'body' || (rule.selectorText && rule.selectorText.toLowerCase() === 'body'))) {
                                        for (let i = 0; i < rule.style.length; i++) {
                                            const propName = rule.style[i];
                                            body.style.setProperty(propName, rule.style.getPropertyValue(propName), rule.style.getPropertyPriority(propName));
                                        }
                                    }
                                });
                            } catch (e) { }
                        });
                        bodyStyleString = body.getAttribute('style') || '';
                    }

                    // Remove style tags
                    const styleTags = doc.querySelectorAll('style');
                    styleTags.forEach(tag => tag.remove());

                    // Normalize Structure
                    normalizeStructure(doc);

                    const content = doc.body.innerHTML;
                    // Ensure the wrapper matches the body's styles perfectly
                    const finalHtml = `<div style="${bodyStyleString}; width: 100%; min-height: 100%; box-sizing: border-box;">${content}</div>`;

                    cleanup();
                    resolve(finalHtml);
                } catch (error) {
                    console.error('Error processing HTML styles:', error);
                    cleanup();
                    resolve(html);
                }
            };

            const normalizeStructure = (doc: Document) => {
                const normalizeNode = (node: Element) => {
                    const childNodes = Array.from(node.childNodes);
                    let hasBlock = false;
                    let hasInline = false;

                    for (const child of childNodes) {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            const tag = (child as Element).tagName.toLowerCase();
                            const isBlock = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'table', 'hr', 'pre'].includes(tag);
                            if (isBlock) hasBlock = true;
                            else hasInline = true;
                        } else if (child.nodeType === Node.TEXT_NODE) {
                            if (child.textContent && child.textContent.trim().length > 0) {
                                hasInline = true;
                            }
                        }
                    }

                    const tag = node.tagName.toLowerCase();
                    if (['div', 'body'].includes(tag) && hasBlock && hasInline) {
                        const fragment = doc.createDocumentFragment();
                        let buffer: Node[] = [];

                        const flushBuffer = () => {
                            if (buffer.length > 0) {
                                const hasText = buffer.some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
                                const hasInlineElem = buffer.some(n => n.nodeType === Node.ELEMENT_NODE);

                                if (hasText || hasInlineElem) {
                                    const p = doc.createElement('p');
                                    p.style.margin = '0';
                                    p.style.display = 'contents';
                                    buffer.forEach(n => p.appendChild(n));
                                    fragment.appendChild(p);
                                }
                                buffer = [];
                            }
                        };

                        childNodes.forEach(child => {
                            const isElement = child.nodeType === Node.ELEMENT_NODE;
                            const tagName = isElement ? (child as Element).tagName.toLowerCase() : '';
                            const isBlock = isElement && ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'table', 'hr', 'pre'].includes(tagName);

                            if (isBlock) {
                                flushBuffer();
                                fragment.appendChild(child);
                            } else {
                                buffer.push(child);
                            }
                        });
                        flushBuffer();
                        node.innerHTML = '';
                        node.appendChild(fragment);
                    } else if (['div', 'body'].includes(tag) && !hasBlock && hasInline) {
                        const p = doc.createElement('p');
                        p.style.margin = '0';
                        p.style.display = 'contents';
                        while (node.firstChild) {
                            p.appendChild(node.firstChild);
                        }
                        node.appendChild(p);
                    }

                    Array.from(node.children).forEach(child => normalizeNode(child));
                };
                normalizeNode(doc.body);
            };

            const cleanup = () => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            };

            // Use srcdoc if available for better sync parsing, fallback to write
            iframe.onload = () => {
                checkStylesAndProcessing(0);
            }

            // Using srcdoc is reliable in modern browsers
            iframe.srcdoc = html;
        });
    };

    const handleSave = async () => {
        if (editor) {
            try {
                const processedContent = await processHTML(htmlContent);
                editor.commands.setContent(processedContent);
            } catch (e) {
                console.error("Failed to set content", e);
            }
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Source Code</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <p className="text-sm text-gray-500 mb-2">
                        You can paste direct HTML here (e.g. from an email template builder).
                    </p>
                    <textarea
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        className="flex-1 w-full p-4 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                        spellCheck={false}
                    />
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium shadow-sm shadow-blue-500/20 transition-all"
                    >
                        Update Content
                    </button>
                </div>
            </div>
        </div>
    );
};
