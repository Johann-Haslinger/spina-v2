import { useEffect } from "react";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { useBlockEntities } from "../hooks/useBlockEntities";
import { Tags } from "@leanscope/ecs-models";

const UpdateBlockStateSystem = () => {
  const { blockeditorState, blockeditorEntity } = useCurrentBlockeditor();
  const { blockEntities } = useBlockEntities(blockeditorEntity);

  useEffect(() => {
    if (blockeditorState == "view" || blockeditorState == "create") {
      blockEntities.forEach((entity) => entity.remove(Tags.SELECTED));
      // blockEntities.filter((e) => e.has(AdditionalTags.FOCUSED)).forEach((entity) => entity.remove(AdditionalTags.FOCUSED));
    }
  }, [blockeditorState]);

  return null;
};

export default UpdateBlockStateSystem;
