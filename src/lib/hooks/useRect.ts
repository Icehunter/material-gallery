import { MutableRefObject, useCallback, useLayoutEffect, useState } from 'react';

import { noop } from 'lib/utils';

export const useRect = (ref: MutableRefObject<HTMLDivElement | null>): DOMRect => {
  const [rect, setRect] = useState<DOMRect>(getRect(ref ? ref.current : null));

  const handleResize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    // Update client rect
    setRect(getRect(ref.current));
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    handleResize();

    if (typeof ResizeObserver === 'function') {
      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(element);

      return (): void => {
        if (!resizeObserver) {
          return;
        }

        resizeObserver.unobserve(element);
        resizeObserver.disconnect();
      };
    } else {
      // Browser support, remove freely
      window.addEventListener('resize', handleResize);

      return (): void => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize, ref]);

  return rect;
};

const getRect = (element: HTMLDivElement | null): DOMRect => {
  if (!element) {
    return {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      toJSON: noop
    };
  }

  return element.getBoundingClientRect();
};
