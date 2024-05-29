import { Entity } from "@leanscope/ecs-engine";
import { Blocktypes, DataTypes, Texttypes } from "../../../base/enums";
import { IdentifierFacet, TextFacet, FloatOrderFacet, ParentFacet } from "@leanscope/ecs-models";
import { TexttypeFacet, BlocktypeFacet } from "../../../app/additionalFacets";
import { v4 } from "uuid";

export const getBlockEntitiesFromText = (text: string, parentId: string): Entity[] => {
  const sanitizedText = text.replace(/style="([\s\S]*?)\"/gi, "");
  let cleanedHtmlString = sanitizedText
    .replace(/&nbsp;/g, " ")
    .replace(/<ol\s*>|<\/ol\s*>|<ul\s*>|<\/ul\s*>/g, "")
    .trim();

  let splitRegex = /<div>|<div\s*\/?>|<br\s*\/?>|<\/div>|<li>|<\/li>|<p>|<p\s*\/?>|<\/p>/g;

  let contentBlocks = cleanedHtmlString.split(splitRegex).filter((text) => text.trim() !== "");

  const blockEntities = contentBlocks.map((content, index) => {
    let trimmedContent = content.trim();

    const isList = /^<li(\s|>)/.test(trimmedContent);
    const isBold = /^(<b(\s|>).*<\/b(\s|>)|<strong(\s|>).*<\/strong(\s|>))/i.test(trimmedContent);

    let textType = isBold ? Texttypes.BOLD : Texttypes.NORMAL;

    const newBlockEntity = new Entity();
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(new TextFacet({ text: trimmedContent }));
    newBlockEntity.add(new FloatOrderFacet({ index: index + 1 }));
    newBlockEntity.add(new TexttypeFacet({ texttype: textType }));
    newBlockEntity.add(new ParentFacet({ parentId: parentId }));
    newBlockEntity.add(new BlocktypeFacet({ blocktype: isList ? Blocktypes.LIST : Blocktypes.TEXT }));
    newBlockEntity.add(DataTypes.BLOCK);

    return newBlockEntity;
  });

  return blockEntities;
};
