import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import tw from "twin.macro";

const StyledTextEditorWrapper = styled.div`
  ${tw`w-full dark:text-primaryTextDark transition-all outline-none pb-20 h-full`}
`;

const TextEditor = (props: { onBlur?: (newValue: string) => void; value?: string }) => {
  const { onBlur, value } = props;
  const textEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUnload = () => {
      if (onBlur && textEditorRef.current) {
        onBlur(textEditorRef.current.innerHTML);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [textEditorRef.current?.innerHTML, onBlur]);

  return (
    <StyledTextEditorWrapper
      ref={textEditorRef}
      contentEditable="plaintext-only"
      onBlur={() => onBlur && textEditorRef.current && onBlur(textEditorRef.current.innerHTML)}
      dangerouslySetInnerHTML={{ __html: value || "" }}
    />
  );
};

export default TextEditor;
