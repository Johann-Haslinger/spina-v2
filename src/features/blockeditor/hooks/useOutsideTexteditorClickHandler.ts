import { Entity } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { useEffect, useRef } from "react";
import { AdditionalTags } from "../../../base/enums";

export const useTexteditorRef = (entity: Entity) => {
  const isFocused = useEntityHasTags(entity, AdditionalTags.FOCUSED);
  const texteditorRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (texteditorRef.current && !texteditorRef.current.contains(e.target as Node)) {
      texteditorRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 

  useEffect(() => {
    if (isFocused) {
      if (texteditorRef.current) {
        texteditorRef.current.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
          range.selectNodeContents(texteditorRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } else {
      if (texteditorRef.current) {
        texteditorRef.current.blur();
      }
    }
  }, [isFocused]);

  return { texteditorRef };
};
