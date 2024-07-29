import { Entity } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";
import {
  BlocktypeFacet,
  TexttypeFacet,
  TodoStateFacet,
} from "../../../app/additionalFacets";
import { Texttypes } from "../../../base/enums";

export const getStringFromBlockEntities = (
  blockEntities: readonly Entity[],
) => {
  const markdownString = blockEntities
    .map((bockEntity) => {
      const blockType = bockEntity.get(BlocktypeFacet)?.props.blocktype;
      const textType = bockEntity.get(TexttypeFacet)?.props.texttype;
      const text = bockEntity.get(TextFacet)?.props.text;
      const todoState = bockEntity.get(TodoStateFacet)?.props.todoState;

      if (blockType === "text") {
        let textContent = text;
        if (textType === Texttypes.BOLD) {
          textContent = `**${textContent}**`;
        }
        return textContent;
      } else if (blockType === "list") {
        let listContent = `- ${text}`;
        if (textType === Texttypes.BOLD) {
          listContent = `**${listContent}**`;
        }
        return listContent;
      } else if (blockType === "todo") {
        let todoContent = `- [${todoState == 2 ? "x" : " "}] ${text}`;
        if (textType === Texttypes.BOLD) {
          todoContent = `**${todoContent}**`;
        }
        return todoContent;
      }
    })
    .join("\n");

  return markdownString;
};
