import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { BlocktypeFacet, TexttypeFacet } from '../../../common/types/additionalFacets';
import { Blocktype, DataType, Texttype } from '../../../common/types/enums';
import { addBlock } from './addBlock';

export async function addBlockEntitiesFromString(
  lsc: ILeanScopeClient,
  htmlString: string,
  parentId: string,
  userId: string,
) {
  const sanitizedText = htmlString.replace(/style="([\s\S]*?)"/gi, '');
  const cleanedHtmlString = sanitizedText
    .replace(/&nbsp;/g, ' ')
    .replace(/<ol\s*>|<\/ol\s*>|<ul\s*>|<\/ul\s*>/g, '')
    .trim();

  const splitRegex = /<div>|<div\s*\/?>|<br\s*\/?>|<\/div>|<li>|<\/li>|<p>|<p\s*\/?>|<\/p>/g;

  const contentBlocks = cleanedHtmlString.split(splitRegex).filter((text) => text.trim() !== '');

  contentBlocks.forEach((content, index) => {
    const isExisting = lsc.engine.entities.some(
      (e) => e.has(DataType.BLOCK) && e.get(TextFacet)?.props.text === content.replace(/<[^>]+>/g, '').trim(),
    );

    if (!isExisting) {
      const trimmedContent = content.trim();

      const isList = /^<li(\s|>)/.test(trimmedContent);
      const isBold = /^(<b(\s|>).*<\/b(\s|>)|<strong(\s|>).*<\/strong(\s|>))/i.test(trimmedContent);

      const textType = isBold ? Texttype.BOLD : Texttype.NORMAL;

      // const plainTextContent = trimmedContent.replace(/<[^>]+>/g, "");

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
      addBlock(lsc, newBlockEntity, userId);
    }
  });
}
