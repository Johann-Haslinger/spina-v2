import { useContext, useEffect, useState } from "react";
import { useMockupData } from "../../../hooks/useMockupData";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { dummyBlocks } from "../../../base/dummy";
import { Entity } from "@leanscope/ecs-engine";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { useSelectedHomework } from "../../collection/hooks/useSelectedHomework";
import { useSelectedNote } from "../../collection/hooks/useSelectedNote";
import { useSelectedSubtopic } from "../../collection/hooks/useSelectedSubtopic";
import { addBlockEntitiesFromString } from "../functions/addBlockEntitiesFromString";
import { useUserData } from "../../../hooks/useUserData";

const fetchBlocks = async (blockeditorId: string) => {
  console.log(blockeditorId);

  return [];
};

const LoadBlocksSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { blockeditorId } = useCurrentBlockeditor();
  const { selectedHomeworkText } = useSelectedHomework();
  const { selectedNoteText } = useSelectedNote();
  const { selectedSubtopicText } = useSelectedSubtopic();
  const { userId } = useUserData();
  const [addedText, setAddedText] = useState(false);

  useEffect(() => {
    const loadBlocks = async () => {
      if (blockeditorId) {
        const blocks = mockupData
          ? blockeditorId == "1"
            ? dummyBlocks
            : []
          : shouldFetchFromSupabase
          ? await fetchBlocks(blockeditorId)
          : [];
        const resouceText = selectedSubtopicText || selectedHomeworkText || selectedNoteText;

        if (resouceText && !addedText) {
          await addBlockEntitiesFromString(lsc, resouceText, blockeditorId, userId);
          setAddedText(true);
      
          // TODO: Remove text add update to newNoteStatus in supabase
        }

        blocks.forEach((block) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === block.id && e.hasTag(DataTypes.BLOCK)
          );

          if (!isExisting) {
            const newBlockEntity = new Entity();
            lsc.engine.addEntity(newBlockEntity);
            newBlockEntity.add(new IdentifierFacet({ guid: block.id }));
            newBlockEntity.add(new ParentFacet({ parentId: blockeditorId }));
            newBlockEntity.add(new BlocktypeFacet({ blocktype: block.blockType }));
            newBlockEntity.add(new TexttypeFacet({ texttype: block.textType }));
            newBlockEntity.add(new TextFacet({ text: block.content }));
            newBlockEntity.add(new FloatOrderFacet({ index: block.order }));
            newBlockEntity.add(DataTypes.BLOCK);
          }
        });
      }
    };

    loadBlocks();
  }, [mockupData, shouldFetchFromSupabase, blockeditorId]);

  return null;
};

export default LoadBlocksSystem;
