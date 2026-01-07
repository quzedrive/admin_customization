import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontFamily: {
            /**
             * Set the font family
             */
            setFontFamily: (fontFamily: string) => ReturnType;
            /**
             * Unset the font family
             */
            unsetFontFamily: () => ReturnType;
        };
    }
}

export const FontFamily = Extension.create({
    name: 'fontFamily',

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontFamily: {
                        default: null,
                        parseHTML: element => {
                            // Helper to clean font family string
                            // 1. Get the first font in the stack (if multiple)
                            // 2. Remove quotes
                            // 3. Trim whitespace
                            const fontFamily = element.style.fontFamily;
                            if (!fontFamily) return null;

                            return fontFamily.split(',')[0].replace(/['"]+/g, '').trim();
                        },
                        renderHTML: attributes => {
                            if (!attributes.fontFamily) {
                                return {};
                            }

                            // Always quote the font family for safety in CSS
                            return {
                                style: `font-family: '${attributes.fontFamily}'`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontFamily: (fontFamily) => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontFamily })
                    .run();
            },
            unsetFontFamily: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontFamily: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});
