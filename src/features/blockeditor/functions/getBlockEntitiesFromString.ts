import { Entity } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { BlocktypeFacet, TexttypeFacet } from '../../../app/additionalFacets';
import { Blocktype, DataType, Texttype } from '../../../base/enums';

export const getBlockEntitiesFromText = (text: string, parentId: string): Entity[] => {
  const sanitizedText = text.replace(/style="([\s\S]*?)"/gi, '');
  const cleanedHtmlString = sanitizedText
    .replace(/&nbsp;/g, ' ')
    .replace(/<ol\s*>|<\/ol\s*>|<ul\s*>|<\/ul\s*>/g, '')
    .trim();

  const splitRegex = /<div>|<div\s*\/?>|<br\s*\/?>|<\/div>|<li>|<\/li>|<p>|<p\s*\/?>|<\/p>/g;

  const contentBlocks = cleanedHtmlString.split(splitRegex).filter((text) => text.trim() !== '');

  const blockEntities = contentBlocks.map((content, index) => {
    const trimmedContent = content.trim();

    const isList = /^<li(\s|>)/.test(trimmedContent);
    const isBold = /^(<b(\s|>).*<\/b(\s|>)|<strong(\s|>).*<\/strong(\s|>))/i.test(trimmedContent);

    const textType = isBold ? Texttype.BOLD : Texttype.NORMAL;

    const newBlockEntity = new Entity();
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(new TextFacet({ text: trimmedContent }));
    newBlockEntity.add(new FloatOrderFacet({ index: index + 1 }));
    newBlockEntity.add(new TexttypeFacet({ texttype: textType }));
    newBlockEntity.add(new ParentFacet({ parentId: parentId }));
    newBlockEntity.add(
      new BlocktypeFacet({
        blocktype: isList ? Blocktype.LIST : Blocktype.TEXT,
      }),
    );
    newBlockEntity.add(DataType.BLOCK);

    return newBlockEntity;
  });

  return blockEntities;
};
