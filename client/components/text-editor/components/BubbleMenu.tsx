import { BubbleMenuPlugin, BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import React, { useEffect, useRef, useState } from 'react';

type BubbleMenuProps = Omit<BubbleMenuPluginProps, 'element'> & {
    className?: string;
    children: React.ReactNode;
};

export const BubbleMenu = (props: BubbleMenuProps) => {
    const [element, setElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!element) {
            return;
        }

        if (props.editor.isDestroyed) {
            return;
        }

        const { pluginKey = 'bubbleMenu' } = props;

        const plugin = BubbleMenuPlugin({
            pluginKey,
            editor: props.editor,
            element,
            shouldShow: props.shouldShow,
        });

        props.editor.registerPlugin(plugin);

        return () => {
            props.editor.unregisterPlugin(pluginKey);
        };
    }, [props.editor, element, props.shouldShow]);

    return (
        <div ref={setElement} className={props.className} style={{ visibility: 'hidden' }}>
            {props.children}
        </div>
    );
};
