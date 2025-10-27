import { useState, useEffect, useCallback, RefObject } from 'react';

interface TooltipPosition {
  x: number;
  y: number;
}

export const useTooltip = (elementRef: RefObject<HTMLElement>, title: string) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const isInStatusBar = elementRef.current.closest('#status-bar');

    if (isInStatusBar) {
      // Position above status bar
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    } else {
      // Position to the right of activity bar
      setPosition({
        x: 72, // 4.5rem
        y: rect.top + rect.height / 2,
      });
    }

    setIsVisible(true);
  }, [elementRef]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !title) return;

    element.addEventListener('mouseenter', handleMouseEnter as EventListener);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, title, handleMouseEnter, handleMouseLeave]);

  return { isVisible, position, title };
};

