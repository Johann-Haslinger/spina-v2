import { useEntity } from "@leanscope/ecs-engine";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";
import { IdentifierFacet } from "@leanscope/ecs-models";

export const useCurrentBlockeditor = () => {
  // const [currentBlockeditorEntity] = useEntity((e) => e.has(BlockeditorStateFacet) && e.has(Tags.CURRENT));
  // const [blockeditorId, setBlockeditorId] = useState<string>("");
  // const [blockeditorState, setBlockeditorState] = useState<string>("view");

  // useEffect(() => {
  //   if (currentBlockeditorEntity) {
  //     setBlockeditorState(currentBlockeditorEntity.get(BlockeditorStateFacet)?.props.blockeditorState || "view");
  //     setBlockeditorId(currentBlockeditorEntity.get(IdentifierFacet)?.props.guid || "");
  //   }
  // }, [currentBlockeditorEntity?.get(IdentifierFacet)?.props.guid, currentBlockeditorEntity?.get(BlockeditorStateFacet)?.props.blockeditorState]);

  const [currentBlockeditorEntity] = useEntity((e) => e.has(BlockeditorStateFacet));
  const blockeditorId = currentBlockeditorEntity?.get(IdentifierFacet)?.props.guid || "";
  const blockeditorState = currentBlockeditorEntity?.get(BlockeditorStateFacet)?.props.blockeditorState || "view";

  return { blockeditorState, blockeditorEntity: currentBlockeditorEntity, blockeditorId };
};
