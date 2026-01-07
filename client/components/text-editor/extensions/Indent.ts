import { Extension } from '@tiptap/core';

export interface IndentOptions {
    types: string[];
    indentLevels: number[];
    defaultIndentLevel: number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType;
            outdent: () => ReturnType;
        };
    }
}

export const Indent = Extension.create<IndentOptions>({
    name: 'indent',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
            defaultIndentLevel: 0,
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: this.options.defaultIndentLevel,
                        parseHTML: element => {
                            const indent = parseInt(element.style.marginLeft) || this.options.defaultIndentLevel;
                            return indent;
                        },
                        renderHTML: attributes => {
                            if (!attributes.indent || attributes.indent === 0) {
                                return {};
                            }
                            return {
                                style: `margin-left: ${attributes.indent}px`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            indent: () => ({ tr, state, dispatch }) => {
                const { selection } = state;
                const { from, to } = selection;

                tr.doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0;
                        const indentLevelIndex = this.options.indentLevels.indexOf(currentIndent);

                        if (indentLevelIndex < this.options.indentLevels.length - 1) {
                            const nextIndent = this.options.indentLevels[indentLevelIndex + 1];
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                indent: nextIndent,
                            });
                        }
                    }
                });

                return true;
            },
            outdent: () => ({ tr, state, dispatch }) => {
                const { selection } = state;
                const { from, to } = selection;

                tr.doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const currentIndent = node.attrs.indent || 0;
                        const indentLevelIndex = this.options.indentLevels.indexOf(currentIndent);

                        if (indentLevelIndex > 0) {
                            const prevIndent = this.options.indentLevels[indentLevelIndex - 1];
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                indent: prevIndent,
                            });
                        }
                    }
                });

                return true;
            },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Tab': () => this.editor.commands.indent(),
            'Shift-Tab': () => this.editor.commands.outdent(),
        };
    },
});
