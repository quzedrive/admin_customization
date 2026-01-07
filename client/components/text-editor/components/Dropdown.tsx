import React, { useEffect, useRef, useState } from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement | null>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

export const Dropdown = ({
    trigger,
    children,
    isOpen,
    onClose,
    width = "w-56"
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    width?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    // We use invisible state to prevent flickering before positioning
    const [isPositioned, setIsPositioned] = useState(false);

    useClickOutside(ref, onClose);

    React.useLayoutEffect(() => {
        if (isOpen && contentRef.current && ref.current) {

            // Find parent editor container if it exists
            const editorContainer = ref.current.closest('.editor-container');
            const containerRect = editorContainer ? editorContainer.getBoundingClientRect() : null;

            // Use container width if available, otherwise viewport
            const boundaryWidth = containerRect ? containerRect.width : document.documentElement.clientWidth;
            const boundaryLeft = containerRect ? containerRect.left : 0;

            const PADDING = 10;

            const parentRect = ref.current.getBoundingClientRect(); // Button position
            const contentRect = contentRef.current.getBoundingClientRect(); // Dropdown dimensions

            // Relative calculations
            // We want to calculate 'left' relative to the parent button (ref.current)
            // But boundary checks are absolute or relative to container.

            let leftOffset = 0; // Default relative to parent button

            // --- CHECK RIGHT OVERFLOW ---
            // If the dropdown (starting at parent's left) exceeds the boundary's right edge
            // contentAbsRight = parentRect.left + contentWidth
            // boundaryAbsRight = boundaryLeft + boundaryWidth

            const contentAbsRight = parentRect.left + contentRect.width;
            const boundaryAbsRight = boundaryLeft + boundaryWidth - PADDING;

            if (contentAbsRight > boundaryAbsRight) {
                // It overflows right. Shift left.
                // We want newAbsRight = boundaryAbsRight
                // newAbsLeft + contentWidth = boundaryAbsRight
                // newAbsLeft = boundaryAbsRight - contentWidth

                // Translate to relative offset from button:
                // relativeLeft = newAbsLeft - parentRect.left
                leftOffset = (boundaryAbsRight - contentRect.width) - parentRect.left;
            }

            // --- CHECK LEFT OVERFLOW ---
            // After potential shift, check if it goes past the left boundary
            // newAbsLeft = parentRect.left + leftOffset
            // boundaryAbsLeft = boundaryLeft + PADDING

            const newAbsLeft = parentRect.left + leftOffset;
            const boundaryAbsLeft = boundaryLeft + PADDING;

            if (newAbsLeft < boundaryAbsLeft) {
                // It overflows left. Force it to start at boundaryLeft.
                // newAbsLeft = boundaryAbsLeft
                // relativeLeft = boundaryAbsLeft - parentRect.left
                leftOffset = boundaryAbsLeft - parentRect.left;
            }

            setMenuStyle({
                left: `${leftOffset}px`,
                right: 'auto',
                maxWidth: `${boundaryWidth - (PADDING * 2)}px` // Constrain width too
            });
            setIsPositioned(true);
        } else {
            setIsPositioned(false);
        }
    }, [isOpen]);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            // Re-trigger layout effect logically, or just duplicate generic check if needed.
            // For now, simpler to just close on resize or rely on next open. 
            // But to be robust:
            if (isOpen) {
                // Force re-render or duplicated logic. 
                // React layout effect dependency on isOpen handles mostly open. 
                // Changing window width doesn't trigger it.
                // We can force update.
                setMenuStyle((prev) => ({ ...prev })); // Dummy update?
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);


    return (
        <div className="relative inline-block text-left " ref={ref}>
            {trigger}
            {isOpen && (
                <div
                    ref={contentRef}
                    style={menuStyle}
                    className={`absolute mt-2 ${width} rounded-lg bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100 ${!isPositioned ? 'opacity-0' : 'opacity-100'}`}
                >
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};
