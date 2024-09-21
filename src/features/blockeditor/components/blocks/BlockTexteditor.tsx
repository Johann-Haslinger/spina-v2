import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity, EntityProps, useEntityComponents } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { FormEvent, Fragment, RefObject, useContext, useState } from 'react';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { BlocktypeFacet, ListStyleFacet, TexttypeFacet, TodoStateFacet } from '../../../../app/additionalFacets';
import {
  AdditionalTag,
  Blocktype,
  DataType,
  ListStyle,
  SupabaseColumn,
  SupabaseTable,
  Texttype,
} from '../../../../base/enums';
import { useUserData } from '../../../../hooks/useUserData';
import supabaseClient from '../../../../lib/supabase';
import { addBlock } from '../../functions/addBlock';
import { addBlockEntitiesFromString } from '../../functions/addBlockEntitiesFromString';
import { changeBlockeditorState } from '../../functions/changeBlockeditorState';
import { deleteBlock } from '../../functions/deleteBlock';
import { getCaretPosition } from '../../functions/getCaretPosition';
import { getTextStyle } from '../../functions/getTextStyle';
import {
  findNumberBetween,
  getHighestOrder,
  getNextHigherOrder,
  getNextHigherOrderEntity,
  getNextLowerOrderEntity,
} from '../../functions/orderHelper';
import { updateBlocktext } from '../../functions/updateBlocktext';
import { useCurrentBlockeditor } from '../../hooks/useCurrentBlockeditor';
import { useTexteditorRef } from '../../hooks/useOutsideTexteditorClickHandler';
import HandleTexteditorKeyPressSystem from '../../systems/HandleTexteditorKeyPressSystem';

const updateTextBlockToListBlock = async (blockEntity: Entity) => {
  blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.LIST }));
  blockEntity.add(new ListStyleFacet({ listStyle: ListStyle.UNORDERED }));

  const id = blockEntity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient
    .from(SupabaseTable.BLOCKS)
    .update({ type: 'list', listStyle: 'unordered' })
    .eq(SupabaseColumn.ID, id);

  if (error) {
    console.error('Error updating block to list block:', error);
  }
};

const udateTextBlockToTodoBlock = async (blockEntity: Entity) => {
  blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TODO }));
  blockEntity.add(new TodoStateFacet({ todoState: 0 }));

  const id = blockEntity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient
    .from(SupabaseTable.BLOCKS)
    .update({ type: 'todo', state: 0 })
    .eq(SupabaseColumn.ID, id);

  if (error) {
    console.error('Error updating block to todo block:', error);
  }
};

const addDividerBlock = (lsc: ILeanScopeClient, blockEntity: Entity, userId: string) => {
  const blockOrderIndex = blockEntity?.get(FloatOrderFacet)?.props.index || 1;
  const parentId = blockEntity?.get(ParentFacet)?.props.parentId;
  deleteBlock(lsc, blockEntity);

  const newDividerBlockEntity = new Entity();
  newDividerBlockEntity.add(new IdentifierFacet({ guid: v4() }));
  newDividerBlockEntity.add(new FloatOrderFacet({ index: blockOrderIndex }));
  newDividerBlockEntity.add(new ParentFacet({ parentId: parentId || '' }));
  newDividerBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.DIVIDER }));
  newDividerBlockEntity.add(DataType.BLOCK);

  addBlock(lsc, newDividerBlockEntity, userId);

  const nextHigherBlockEntity = getNextHigherOrderEntity(lsc, blockEntity);
  const nextHigherBlockType = nextHigherBlockEntity?.get(BlocktypeFacet)?.props.blocktype;
  const nextHigherBlockText = nextHigherBlockEntity?.get(TextFacet)?.props.text;
  if (
    (nextHigherBlockType === Blocktype.TEXT ||
      nextHigherBlockType === Blocktype.LIST ||
      nextHigherBlockType === Blocktype.TODO) &&
    nextHigherBlockText == ''
  ) {
    nextHigherBlockEntity?.add(AdditionalTag.FOCUSED);
  } else {
    const newBlock = new Entity();
    newBlock.add(new IdentifierFacet({ guid: v4() }));
    newBlock.add(new FloatOrderFacet({ index: (blockOrderIndex || 0) + 1 }));
    newBlock.add(new ParentFacet({ parentId: parentId || '' }));
    newBlock.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));
    newBlock.add(DataType.BLOCK);

    addBlock(lsc, newBlock, userId);
  }
};

const handleEnterPress = async (
  lsc: ILeanScopeClient,
  blockEntity: Entity,
  texteditorRef: RefObject<HTMLDivElement>,
  userId: string,
) => {
  const cursorPosition = getCaretPosition(texteditorRef);
  const blockText = blockEntity?.get(TextFacet)?.props.text || '';
  const blockOrder = blockEntity?.get(FloatOrderFacet)?.props.index || 1;
  const blockType = blockEntity?.get(BlocktypeFacet)?.props.blocktype || Blocktype.TEXT;
  const textEditor = texteditorRef.current;
  const newtext = blockText?.substring(0, cursorPosition);
  const cuttedtext = blockText?.substring(cursorPosition);

  if (blockType == Blocktype.TEXT || textEditor?.innerHTML !== '') {
    blockEntity.removeTag(AdditionalTag.FOCUSED);
    blockEntity.add(new TextFacet({ text: newtext }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const newTextBlockOrder =
      getHighestOrder(lsc, blockEntity.get(ParentFacet)?.props.parentId || '') === blockOrder
        ? blockOrder + 1
        : findNumberBetween(blockOrder, getNextHigherOrder(lsc, blockEntity));

    const newBlockEntity = new Entity();
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(new FloatOrderFacet({ index: newTextBlockOrder }));
    newBlockEntity.add(
      new ParentFacet({
        parentId: blockEntity?.get(ParentFacet)?.props.parentId || '',
      }),
    );
    newBlockEntity.add(new TextFacet({ text: cuttedtext }));
    newBlockEntity.add(new BlocktypeFacet({ blocktype: blockType }));
    newBlockEntity.add(DataType.BLOCK);
    newBlockEntity.add(AdditionalTag.FOCUSED);

    addBlock(lsc, newBlockEntity, userId);

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ content: newtext })
      .eq(SupabaseColumn.ID, blockId);

    if (error) {
      console.error('Error updating block text:', error);
    }

    if (textEditor) {
      textEditor.innerHTML = newtext;
    }
  } else {
    blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ type: Blocktype.TEXT })
      .eq(SupabaseColumn.ID, blockId);

    if (error) {
      console.error('Error updating block type:', error);
    }
  }
};

const handleBackspacePressWithoutText = async (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const blockType = blockEntity?.get(BlocktypeFacet)?.props.blocktype || Blocktype.TEXT;

  if (blockType === Blocktype.TEXT) {
    const lowerBlockEntity = getNextLowerOrderEntity(lsc, blockEntity);
    const lowerBlockType = lowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;
    deleteBlock(lsc, blockEntity);

    lowerBlockEntity?.add(AdditionalTag.FOCUSED);

    if (
      lowerBlockEntity &&
      (lowerBlockType === Blocktype.TEXT || lowerBlockType === Blocktype.LIST || lowerBlockType === Blocktype.TODO)
    ) {
      lowerBlockEntity.add(AdditionalTag.FOCUSED);
    }
  } else {
    blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ type: Blocktype.TEXT })
      .eq(SupabaseColumn.ID, blockId);

    if (error) {
      console.error('Error updating block type:', error);
    }
  }
};
const handleBackSpacePressWithText = (
  lsc: ILeanScopeClient,
  blockEntity: Entity,
  texteditorRef: RefObject<HTMLDivElement>,
) => {
  return;

  const blockText = blockEntity?.get(TextFacet)?.props.text || '';
  const higherBlock = getNextLowerOrderEntity(lsc, blockEntity);
  const higherBlockType = higherBlock?.get(BlocktypeFacet)?.props.blocktype;
  const higherBlockText = higherBlock?.get(TextFacet)?.props.text || '';

  if (higherBlockType === Blocktype.TEXT || higherBlockType === Blocktype.TODO || higherBlockType === Blocktype.LIST) {
    texteditorRef.current?.blur();
    higherBlock?.add(new TextFacet({ text: higherBlockText + blockText }));
    higherBlock?.add(AdditionalTag.FOCUSED);

    deleteBlock(lsc, blockEntity);
  }
};

const handleArrowUpPress = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const nextLowerBlockEntity = getNextLowerOrderEntity(lsc, blockEntity);
  const nextLowerBlockType = nextLowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;

  if (
    nextLowerBlockType === Blocktype.TEXT ||
    nextLowerBlockType === Blocktype.LIST ||
    nextLowerBlockType === Blocktype.TODO
  ) {
    blockEntity.removeTag(AdditionalTag.FOCUSED);
    nextLowerBlockEntity?.add(AdditionalTag.FOCUSED);
  }
};
const handleArrowDownPress = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const nextLowerBlockEntity = getNextHigherOrderEntity(lsc, blockEntity);
  const nextLowerBlockType = nextLowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;

  if (
    nextLowerBlockType === Blocktype.TEXT ||
    nextLowerBlockType === Blocktype.LIST ||
    nextLowerBlockType === Blocktype.TODO
  ) {
    blockEntity.removeTag(AdditionalTag.FOCUSED);
    nextLowerBlockEntity?.add(AdditionalTag.FOCUSED);
  }
};

const changeBlockTextStyles = async (entity: Entity, textType: Texttype) => {
  entity.add(new TexttypeFacet({ texttype: textType }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).update({ textType }).eq(SupabaseColumn.ID, id);

  if (error) {
    console.error('Error updating block text type:', error);
  }
};

const StyledTexteditor = styled.div`
  ${tw`w-full h-full py-1 !select-none outline-none cursor-text`}
`;

const BlockTexteditor = (props: EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity } = props;
  const text = entity.get(TextFacet)?.props.text || '';
  const parentId = entity.get(ParentFacet)?.props.parentId || '';
  const [texttypeProps] = useEntityComponents(entity, TexttypeFacet);
  const texttype = texttypeProps?.props.texttype || Texttype.NORMAL;
  const { blockeditorState, blockeditorEntity, isGroupBlockeditor } = useCurrentBlockeditor();
  const { userId } = useUserData();
  const [initinalBlocktext] = useState<string>(text);
  const { texteditorRef } = useTexteditorRef(entity);

  const isBlockEditable = blockeditorState === 'write' || blockeditorState === 'view';

  const handleFocus = () => {
    changeBlockeditorState(blockeditorEntity, 'write');
    entity.add(AdditionalTag.FOCUSED);
  };
  const handleInput = (e: FormEvent<HTMLDivElement>) => entity.add(new TextFacet({ text: e.currentTarget.innerHTML }));
  const handleBlur = (e: FormEvent<HTMLDivElement>) => updateBlocktext(entity, e.currentTarget.innerHTML);

  const handlePaste = async (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html')
      ? e.clipboardData.getData('text/html')
      : e.clipboardData.getData('text/plain');

    addBlockEntitiesFromString(lsc, text, parentId, userId);

    if (text === '') {
      deleteBlock(lsc, entity);
    }
    entity.removeTag(AdditionalTag.FOCUSED);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    const { key } = e;
    const caretPosition = getCaretPosition(texteditorRef);

    switch (key) {
      case '-':
        if (text === '' && texttype === Texttype.NORMAL) {
          e.preventDefault();
          updateTextBlockToListBlock(entity);
        }
        break;
      case 'x':
        if (text === '' && texttype === Texttype.NORMAL) {
          e.preventDefault();
          udateTextBlockToTodoBlock(entity);
        }
        break;
      case '_':
        if (text === '') {
          e.preventDefault();
          addDividerBlock(lsc, entity, userId);
        }
        break;
      case 'Enter':
        e.preventDefault();
        handleEnterPress(lsc, entity, texteditorRef, userId);
        break;
      case 'Backspace':
        if (text.trim().length === 0) {
          e.preventDefault();
          handleBackspacePressWithoutText(lsc, entity);
        } else if (text.trim().length > 0 && caretPosition === 0) {
          e.preventDefault();
          handleBackSpacePressWithText(lsc, entity, texteditorRef);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleArrowUpPress(lsc, entity);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleArrowDownPress(lsc, entity);
        break;

      case ' ':
        if (text === '##') {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttype.SUBTITLE);
        } else if (text === '#') {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttype.TITLE);
        } else if (text === '###') {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttype.HEADING);
        }
        break;
      default:
        break;
    }
  };

  return isGroupBlockeditor ? (
    <StyledTexteditor
      style={{
        ...getTextStyle(texttype),
      }}
      dangerouslySetInnerHTML={{ __html: initinalBlocktext }}
    />
  ) : (
    <Fragment>
      <HandleTexteditorKeyPressSystem entity={entity} />
      <StyledTexteditor
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        ref={texteditorRef}
        onFocus={handleFocus}
        style={{
          ...getTextStyle(texttype),
        }}
        onPaste={(e) => handlePaste(e)}
        contentEditable={isBlockEditable}
        dangerouslySetInnerHTML={{ __html: initinalBlocktext }}
        onInput={handleInput}
      />
    </Fragment>
  );
};
export default BlockTexteditor;
