import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Blocktypes, DataTypes, Texttypes } from "../../../base/enums";
import { v4 } from "uuid";
import { Entity } from "@leanscope/ecs-engine";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { BlocktypeFacet, TexttypeFacet } from "../../../app/additionalFacets";

export async function addBlockEntitiesFromString(
  lsc: ILeanScopeClient,
  htmlString: string,
  parentId: string,
  userId: string
) {
  // Entferne alle &nbsp; und unnötige Leerzeichen
  const sanitizedText = htmlString.replace(/style="([\s\S]*?)\"/gi, "");
  let cleanedHtmlString = sanitizedText
    .replace(/&nbsp;/g, " ")
    .replace(/<ol\s*>|<\/ol\s*>|<ul\s*>|<\/ul\s*>/g, "")
    .trim();

  // Teile den String anhand von <div> und <br> Tags
  let splitRegex = /<div>|<div\s*\/?>|<br\s*\/?>|<\/div>|<li>|<\/li>|<p>|<p\s*\/?>|<\/p>/g;

  let contentBlocks = cleanedHtmlString.split(splitRegex).filter((text) => text.trim() !== "");

  contentBlocks.forEach((content, index) => {
    let trimmedContent = content.trim();

    const isList = /^<li(\s|>)/.test(trimmedContent);
    const isBold = /^(<b(\s|>)|<strong(\s|>))/i.test(trimmedContent);

    let textType = isBold ? Texttypes.BOLD : Texttypes.NORMAL;

    let plainTextContent = trimmedContent.replace(/<[^>]+>/g, "");

    const newBlockEntity = new Entity();
    lsc.engine.addEntity(newBlockEntity);
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(new TextFacet({ text: plainTextContent }));
    newBlockEntity.add(new FloatOrderFacet({ index: index + 1 }));
    newBlockEntity.add(new TexttypeFacet({ texttype: textType }));
    newBlockEntity.add(new ParentFacet({ parentId: parentId }));
    newBlockEntity.add(new BlocktypeFacet({ blocktype: isList ? Blocktypes.LIST : Blocktypes.TEXT }));
    newBlockEntity.add(DataTypes.BLOCK);

    // TODO: Add block to database
  });

  console.log(userId)
}

// export const getStringFromBlockArray = (blocks: Block[]): string => {
//   const filteredBlocks = blocks.filter(
//     (block) => block.type === "text" || block.type === "list" || block.type === "todo"
//   ) as (TextBlock | ListBlock | TodoBlock)[];
//   const markdownString = filteredBlocks
//     .map((block) => {
//       if (block.type === "text") {
//         let textContent = block.content;
//         if (block.textType === TextTypes.BOLD) {
//           textContent = `**${textContent}**`;
//         }
//         return textContent;
//       } else if (block.type === "list") {
//         let listContent = `- ${block.content}`;
//         if (block.textType === TextTypes.BOLD) {
//           listContent = `**${listContent}**`;
//         }
//         return listContent;
//       } else if (block.type === "todo") {
//         let todoContent = `- [${block.isPressed ? "x" : " "}] ${block.content}`;
//         if (block.textType === TextTypes.BOLD) {
//           todoContent = `**${todoContent}**`;
//         }
//         return todoContent;
//       }
//     })
//     .join("\n");
//   return markdownString;
// };
