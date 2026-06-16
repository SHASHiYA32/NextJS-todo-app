import { useCallback, useState } from "react";

export interface DragItemPosition {
  x: number;
  y: number;
}

export interface UseDragAndDropOptions {
  onDragStart?: (e: React.PointerEvent | React.TouchEvent) => void;
  onDragEnd?: (position: DragItemPosition) => void;
  holdDelay?: number;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const { onDragStart, onDragEnd, holdDelay = 300 } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<DragItemPosition>({ x: 0, y: 0 });
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setStartPos({ x, y });

      const timeout = setTimeout(() => {
        setIsDragging(true);
        onDragStart?.(e);
      }, holdDelay);

      setHoldTimeout(timeout);
    },
    [holdDelay, onDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      setStartPos({ x: touch.clientX, y: touch.clientY });

      const timeout = setTimeout(() => {
        setIsDragging(true);
        onDragStart?.(e);
      }, holdDelay);

      setHoldTimeout(timeout);
    },
    [holdDelay, onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        e.preventDefault?.();
      }
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        e.preventDefault();
      }
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.({
          x: e.clientX,
          y: e.clientY,
        });
      }
      setStartPos({ x: 0, y: 0 });
    },
    [isDragging, holdTimeout, onDragEnd]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (isDragging) {
        setIsDragging(false);
        const touch = e.changedTouches[0];
        onDragEnd?.({
          x: touch.clientX,
          y: touch.clientY,
        });
      }
      setStartPos({ x: 0, y: 0 });
    },
    [isDragging, holdTimeout, onDragEnd]
  );

  return {
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onTouchStart: handleTouchStart,
      onPointerMove: handlePointerMove,
      onTouchMove: handleTouchMove,
      onPointerUp: handlePointerUp,
      onTouchEnd: handleTouchEnd,
    },
  };
}
