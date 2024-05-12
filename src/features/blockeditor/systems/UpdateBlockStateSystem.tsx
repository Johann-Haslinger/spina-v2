import { useEffect } from "react";
import { useBlockeditor } from "../hooks/useBlockeditor";
import { useBlockEntities } from "../hooks/useBlockEntities";
import { Tags } from "@leanscope/ecs-models";

const UpdateBlockStateSystem = () => {
  const { blockeditorState, blockeditorEntity } = useBlockeditor();
  const { blockEntities } = useBlockEntities(blockeditorEntity);

  useEffect(() => {
    if (blockeditorState == "view" || blockeditorState == "create") {
      blockEntities.forEach((entity) => entity.remove(Tags.SELECTED));
    }
  }, [blockeditorState]);

  return null;
};

export default UpdateBlockStateSystem;
