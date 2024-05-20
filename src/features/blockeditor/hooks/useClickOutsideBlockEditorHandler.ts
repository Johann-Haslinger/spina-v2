import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { FloatOrderFacet, IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect, useRef } from "react";
import { v4 } from "uuid";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";
import { AdditionalTags, Blocktypes, DataTypes, Texttypes } from "../../../base/enums";
import { useUserData } from "../../../hooks/useUserData";
import { addBlock } from "../functions/addBlock";
import { changeBlockeditorState } from "../functions/changeBlockeditorState";
import { getHighestOrder } from "../functions/orderHelper";
import { useCurrentBlockeditor } from "./useCurrentBlockeditor";

export const useClickOutsideBlockEditorHandler = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorEntity, blockeditorState, blockeditorId } = useCurrentBlockeditor();
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);
  const addBlockAreaRef = useRef<HTMLDivElement | null>(null);
  const { userId } = useUserData();

  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      if (
        blocksAreaRef.current &&
        !blocksAreaRef.current.contains(event.target as Node) &&
        blockeditorState !== "view"
      ) {
        changeBlockeditorState(blockeditorEntity, "view");
      }
      if (addBlockAreaRef.current && addBlockAreaRef.current.contains(event.target as Node)) {
        const newBlockEntity = new Entity();
        newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
        newBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
        newBlockEntity.add(new TexttypeFacet({ texttype: Texttypes.NORMAL }));
        newBlockEntity.add(new ParentFacet({ parentId: blockeditorId || "" }));
        newBlockEntity.add(new FloatOrderFacet({ index: (getHighestOrder(lsc, blockeditorId || "") || 0) + 1 }));
        newBlockEntity.add(AdditionalTags.FOCUSED);
        newBlockEntity.add(DataTypes.BLOCK);

        addBlock(lsc, newBlockEntity, userId);
        console.log("add block", newBlockEntity);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [blocksAreaRef.current, addBlockAreaRef.current, blockeditorState]);

  return { blocksAreaRef, addBlockAreaRef };
};
