import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";

const InitializeBlockeditorSystem = (props: { blockeditorId: string; initinalOpen?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorId } = props;
  const [blockeditorEntities] = useEntities((e) => e.has(BlockeditorStateFacet));

  useEffect(() => {
    const initializeBlockeditor = async () => {
      blockeditorEntities.forEach((entity) => {
        lsc.engine.removeEntity(entity);
      });

      console.log("initializeBlockeditor", blockeditorId);
      const newBlockeditorEntity = new Entity();
      lsc.engine.addEntity(newBlockeditorEntity);
      newBlockeditorEntity.add(new IdentifierFacet({ guid: blockeditorId }));
      newBlockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: "view" }));
      newBlockeditorEntity.add(Tags.CURRENT);
    };

    if (blockeditorId) {
      initializeBlockeditor();
    }
  }, [blockeditorId]);

  return null;
};

export default InitializeBlockeditorSystem;
