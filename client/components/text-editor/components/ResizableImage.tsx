import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useCallback, useEffect, useState, useRef } from 'react';

export const ResizableImage = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props;
    const [width, setWidth] = useState<string | number>(node.attrs.width || '100%');
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

    useEffect(() => {
        setWidth(node.attrs.width || '100%');
    }, [node.attrs.width]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!imageRef.current) return;

        setIsResizing(true);
        resizeRef.current = {
            startX: e.clientX,
            startWidth: imageRef.current.offsetWidth,
        };

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!resizeRef.current) return;

            const currentX = moveEvent.clientX;
            const diffX = currentX - resizeRef.current.startX;
            const newWidth = Math.max(100, resizeRef.current.startWidth + diffX); // Min width 100px

            // Update local state for smooth feedback
            setWidth(newWidth);
        };

        const onMouseUp = (upEvent: MouseEvent) => {
            if (!resizeRef.current) return;

            // Final update to node attributes
            const currentX = upEvent.clientX;
            const diffX = currentX - resizeRef.current.startX;
            const newWidth = Math.max(100, Math.round(resizeRef.current.startWidth + diffX));

            updateAttributes({ width: newWidth });
            setIsResizing(false);
            resizeRef.current = null;

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [updateAttributes]);

    return (
        <NodeViewWrapper className="inline-block relative leading-none">
            <div className={`relative inline-block group ${selected || isResizing ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
                {/* Image */}
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    style={{
                        width: typeof width === 'number' ? `${width}px` : width,
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block', // prevent extra space
                    }}
                    className={`rounded-lg transition-shadow ${isResizing ? 'cursor-col-resize' : ''}`}
                />

                {/* Resize Handle (Bottom Right) */}
                {(selected || isResizing) && (
                    <div
                        onMouseDown={handleMouseDown}
                        className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ew-resize shadow-md z-10 hover:scale-110 transition-transform"
                        title="Drag to resize"
                    />
                )}

                {/* Overlay to show size during resize */}
                {isResizing && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {typeof width === 'number' ? Math.round(width) : '100%'}px
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};
