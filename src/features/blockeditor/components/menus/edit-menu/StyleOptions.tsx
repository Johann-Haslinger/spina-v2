import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useEntities } from "@leanscope/ecs-engine";
import { Blocktypes, DataTypes, ListStyles, Texttypes } from "../../../../../base/enums";
import { Tags } from "@leanscope/ecs-models";
import { BlocktypeFacet, ListStyleFacet, TexttypeFacet, TodoStateFacet } from "../../../../../app/additionalFacets";
import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { getPreviewTextStyle } from "../../../functions/getTextStyle";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { useCurrentBlockeditor } from "../../../hooks/useCurrentBlockeditor";

const StyledOptionRow2Wrapper = styled.div`
  ${tw`flex space-x-1 w-full  overflow-x-scroll  h-16  items-center justify-between `}
`;

const StyledMoreButton = styled.div`
  ${tw`text-sm py-2 border-white rounded-lg px-4 w-full flex border justify-center  border-opacity-0 `}
`;

const StyledOptionRowWarpper = styled.div`
  ${tw`flex w-full space-x-1  overflow-x-scroll  py-3 items-center justify-between border-t border-opacity-50 dark:border-opacity-50 border-primaryBorder dark:border-primaryBorderDark   `}
`;

const StyledMoreOptionSheetWrapper = styled.div`
  ${tw`bg-white relative right-4 dark:bg-seconderyDark pt-2 h-44  ml-2 rounded-xl px-4 md:w-[32rem]  w-11/12   shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]`}
`;

const StyledBackIcon = styled.div`
  ${tw`w-8 h-1 rounded-full dark:bg-white dark:bg-opacity-5   bg-tertiary mx-auto`}
`;

const StyledFurtherOptionRowWrapper = styled.div`
  ${tw`flex w-full  overflow-x-scroll pt-3 justify-between py-1.5`}
`;

const StyledSecondFurtherOptionRowWrapper = styled.div`
  ${tw`flex w-full  overflow-x-scroll  py-1.5 border-t dark:border-primaryBorderDark  border-primaryBorder  dark:border-opacity-50  border-opacity-50  justify-between `}
`;

const StyledOptionWrapper = styled.div<{ isSelected: boolean }>`
  ${tw`py-2 items-center rounded-lg text-sm px-4 w-full flex border justify-center `}
  ${({ isSelected }) =>
    isSelected
      ? tw`text-primaryColor  bg-primaryColor bg-opacity-10 border-primaryColor`
      : tw` border-white border-opacity-0`}
`;

const useSelectedBlockTypes = () => {
  const [selectedBlocks] = useEntities((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const firstSelectedBlockEntity = selectedBlocks[0];
  const [textTypeProps, blocktypeProps] = useEntityFacets(firstSelectedBlockEntity, TexttypeFacet, BlocktypeFacet);
  const firstSelectedBlockTextType = textTypeProps?.texttype;
  const firstSelectedBlockType = blocktypeProps?.blocktype;
  const [currentTextType, setCurrentTextType] = useState<Texttypes | null>(null);
  const [currentBlockType, setCurrentBlockType] = useState<Blocktypes | null>(null);

  useEffect(() => {
    setCurrentTextType(
      (selectedBlocks.length !== 0 &&
        selectedBlocks.every(
          (blockEntity) =>
            (blockEntity?.get(TexttypeFacet)?.props.texttype || Texttypes.NORMAL) ===
            (selectedBlocks[0].get(TexttypeFacet)?.props.texttype || Texttypes.NORMAL)
        ) &&
        selectedBlocks[0].get(TexttypeFacet)?.props.texttype) ||
        Texttypes.NORMAL ||
        null
    );

    setCurrentBlockType(
      (selectedBlocks.length !== 0 &&
        selectedBlocks.every(
          (blockEntity) =>
            (blockEntity.get(BlocktypeFacet)?.props.blocktype || Blocktypes.TEXT) ===
            (selectedBlocks[0].get(BlocktypeFacet)?.props.blocktype || Blocktypes.TEXT)
        ) &&
        selectedBlocks[0].get(BlocktypeFacet)?.props.blocktype) ||
        Blocktypes.TEXT ||
        null
    );
  }, [selectedBlocks.length, firstSelectedBlockTextType, firstSelectedBlockType]);

  // useEffect(() => {
  //   console.log("currentTextType", currentTextType);
  //   console.log("currentBlockType", currentBlockType);
  //   const hasEveryBlockTheSameTextType = selectedBlocks.every(
  //     (block) => block.get(TexttypeFacet)?.props.texttype === firstSelectedBlockTextType
  //   );
  //   const hasEveryBlockTheSameBlockType = selectedBlocks.every(
  //     (block) => block.get(BlocktypeFacet)?.props.blocktype === firstSelectedBlockType
  //   );

  //   if (hasEveryBlockTheSameTextType) {
  //     setCurrentTextType(firstSelectedBlockTextType);
  //   } else {
  //     setCurrentTextType(null);
  //   }
  //   if (hasEveryBlockTheSameBlockType) {
  //     setCurrentBlockType(firstSelectedBlockType || null);
  //   } else {
  //     setCurrentBlockType(null);
  //   }
  // }, [selectedBlocks]);

  return { currentTextType, currentBlockType };
};

function getStringForTextType(textType: Texttypes): string {
  switch (textType) {
    case Texttypes.TITLE:
      return "title";
    case Texttypes.SUBTITLE:
      return "subTitle";
    case Texttypes.BOLD:
      return "bold";
    case Texttypes.CAPTION:
      return "caption";
    case Texttypes.HEADING:
      return "heading";
    case Texttypes.NORMAL:
      return "normal";
    default:
      return "normal";
  }
}

const getStringForBlockType = (blockType: Blocktypes): string => {
  switch (blockType) {
    case "text":
      return "Text";
    case "todo":
      return "Todo";
    case "list":
      return "Liste";
    case "page":
      return "Seite";

    default:
      return "Text";
  }
};
const BlockTypeOption = (props: {
  blockType: Blocktypes;
  currentBlockType: Blocktypes | null;
  updateSelectedBlocksBlockType: (lsc: ILeanScopeClient, blockType: Blocktypes) => void;
  customIcon?: React.ReactNode;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockType, currentBlockType, updateSelectedBlocksBlockType, customIcon } = props;

  const handleClick = () => updateSelectedBlocksBlockType(lsc, blockType);

  return (
    <StyledOptionWrapper onClick={handleClick} isSelected={currentBlockType == blockType}>
      {customIcon || getStringForBlockType(blockType)}
    </StyledOptionWrapper>
  );
};

const TextTypeOption = (props: {
  textType: Texttypes;
  currentTextType: Texttypes | null;
  updateSelectedBlocksTextType: (lsc: ILeanScopeClient, textType: Texttypes) => void;
  customIcon?: React.ReactNode;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { textType, currentTextType, updateSelectedBlocksTextType, customIcon } = props;

  const handleClick = () => updateSelectedBlocksTextType(lsc, textType);

  return (
    <StyledOptionWrapper
      isSelected={currentTextType === textType}
      onClick={handleClick}
      style={{ ...getPreviewTextStyle(textType) }}
    >
      {customIcon || getStringForTextType(textType)}
    </StyledOptionWrapper>
  );
};

const updateSelectedBlocksTextType = (lsc: ILeanScopeClient, newTextType: Texttypes) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  selectedBlockEntities.forEach(async (blockEntity) => {
    const blockType = blockEntity.get(BlocktypeFacet)?.props.blocktype;

    if (blockType !== Blocktypes.TEXT && blockType !== Blocktypes.TODO && blockType !== Blocktypes.LIST) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
    }

    blockEntity.add(new TexttypeFacet({ texttype: newTextType }));

    // TODO: Update the text type of the selected blocks in the database
  });
};

const updateSelectedBlocksBlockType = async (lsc: ILeanScopeClient, newBlockType: Blocktypes) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));

  const isAlreadyBlockType = selectedBlockEntities.every(
    (blockEntity) => blockEntity.get(BlocktypeFacet)?.props?.blocktype === newBlockType
  );

  selectedBlockEntities.forEach(async (blockEntity) => {
    if (isAlreadyBlockType) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
    } else if (newBlockType === Blocktypes.TODO) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TODO }));
      blockEntity.add(new TodoStateFacet({ todoState: 0 }));
    } else if (newBlockType === Blocktypes.LIST) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.LIST }));
      blockEntity.add(new ListStyleFacet({ listStyle: ListStyles.UNORDERED }));
    } else if (newBlockType === Blocktypes.PAGE) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.PAGE }));
    } else if (newBlockType === Blocktypes.TEXT) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
    }

    // TODO: Update the block type of the selected blocks in the database
  });
};

const StyleOptions = () => {
  const { currentTextType, currentBlockType } = useSelectedBlockTypes();
  const { blockeditorState } = useCurrentBlockeditor();
  const [isMoreTextOptionsVisible, setIsMoreTextOptionsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsMoreTextOptionsVisible(false);
  }, [blockeditorState]);

  return (
    <>
      <StyledOptionRow2Wrapper>
        <TextTypeOption
          textType={Texttypes.HEADING}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <TextTypeOption
          textType={Texttypes.NORMAL}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <BlockTypeOption
          blockType={Blocktypes.PAGE}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <StyledMoreButton
          onClick={() => {
            setIsMoreTextOptionsVisible(true);
          }}
        >
          Mehr
        </StyledMoreButton>
      </StyledOptionRow2Wrapper>

      <StyledOptionRowWarpper>
        <BlockTypeOption
          blockType={Blocktypes.TODO}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <BlockTypeOption
          blockType={Blocktypes.LIST}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <TextTypeOption
          customIcon={<div>B</div>}
          textType={Texttypes.BOLD}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <TextTypeOption
          textType={Texttypes.UNDERLINE}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
          customIcon={<div style={{ textDecoration: "underline" }}>U</div>}
        />
        <TextTypeOption
          textType={Texttypes.ITALIC}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
          customIcon={<p className="italic  font-serif ">I</p>}
        />
      </StyledOptionRowWarpper>

      <motion.div
        transition={{ type: "Tween" }}
        animate={{ y: isMoreTextOptionsVisible ? 0 : 600 }}
        initial={{
          y: 600,
          position: "fixed",
          bottom: 10,
          width: "100%",
          right: 0,
          left: 0,

          zIndex: 100,
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        onDragEnd={(_, info) => {
          if (info.offset.y >= 1) setIsMoreTextOptionsVisible(false);
        }}
      >
        <StyledMoreOptionSheetWrapper>
          <StyledBackIcon />

          <StyledFurtherOptionRowWrapper>
            <TextTypeOption
              textType={Texttypes.TITLE}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttypes.SUBTITLE}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttypes.HEADING}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
          </StyledFurtherOptionRowWrapper>
          <StyledSecondFurtherOptionRowWrapper>
            <TextTypeOption
              textType={Texttypes.BOLD}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttypes.NORMAL}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttypes.CAPTION}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
          </StyledSecondFurtherOptionRowWrapper>
          <StyledSecondFurtherOptionRowWrapper>
            <BlockTypeOption
              blockType={Blocktypes.PAGE}
              currentBlockType={currentBlockType}
              updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
            />
          </StyledSecondFurtherOptionRowWrapper>
        </StyledMoreOptionSheetWrapper>
      </motion.div>
    </>
  );
};

export default StyleOptions;
