import { EntityProps } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { Tags } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { TexttypeFacet } from "../../../app/additionalFacets";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { Texttypes } from "../../../base/enums";

const HandleTexteditorKeyPressSystem = (props: EntityProps) => {
  const { entity } = props;
  const [isPressed] = useEntityHasTags(entity, Tags.SELECTED);
  const textType = entity.get(TexttypeFacet)?.props.texttype;
  const { blockeditorState } = useCurrentBlockeditor();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (blockeditorState === "edit" && isPressed) {
        e.preventDefault();
        switch (e.key) {
          case "b":
            entity.add(new TexttypeFacet({ texttype: textType === Texttypes.BOLD ? Texttypes.NORMAL : Texttypes.BOLD }));
            break;
          case "u":
            entity.add(new TexttypeFacet({ texttype: textType === Texttypes.UNDERLINE ? Texttypes.NORMAL : Texttypes.UNDERLINE }));
            break;
          case "i":
            entity.add(new TexttypeFacet({ texttype: textType === Texttypes.ITALIC ? Texttypes.NORMAL : Texttypes.ITALIC }));
            break;
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isPressed, textType]);

  return null;
};

export default HandleTexteditorKeyPressSystem;
