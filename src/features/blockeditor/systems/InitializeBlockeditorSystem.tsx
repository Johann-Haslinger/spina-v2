import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";
import { AdditionalTags } from "../../../base/enums";

const InitializeBlockeditorSystem = (props: {
  blockeditorId: string;
  initinalOpen?: boolean;
  isGroupBlockeditor?: boolean;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorId, isGroupBlockeditor } = props;
  const [blockeditorEntities] = useEntities((e) => e.has(BlockeditorStateFacet));

  useEffect(() => {
    const initializeBlockeditor = async () => {
      blockeditorEntities.forEach((entity) => {
        lsc.engine.removeEntity(entity);
      });

      const newBlockeditorEntity = new Entity();
      lsc.engine.addEntity(newBlockeditorEntity);
      newBlockeditorEntity.add(new IdentifierFacet({ guid: blockeditorId }));
      newBlockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: "view" }));

      if (isGroupBlockeditor) {
        console.log("isGroupBlockeditor", isGroupBlockeditor);
        newBlockeditorEntity.add(AdditionalTags.GROUP_BLOCKEDITOR);
      }
      newBlockeditorEntity.add(Tags.CURRENT);
    };

    if (blockeditorId) {
      initializeBlockeditor();
    }
  }, [blockeditorId, isGroupBlockeditor]);

  return null;
};

export default InitializeBlockeditorSystem;
