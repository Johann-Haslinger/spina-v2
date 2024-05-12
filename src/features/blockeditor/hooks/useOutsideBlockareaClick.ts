import { useEffect, useRef } from "react";
import { useCurrentBlockeditor } from "./useCurrentBlockeditor";
import { changeBlockeditorState } from "../functions/changeBlockeditorState";

export const useOutsideBlockareaClick = () => {
  const { blockeditorEntity, blockeditorState } = useCurrentBlockeditor();
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);
  const addBlockAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      if (blocksAreaRef.current && !blocksAreaRef.current.contains(event.target as Node) && blockeditorState !== "view") {
        changeBlockeditorState(blockeditorEntity, "view");
      }
      if (addBlockAreaRef.current && addBlockAreaRef.current.contains(event.target as Node)) {
        // TODO: Implement add block functionality
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [blocksAreaRef.current, addBlockAreaRef.current]);

  return { blocksAreaRef, addBlockAreaRef };
};
