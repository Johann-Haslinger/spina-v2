import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";
import { dummyBlocks } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import { useUserData } from "../../../hooks/useUserData";
import { useSelectedHomework } from "../../collection/hooks/useSelectedHomework";
import { useSelectedNote } from "../../collection/hooks/useSelectedNote";
import { useSelectedSubtopic } from "../../collection/hooks/useSelectedSubtopic";
import { addBlockEntitiesFromString } from "../functions/addBlockEntitiesFromString";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import supabaseClient from "../../../lib/supabase";

const fetchBlocks = async (blockeditorId: string) => {
  const { data: blocks, error } = await supabaseClient
    .from("blocks")
    .select("id, type, textType, content, order")
    .eq("parentId", blockeditorId);

  if (error) {
    console.error("Error fetching blocks:", error);
  }

  return blocks || [];
};

const LoadBlocksSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { blockeditorId } = useCurrentBlockeditor();
  const { selectedHomeworkText } = useSelectedHomework();
  const { selectedNoteText } = useSelectedNote();
  const { selectedSubtopicText } = useSelectedSubtopic();
  const { userId } = useUserData();

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
        if (resouceText) {
          await addBlockEntitiesFromString(lsc, resouceText, blockeditorId, userId);
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
            newBlockEntity.add(new BlocktypeFacet({ blocktype: block.type }));
            newBlockEntity.add(new TexttypeFacet({ texttype: block.textType }));
            newBlockEntity.add(new TextFacet({ text: block.content }));
            newBlockEntity.add(new FloatOrderFacet({ index: block.order || 0 }));
            newBlockEntity.add(DataTypes.BLOCK);
          }
        });
      }
    };

    if (blockeditorId) {
      loadBlocks();
    }
  }, [
    mockupData,
    shouldFetchFromSupabase,
    blockeditorId,
    selectedNoteText,
    selectedSubtopicText,
    selectedHomeworkText,
  ]);

  return null;
};

export default LoadBlocksSystem;
