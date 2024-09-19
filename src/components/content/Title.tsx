import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';

type Size = 'small' | 'medium' | 'large';

const StyledTextArea = styled.textarea<{ size: Size; placeholderStyle: boolean }>`
  ${tw`dark:text-white w-full bg-white bg-opacity-0 min-h-10 outline-none transition-all font-bold resize-none overflow-hidden`}
  ${({ size }) => size === 'small' && tw`text-2xl`}
  ${({ size }) => size === 'medium' && tw`text-3xl`}
  ${({ size }) => size === 'large' && tw`md:text-4xl text-3xl`}
  ${({ placeholderStyle }) =>
    placeholderStyle && tw`text-placeholder-text text-opacity-70 dark:text-placeholder-text-dark`}
`;

interface TitleProps {
  color?: string;
  size?: Size;
  editable?: boolean;
  onBlur?: (value: string) => void;
}

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
  children = '',
  size = 'medium',
  editable = false,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(children as string);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    if (children == '' || !children) {
      textAreaRef.current?.focus();
    }
  }, [children]);

  const handleBlur = () => {
    if (onBlur) {
      onBlur(text);
    }
    setIsFocused(false);
  };

  return editable ? (
    <StyledTextArea
      ref={textAreaRef}
      value={text}
      placeholder={'Titel'}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onFocus={() => setIsFocused(true)}
      placeholderStyle={!text && !isFocused}
      size={size}
      rows={1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
        }
      }}
    />
  ) : (
    <div tw="line-clamp-2 text-3xl font-bold">{children}</div>
  );
};

export default Title;
