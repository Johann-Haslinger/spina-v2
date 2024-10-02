import { RefObject, useEffect } from 'react';

export const useInputFocus = (
  inputRef: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>,
  isFocused: boolean,
) => {
  useEffect(() => {
    console.log('useInputFocus', isFocused, inputRef);
    if (!isFocused) return;

    console.log('useInputFocus', isFocused);
    const timeoutId = setTimeout(() => inputRef.current?.focus(), 10);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFocused, inputRef]);
};
