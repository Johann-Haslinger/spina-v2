import styled from "@emotion/styled";
import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, EntityProps } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { FormEvent, Fragment, RefObject, useContext, useState } from "react";
import tw from "twin.macro";
import { v4 } from "uuid";
import { BlocktypeFacet, ListStyleFacet, TexttypeFacet, TodoStateFacet } from "../../../../app/additionalFacets";
import { AdditionalTags, Blocktypes, DataTypes, ListStyles, Texttypes } from "../../../../base/enums";
import { useUserData } from "../../../../hooks/useUserData";
import supabaseClient from "../../../../lib/supabase";
import { addBlock } from "../../functions/addBlock";
import { addBlockEntitiesFromString } from "../../functions/addBlockEntitiesFromString";
import { changeBlockeditorState } from "../../functions/changeBlockeditorState";
import { deleteBlock } from "../../functions/deleteBlock";
import { getCaretPosition } from "../../functions/getCaretPosition";
import { getTextStyle } from "../../functions/getTextStyle";
import {
  findNumberBetween,
  getHighestOrder,
  getNextHigherOrder,
  getNextHigherOrderEntity,
  getNextLowerOrderEntity,
} from "../../functions/orderHelper";
import { updateBlocktext } from "../../functions/updateBlocktext";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";
import { useTexteditorRef } from "../../hooks/useOutsideTexteditorClickHandler";
import HandleTexteditorKeyPressSystem from "../../systems/HandleTexteditorKeyPressSystem";

const updateTextBlockToListBlock = async (blockEntity: Entity) => {
  blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.LIST }));
  blockEntity.add(new ListStyleFacet({ listStyle: ListStyles.UNORDERED }));

  const id = blockEntity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from("blocks").update({ type: "list", listStyle: "unordered" }).eq("id", id);

  if (error) {
    console.error("Error updating block to list block:", error);
  }
};

const udateTextBlockToTodoBlock = async (blockEntity: Entity) => {
  blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TODO }));
  blockEntity.add(new TodoStateFacet({ todoState: 0 }));

  const id = blockEntity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from("blocks").update({ type: "todo", state: 0 }).eq("id", id);

  if (error) {
    console.error("Error updating block to todo block:", error);
  }
};

const addDividerBlock = (lsc: ILeanScopeClient, blockEntity: Entity, userId: string) => {
  const blockOrderIndex = blockEntity?.get(FloatOrderFacet)?.props.index || 1;
  const parentId = blockEntity?.get(ParentFacet)?.props.parentId;
  deleteBlock(lsc, blockEntity);

  const newDividerBlockEntity = new Entity();
  newDividerBlockEntity.add(new IdentifierFacet({ guid: v4() }));
  newDividerBlockEntity.add(new FloatOrderFacet({ index: blockOrderIndex }));
  newDividerBlockEntity.add(new ParentFacet({ parentId: parentId || "" }));
  newDividerBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.DIVIDER }));
  newDividerBlockEntity.add(DataTypes.BLOCK);

  addBlock(lsc, newDividerBlockEntity, userId);

  const nextHigherBlockEntity = getNextHigherOrderEntity(lsc, blockEntity);
  const nextHigherBlockType = nextHigherBlockEntity?.get(BlocktypeFacet)?.props.blocktype;
  const nextHigherBlockText = nextHigherBlockEntity?.get(TextFacet)?.props.text;
  if (
    (nextHigherBlockType === Blocktypes.TEXT ||
      nextHigherBlockType === Blocktypes.LIST ||
      nextHigherBlockType === Blocktypes.TODO) &&
    nextHigherBlockText == ""
  ) {
    nextHigherBlockEntity?.add(AdditionalTags.FOCUSED);
  } else {
    const newBlock = new Entity();
    newBlock.add(new IdentifierFacet({ guid: v4() }));
    newBlock.add(new FloatOrderFacet({ index: (blockOrderIndex || 0) + 1 }));
    newBlock.add(new ParentFacet({ parentId: parentId || "" }));
    newBlock.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
    newBlock.add(DataTypes.BLOCK);

    addBlock(lsc, newBlock, userId);
  }
};

const handleEnterPress = async (
  lsc: ILeanScopeClient,
  blockEntity: Entity,
  texteditorRef: RefObject<HTMLDivElement>,
  userId: string
) => {
  const cursorPosition = getCaretPosition(texteditorRef);
  const blockText = blockEntity?.get(TextFacet)?.props.text || "";
  const blockOrder = blockEntity?.get(FloatOrderFacet)?.props.index || 1;
  const blockType = blockEntity?.get(BlocktypeFacet)?.props.blocktype || Blocktypes.TEXT;
  const textEditor = texteditorRef.current;
  const newtext = blockText?.substring(0, cursorPosition);
  const cuttedtext = blockText?.substring(cursorPosition);

  if (blockType == Blocktypes.TEXT || textEditor?.innerHTML !== "") {
    blockEntity.removeTag(AdditionalTags.FOCUSED);
    blockEntity.add(new TextFacet({ text: newtext }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient.from("blocks").update({ content: newtext }).eq("id", blockId);

    if (error) {
      console.error("Error updating block text:", error);
    }

    if (textEditor) {
      textEditor.innerHTML = newtext;
    }

    const newTextBlockOrder =
      getHighestOrder(lsc, blockEntity.get(ParentFacet)?.props.parentId || "") === blockOrder
        ? blockOrder + 1
        : findNumberBetween(blockOrder, getNextHigherOrder(lsc, blockEntity));

    const newBlockEntity = new Entity();
    newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    newBlockEntity.add(new FloatOrderFacet({ index: newTextBlockOrder }));
    newBlockEntity.add(new ParentFacet({ parentId: blockEntity?.get(ParentFacet)?.props.parentId || "" }));
    newBlockEntity.add(new TextFacet({ text: cuttedtext }));
    newBlockEntity.add(new BlocktypeFacet({ blocktype: blockType }));
    newBlockEntity.add(DataTypes.BLOCK);
    newBlockEntity.add(AdditionalTags.FOCUSED);

    addBlock(lsc, newBlockEntity, userId);
  } else {
    blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient.from("blocks").update({ type: Blocktypes.TEXT }).eq("id", blockId);

    if (error) {
      console.error("Error updating block type:", error);
    }
  }
};

const handleBackspacePressWithoutText = async (lsc: ILeanScopeClient, blockEntity: Entity) => {
  const blockType = blockEntity?.get(BlocktypeFacet)?.props.blocktype || Blocktypes.TEXT;

  if (blockType === Blocktypes.TEXT) {
    const lowerBlockEntity = getNextLowerOrderEntity(lsc, blockEntity);
    const lowerBlockType = lowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;
    deleteBlock(lsc, blockEntity);

    lowerBlockEntity?.add(AdditionalTags.FOCUSED);

    if (
      lowerBlockEntity &&
      (lowerBlockType === Blocktypes.TEXT || lowerBlockType === Blocktypes.LIST || lowerBlockType === Blocktypes.TODO)
    ) {
      lowerBlockEntity.add(AdditionalTags.FOCUSED);
    }
  } else {
    blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));

    const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient.from("blocks").update({ type: Blocktypes.TEXT }).eq("id", blockId);

    if (error) {
      console.error("Error updating block type:", error);
    }
  }
};
const handleBackSpacePressWithText = (
  lsc: ILeanScopeClient,
  blockEntity: Entity,
  texteditorRef: RefObject<HTMLDivElement>
) => {

  return;
  
  const blockText = blockEntity?.get(TextFacet)?.props.text || "";
  const higherBlock = getNextLowerOrderEntity(lsc, blockEntity);
  const higherBlockType = higherBlock?.get(BlocktypeFacet)?.props.blocktype;
  const higherBlockText = higherBlock?.get(TextFacet)?.props.text || "";

  if (
    higherBlockType === Blocktypes.TEXT ||
    higherBlockType === Blocktypes.TODO ||
    higherBlockType === Blocktypes.LIST
  ) {
    texteditorRef.current?.blur();
    higherBlock?.add(new TextFacet({ text: higherBlockText + blockText }));
    higherBlock?.add(AdditionalTags.FOCUSED);

    deleteBlock(lsc, blockEntity);
  }
};

const handleArrowUpPress = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  blockEntity.removeTag(AdditionalTags.FOCUSED);
  const nextLowerBlockEntity = getNextLowerOrderEntity(lsc, blockEntity);
  const nextLowerBlockType = nextLowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;

  if (
    nextLowerBlockType === Blocktypes.TEXT ||
    nextLowerBlockType === Blocktypes.LIST ||
    nextLowerBlockType === Blocktypes.TODO
  ) {
    nextLowerBlockEntity?.add(AdditionalTags.FOCUSED);
  }
};
const handleArrowDownPress = (lsc: ILeanScopeClient, blockEntity: Entity) => {
  blockEntity.removeTag(AdditionalTags.FOCUSED);
  const nextLowerBlockEntity = getNextHigherOrderEntity(lsc, blockEntity);
  const nextLowerBlockType = nextLowerBlockEntity?.get(BlocktypeFacet)?.props.blocktype;

  if (
    nextLowerBlockType === Blocktypes.TEXT ||
    nextLowerBlockType === Blocktypes.LIST ||
    nextLowerBlockType === Blocktypes.TODO
  ) {
    nextLowerBlockEntity?.add(AdditionalTags.FOCUSED);
  }
};

const changeBlockTextStyles = async (entity: Entity, textType: Texttypes) => {
  entity.add(new TexttypeFacet({ texttype: textType }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from("blocks").update({ textType }).eq("id", id);

  if (error) {
    console.error("Error updating block text type:", error);
  }
};

const StyledTexteditor = styled.div`
  ${tw`w-full h-full py-1 !select-none outline-none cursor-text`}
`;

const BlockTexteditor = (props: EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity } = props;
  const text = entity.get(TextFacet)?.props.text || "";
  const parentId = entity.get(ParentFacet)?.props.parentId || "";
  const [texttypeProps] = useEntityFacets(entity, TexttypeFacet);
  const texttype = texttypeProps?.texttype || Texttypes.NORMAL;
  const { blockeditorState, blockeditorEntity } = useCurrentBlockeditor();
  const { userId } = useUserData();
  const [initinalBlocktext] = useState<string>(text);
  const { texteditorRef } = useTexteditorRef(entity);

  const isBlockEditable = blockeditorState === "write" || blockeditorState === "view";

  // const sanitizer = dompurify.sanitize;

  const handleFocus = () => {
    changeBlockeditorState(blockeditorEntity, "write");
    entity.add(AdditionalTags.FOCUSED);
  };
  const handleInput = (e: FormEvent<HTMLDivElement>) => entity.add(new TextFacet({ text: e.currentTarget.innerHTML }));
  const handleBlur = (e: FormEvent<HTMLDivElement>) => updateBlocktext(entity, e.currentTarget.innerHTML);

  const handlePaste = async (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html")
      ? e.clipboardData.getData("text/html")
      : e.clipboardData.getData("text/plain");

    addBlockEntitiesFromString(lsc, text, parentId, userId);

    if (text === "") {
      deleteBlock(lsc, entity);
    }
    entity.removeTag(AdditionalTags.FOCUSED);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    const { key } = e;
    const caretPosition = getCaretPosition(texteditorRef);

    switch (key) {
      case "-":
        if (text === "" && texttype === Texttypes.NORMAL) {
          e.preventDefault();
          updateTextBlockToListBlock(entity);
        }
        break;
      case "x":
        if (text === "" && texttype === Texttypes.NORMAL) {
          e.preventDefault();
          udateTextBlockToTodoBlock(entity);
        }
        break;
      case "_":
        if (text === "") {
          e.preventDefault();
          addDividerBlock(lsc, entity, userId);
        }
        break;
      case "Enter":
        e.preventDefault();
        handleEnterPress(lsc, entity, texteditorRef, userId);
        break;
      case "Backspace":
        if (text.trim().length === 0) {
          e.preventDefault();
          handleBackspacePressWithoutText(lsc, entity);
        } else if (text.trim().length > 0 && caretPosition === 0) {
          e.preventDefault();
          handleBackSpacePressWithText(lsc, entity, texteditorRef);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        handleArrowUpPress(lsc, entity);
        break;
      case "ArrowDown":
        e.preventDefault();
        handleArrowDownPress(lsc, entity);
        break;

      case " ":
        if (text === "##") {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttypes.SUBTITLE);
        } else if (text === "#") {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttypes.TITLE);
        } else if (text === "###") {
          e.preventDefault();
          changeBlockTextStyles(entity, Texttypes.HEADING);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <HandleTexteditorKeyPressSystem entity={entity} />
      <StyledTexteditor
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        ref={texteditorRef}
        onFocus={handleFocus}
        style={{
          ...getTextStyle(texttype),
          userSelect: "none",
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
