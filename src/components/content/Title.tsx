import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { PropsWithChildren, useRef, useState } from "react";
import tw from "twin.macro";

type size = "small" | "medium" | "large";

const StyledTitle = styled.div<{ size: size; placeholderStyle: boolean }>`
  ${tw` line-clamp-2 dark:text-white min-h-10 outline-none text-primatyText font-extrabold`}
  ${({ size }) => size === "small" && tw`text-2xl`}
  ${({ size }) => size === "medium" && tw`text-3xl`}
  ${({ size }) => size === "large" && tw`text-4xl`}
  ${({ placeholderStyle }) =>
    placeholderStyle &&
    tw`text-placeholderText text-opacity-70 dark:text-placeholderTextDark `}
`;

interface TitleProps {
  color?: string;
  size?: size;
  editable?: boolean;
  onBlur?: (value: string) => void;
}

const Title = (props: PropsWithChildren & TitleProps) => {
  const { color, children, size = "medium", editable, onBlur } = props;
  const [isFocused, setIsFocused] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!children && !isFocused && titleRef.current) {
      titleRef.current.textContent = "Title";
    } else if (!children && isFocused && titleRef.current) {
      titleRef.current.textContent = "";
    } else if (children && titleRef.current) {
      titleRef.current.textContent = children as string;
    }
  }, [children, isFocused]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = titleRef.current.innerText;
    }
  }, [titleRef.current?.innerHTML]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    onBlur && onBlur(e.currentTarget.textContent || "");
    setIsFocused(false);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html")
      ? e.clipboardData.getData("text/html")
      : e.clipboardData.getData("text/plain");

    if (titleRef.current) {
      titleRef.current.textContent = titleRef.current.textContent + text;
    }
  };

  return (
    <StyledTitle
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.metaKey) {
          e.preventDefault();
        }
      }}
      onPaste={(e) => handlePaste(e)}
      onClick={() => setIsFocused(true)}
      ref={titleRef}
      placeholderStyle={!children && !isFocused}
      contentEditable={editable}
      onBlur={handleBlur}
      size={size}
      style={{
        color: color,
      }}
    />
  );
};

export default Title;
