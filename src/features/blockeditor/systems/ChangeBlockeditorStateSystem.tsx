import { useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { DataTypes } from "../../../base/enums";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { changeBlockeditorState } from "../functions/changeBlockeditorState";

const ChangeBlockeditorStateSystem = () => {
  const [selectedBlockEntities] = useEntities(
    (e) => e.has(Tags.SELECTED) && e.has(DataTypes.BLOCK),
  );
  const { blockeditorEntity } = useCurrentBlockeditor();

  useEffect(() => {
    if (selectedBlockEntities.length === 0) {
      changeBlockeditorState(blockeditorEntity, "view");
    } else {
      changeBlockeditorState(blockeditorEntity, "edit");
    }
  }, [selectedBlockEntities.length]);

  return null;
};

export default ChangeBlockeditorStateSystem;
