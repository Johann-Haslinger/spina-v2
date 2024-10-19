import { RefObject, useEffect } from 'react';

export const useInputFocus = (
  inputRef: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>,
  isFocused: boolean,
) => {
  useEffect(() => {
    if (!isFocused) return;

    const timeoutId = setTimeout(() => inputRef.current?.focus(), 10);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFocused, inputRef]);
};
