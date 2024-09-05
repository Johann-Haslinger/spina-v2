import styled from '@emotion/styled';
import dompurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';

const StyledTextEditorWrapper = styled.div<{ isHidden: boolean }>`
  ${tw`w-full dark:text-primaryTextDark transition-all outline-none pb-20 h-full`}
  ${({ isHidden }) => isHidden && tw`hidden`}
`;

const StyledPlaceholder = styled.div`
  ${tw`text-seconderyText opacity-70`}
`;

const TextEditor = (props: { onBlur?: (newValue: string) => void; value?: string; placeholder?: string }) => {
  const { onBlur, value, placeholder } = props;
  const textEditorRef = useRef<HTMLDivElement>(null);
  const sanitizer = dompurify.sanitize;
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);

  const initialText = useInitialText(value);
  const isPlaceholderVisible = textEditorRef.current?.innerHTML === '' && !isTextEditorFocused;

  useBeforeUnload(textEditorRef, onBlur);

  useEffect(() => {
    if (initialText) setIsTextEditorFocused(true);
  }, [initialText]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pastedData;

    const removeInlineStyles = (element: HTMLElement) => {
      element.style.fontFamily = 'system-ui';
      element.style.fontSize = '16px';
      element.style.backgroundColor = 'transparent';
      element.style.color = 'inherit';

      for (const child of Array.from(element.children)) {
        if (child instanceof HTMLElement) {
          removeInlineStyles(child);
        }
      }
    };

    removeInlineStyles(tempDiv);

    const cleanedHtml = tempDiv.innerHTML;
    document.execCommand('insertHTML', false, cleanedHtml);
  };

  const handleFocus = () => {
    setIsTextEditorFocused(true);
    setTimeout(() => textEditorRef.current?.focus(), 10);
  };

  const handleBlur = () => {
    setTimeout(() => onBlur && textEditorRef.current && onBlur(textEditorRef.current.innerHTML), 100);
  };

  return (
    <div onClick={handleFocus}>
      {isPlaceholderVisible && <StyledPlaceholder onClick={handleFocus}>{placeholder}</StyledPlaceholder>}

      <StyledTextEditorWrapper
        suppressContentEditableWarning={true}
        isHidden={isPlaceholderVisible}
        onFocus={(e) => initialText === '' && e.preventDefault()}
        ref={textEditorRef}
        contentEditable
        onBlur={handleBlur}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: sanitizer(initialText || '') }}
      />
    </div>
  );
};

// Custom Hooks

const useBeforeUnload = (textEditorRef: React.RefObject<HTMLDivElement>, onBlur?: (newValue: string) => void) => {
  useEffect(() => {
    const handleUnload = () => {
      if (onBlur && textEditorRef.current) {
        onBlur(textEditorRef.current.innerHTML);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [onBlur, textEditorRef]);
};

const useInitialText = (value?: string) => {
  const [initialText, setInitialText] = useState('');

  useEffect(() => {
    if (value) {
      setInitialText(value);
    }
  }, [value]);

  return initialText;
};

export default TextEditor;
