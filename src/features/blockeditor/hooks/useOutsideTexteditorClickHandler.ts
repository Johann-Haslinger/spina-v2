import { Entity } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { useEffect, useRef } from "react";
import { AdditionalTags } from "../../../base/enums";

export const useTexteditorRef = (entity: Entity) => {
  const [isFocused] = useEntityHasTags(entity, AdditionalTags.FOCUSED);
  const texteditorRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (texteditorRef.current && !texteditorRef.current.contains(e.target as Node)) {
      texteditorRef.current.blur();
      entity.remove(AdditionalTags.FOCUSED);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const texteditor = texteditorRef.current;
    if (texteditor) {
      if (isFocused) {
        setTimeout(() => {
          texteditor.focus();
          const range = document.createRange();
          const selection = window.getSelection();
          if (selection) {
            range.selectNodeContents(texteditor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 1);
      } else {
        texteditor.blur();
      }
    }
  }, [isFocused]);

  return { texteditorRef };
};
