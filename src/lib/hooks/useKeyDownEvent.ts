import { MutableRefObject, useCallback, useLayoutEffect } from 'react';

export const useKeyDownEvent = (
  elementRef: MutableRefObject<HTMLElement | null>,
  key: string,
  handler: () => void
): void => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case key:
          handler();
          break;
      }
    },
    [handler, key]
  );

  useLayoutEffect((): (() => void) | undefined => {
    const element = elementRef.current;

    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return (): void => element.removeEventListener('keydown', handleKeyDown);
    }

    return;
  }, [elementRef, handleKeyDown]);
};
