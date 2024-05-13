import { useContext, useEffect } from "react";
import { useMockupData } from "../../../hooks/useMockupData";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { dummyBlocks } from "../../../base/dummy";
import { Entity } from "@leanscope/ecs-engine";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";
import {  DataTypes } from "../../../base/enums";

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
        const blocks = mockupData ? dummyBlocks : shouldFetchFromSupabase ? await fetchBlocks(blockeditorId) : [];

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
            newBlockEntity.add(DataTypes.BLOCK);
            console.log(newBlockEntity);
          }
        });
      }
    };

    loadBlocks();
  }, [mockupData, shouldFetchFromSupabase, blockeditorId]);

  return null;
};

export default LoadBlocksSystem;
