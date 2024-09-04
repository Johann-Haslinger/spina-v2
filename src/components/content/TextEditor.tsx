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

const TextEditor = (props: {
  onBlur?: (newValue: string) => void;
  value?: string;
  placeholder?: string;
  saveSelection?: () => void;
}) => {
  const { onBlur, value, placeholder, saveSelection } = props;
  const textEditorRef = useRef<HTMLDivElement>(null);
  const sanitizer = dompurify.sanitize;
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);
  const isPlaceholderVisible = !value && textEditorRef.current?.innerHTML == '' && !isTextEditorFocused;

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
  }, [textEditorRef.current?.innerHTML, onBlur]);

  const handleFocus = () => {
    setIsTextEditorFocused(true);
    setTimeout(() => textEditorRef.current?.focus(), 10);
  };

  const handleBlur = () => {
    onBlur && textEditorRef.current && onBlur(textEditorRef.current.innerHTML);
    setIsTextEditorFocused(false);
  };

  useEffect(() => {
    if (value) setIsTextEditorFocused(true);
  }, [value]);

  return (
    <div onClick={handleFocus}>
      {isPlaceholderVisible && <StyledPlaceholder onClick={handleFocus}>{placeholder}</StyledPlaceholder>}

      <StyledTextEditorWrapper
        isHidden={isPlaceholderVisible}
        onFocus={(e) => value == '' && e.preventDefault()}
        ref={textEditorRef}
        contentEditable
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: sanitizer(value || '') }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
      />
    </div>
  );
};

export default TextEditor;
