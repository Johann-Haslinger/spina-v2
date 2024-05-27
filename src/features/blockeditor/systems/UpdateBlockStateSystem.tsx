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
    }
  }, [blockeditorState]);

  return null;
};

export default UpdateBlockStateSystem;
