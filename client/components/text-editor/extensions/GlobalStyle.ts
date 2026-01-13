import { Extension } from '@tiptap/core';

export const GlobalStyle = Extension.create({
    name: 'globalStyle',

    addGlobalAttributes() {
        return [
            {
                types: ['textStyle', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'image', 'table', 'tableRow', 'tableHeader', 'tableCell'],
                attributes: {
                    style: {
                        default: null,
                        parseHTML: element => element.getAttribute('style'),
                        renderHTML: attributes => {
                            if (!attributes.style) return {};
                            return { style: attributes.style };
                        },
                    },
                },
            },
        ];
    },
});
