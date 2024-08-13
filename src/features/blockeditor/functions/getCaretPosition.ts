import { RefObject } from 'react';

export const getCaretPosition = (texteditorRef: RefObject<HTMLDivElement>) => {
  if (texteditorRef.current) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(texteditorRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const caretOffset = preSelectionRange.toString().length;
      return caretOffset;
    }
  }
  return -1;
};
