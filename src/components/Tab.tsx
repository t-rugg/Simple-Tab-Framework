import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDragLayer } from 'react-dnd';
import { TabDropdown } from './TabDropdown';

interface DragItem {
    id: string;
    groupId: string;
    index: number;
    type: string;
}

interface TabProps {
    id: string;
    groupId: string;
    index: number;
    title: string;
    isActive: boolean;
    onClose: () => void;
    onMove: (sourceGroupId: string, dragIndex: number, targetGroupId: string, hoverIndex: number) => void;
    onSplit: () => void;
    showEmoji?: boolean;
    emoji?: string;
    onSelect: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    totalTabCount: number;
    setViewRatio: (ratio: number) => void;
    isRemoving?: boolean;
}

export const Tab: React.FC<TabProps> = ({
    id,
    groupId,
    index,
    title,
    isActive,
    onClose,
    onMove,
    onSplit,
    showEmoji = false,
    emoji = '',
    onSelect,
    totalTabCount,
    setViewRatio,
    isRemoving = false
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dragLayer = useDragLayer(monitor => ({
        isDragging: monitor.isDragging(),
        clientOffset: monitor.getClientOffset()
    }));

    useEffect(() => {
        const handleGlobalContextMenu = (e: MouseEvent) => {
            if (isDropdownOpen) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener('contextmenu', handleGlobalContextMenu, true);
        return () => {
            document.removeEventListener('contextmenu', handleGlobalContextMenu, true);
        };
    }, [isDropdownOpen]);

    const [{ isDragging: isDraggingState }, drag, preview] = useDrag<DragItem, void, { isDragging: boolean }>({
        type: 'tab',
        item: { id, groupId, index, type: 'tab' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            console.log('Drag ended:', item);
            if (!monitor.didDrop()) {
                setIsDropdownOpen(false);
            }
        }
    }, [id, groupId, index]);

    // Use the preview ref for the drag preview
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    // Add a global drag monitor
    useEffect(() => {
        if (!isDraggingState) return;

        let animationFrameId: number;
        let hasTriggeredSplit = false;

        const checkDragPosition = () => {
            const clientOffset = dragLayer.clientOffset;
            if (!clientOffset) return;

            const mouseX = clientOffset.x;
            const windowWidth = window.innerWidth;
            const rightEdgeThreshold = windowWidth * 0.7;
            const isNearRightEdge = mouseX > rightEdgeThreshold;
            const mousePercentage = ((mouseX / windowWidth) * 100).toFixed(1);

            // Only trigger split once when first crossing the threshold
            if (isNearRightEdge && !hasTriggeredSplit) {
                console.log('Triggering split view - first time crossing threshold');
                hasTriggeredSplit = true;
                onSplit();
            }

            console.log('Global drag:', {
                mouseX,
                windowWidth,
                rightEdgeThreshold,
                isNearRightEdge,
                hasTriggeredSplit,
                mousePercentage: `${mousePercentage}%`
            });

            animationFrameId = requestAnimationFrame(checkDragPosition);
        };

        animationFrameId = requestAnimationFrame(checkDragPosition);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            hasTriggeredSplit = false;
        };
    }, [isDraggingState, onSplit, dragLayer]);

    const [, drop] = useDrop<DragItem, void, { isOver: boolean }>({
        accept: 'tab',
        collect: (monitor) => ({
            isOver: monitor.isOver()
        }),
        hover: (item, monitor) => {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceGroupId = item.groupId;
            const targetGroupId = groupId;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex && sourceGroupId === targetGroupId) return;

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            if (!hoverBoundingRect) return;

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            // Time to actually perform the action
            onMove(sourceGroupId, dragIndex, targetGroupId, hoverIndex);

            // Update the index for the dragged item
            item.index = hoverIndex;
            item.groupId = targetGroupId;
        },
        drop: (item) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceGroupId = item.groupId;
            const targetGroupId = groupId;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex && sourceGroupId === targetGroupId) return;

            // Time to actually perform the action
            onMove(sourceGroupId, dragIndex, targetGroupId, hoverIndex);
        }
    }, [id, groupId, index, onMove]);

    // Combine the drag and drop refs
    drag(drop(ref));

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownPosition({ x: e.clientX, y: e.clientY });
        setIsDropdownOpen(true);
    };

    const handleCloseTab = () => {
        onClose();
        setIsDropdownOpen(false);
    };

    const handleChangeView = () => {
        console.log('Change view called with groupId:', groupId);
        // Find the other group's ID
        const otherGroupId = groupId === "1" ? "2" : "1";
        console.log('Moving to otherGroupId:', otherGroupId);
        // Move the tab to the end of the other group
        onMove(groupId, index, otherGroupId, 999);
        // Set view ratio to 50-50 split
        if (totalTabCount === 1) {
            setViewRatio(0.5);
        }
        setIsDropdownOpen(false);
    };

    return (
        <>
            <div
                ref={ref}
                className={`tab ${isActive ? 'active' : ''} ${isDraggingState ? 'dragging' : ''} ${isRemoving ? 'removing' : ''}`}
                onContextMenu={handleContextMenu}
                onClick={onSelect}
            >
                <span className={`tab-emoji ${!showEmoji ? 'hidden' : ''}`}>{emoji}</span>
                <div className="tab-title">
                    {title}
                </div>
                <button
                    className="close-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab();
                    }}
                >
                    ×
                </button>
            </div>
            <TabDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onCloseTab={handleCloseTab}
                onChangeView={handleChangeView}
                position={dropdownPosition}
                showChangeView={totalTabCount > 1}
            />
        </>
    );
};    