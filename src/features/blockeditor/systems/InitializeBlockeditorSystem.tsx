import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";

const InitializeBlockeditorSystem = (props: { blockeditorId: string, initinalOpen?: boolean }) => {
  const { blockeditorId, initinalOpen} = props;
  const lsc = useContext(LeanScopeClientContext);
  const [blockeditorEntities] = useEntities((e) => e.has(BlockeditorStateFacet));

  useEffect(() => {
    const initializeBlockeditor = () => {
      blockeditorEntities.forEach((entity) => {
        lsc.engine.removeEntity(entity);
      });

      const newBlockeditor = new Entity();
      lsc.engine.addEntity(newBlockeditor);
      newBlockeditor.add(new IdentifierFacet({ guid: blockeditorId }));
      newBlockeditor.add(new BlockeditorStateFacet({ blockeditorState: "view" }));

      if (initinalOpen) {
        newBlockeditor.add(Tags.CURRENT);
      }
      
    };

    initializeBlockeditor();
  }, []);

  return null;
};

export default InitializeBlockeditorSystem;
