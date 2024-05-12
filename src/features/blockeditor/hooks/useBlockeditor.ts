import { useEntity } from "@leanscope/ecs-engine";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";
import { IdentifierFacet } from "@leanscope/ecs-models";

export const useBlockeditor = () => {
  const [blockeditorEntity] = useEntity((e) => e.has(BlockeditorStateFacet));

  const blockeditorState = blockeditorEntity?.get(BlockeditorStateFacet)?.props.blockeditorState;
  const blockeditorId = blockeditorEntity?.get(IdentifierFacet)?.props.guid;

  return { blockeditorState, blockeditorEntity, blockeditorId };
};
