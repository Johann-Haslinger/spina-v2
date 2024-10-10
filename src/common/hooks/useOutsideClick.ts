import { RefObject, useEffect } from 'react';

export const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback, isActive]);
};
