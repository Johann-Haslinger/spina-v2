import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import tw from "twin.macro";

const StyledTextEditorWrapper = styled.div`
  ${tw`w-full dark:text-primaryTextDark transition-all outline-none pb-20 h-full`}
`;

const TextEditor = (props: {
  onBlur?: (newValue: string) => void;
  value?: string;
}) => {
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
  

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (onBlur && textEditorRef.current) {
        console.log("Saving content",  textEditorRef.current.innerHTML);
        onBlur(textEditorRef.current.innerHTML);
      }
    }, 30000); 

    return () => clearInterval(saveInterval);
  }, [onBlur]);

  return (
    <StyledTextEditorWrapper
      ref={textEditorRef}
      onBlur={(e) => onBlur && onBlur(e.currentTarget.innerHTML)}
      dangerouslySetInnerHTML={{ __html: value || "No Content Added" }}
      contentEditable
    />
  );
};

export default TextEditor;
