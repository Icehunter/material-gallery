import { MutableRefObject, useCallback, useLayoutEffect, useState } from 'react';

const getPrevElement = (list: Element[]): HTMLElement | null => {
  const sibling = list[0].previousElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
};

const getNextElement = (list: Element[]): HTMLElement | null => {
  const sibling = list[list.length - 1].nextElementSibling;

  if (sibling instanceof HTMLElement) {
    return sibling;
  }

  return null;
};

export type useHorizontalScrollPositionResult = {
  scrollToElement: (element: Element | null) => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollPageRight: () => void;
  scrollPageLeft: () => void;
};

export const useHorizontalScrollPosition = (
  containerRef: MutableRefObject<HTMLDivElement | null>
): useHorizontalScrollPositionResult => {
  const [prevElement, setPrevElement] = useState<HTMLElement | null>(null);
  const [nextElement, setNextElement] = useState<HTMLElement | null>(null);

  useLayoutEffect((): (() => void) | undefined => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const update = (): void => {
      const rect = container.getBoundingClientRect();

      const visibleElements = Array.from(container.children).filter((child) => {
        const childRect = child.getBoundingClientRect();

        return childRect.left >= rect.left && childRect.right <= rect.right;
      });

      if (visibleElements.length > 0) {
        setPrevElement(getPrevElement(visibleElements));
        setNextElement(getNextElement(visibleElements));
      }
    };

    update();

    container.addEventListener('scroll', update, { passive: true });
    return (): void => container.removeEventListener('scroll', update);
  }, [containerRef]);

  const scrollToElement = useCallback(
    (element) => {
      const container = containerRef.current;

      if (!container || !element) {
        return;
      }

      const leftScrollPosition =
        element.offsetLeft + element.getBoundingClientRect().width / 2 - container.getBoundingClientRect().width / 2;

      container.scroll({
        left: leftScrollPosition,
        behavior: 'smooth'
      });
    },
    [containerRef]
  );

  const scrollPageRight = useCallback(() => scrollToElement(nextElement), [scrollToElement, nextElement]);

  const scrollPageLeft = useCallback(() => scrollToElement(prevElement), [scrollToElement, prevElement]);

  return {
    scrollToElement,
    canScrollLeft: prevElement !== null,
    canScrollRight: nextElement !== null,
    scrollPageRight,
    scrollPageLeft
  };
};
