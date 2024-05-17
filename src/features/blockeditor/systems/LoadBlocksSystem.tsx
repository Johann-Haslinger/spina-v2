import { useContext, useEffect } from "react";
import { useMockupData } from "../../../hooks/useMockupData";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { dummyBlocks } from "../../../base/dummy";
import { Entity } from "@leanscope/ecs-engine";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";
import { AdditionalTags, Blocktypes, DataTypes, Texttypes } from "../../../base/enums";
import { v4 } from "uuid";
import { addBlock } from "../functions/addBlock";

const fetchBlocks = async (blockeditorId: string) => {
  console.log(blockeditorId);

  return [];
};

const LoadBlocksSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { blockeditorId } = useCurrentBlockeditor();

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

        console.log("shouldFetchFromSupabase", shouldFetchFromSupabase);
        if (shouldFetchFromSupabase || (mockupData && blocks.length === 0)) {
          const newBlockEntity = new Entity();
          newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
          newBlockEntity.add(new ParentFacet({ parentId: blockeditorId }));
          newBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
          newBlockEntity.add(new TexttypeFacet({ texttype: Texttypes.NORMAL }));
          newBlockEntity.add(new FloatOrderFacet({ index: 1 }));
          newBlockEntity.add(DataTypes.BLOCK);
          newBlockEntity.add(AdditionalTags.FOCUSED);

          addBlock(lsc, newBlockEntity);
        }
      }
    };

    loadBlocks();
  }, [mockupData, shouldFetchFromSupabase, blockeditorId]);

  return null;
};

export default LoadBlocksSystem;
