import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { useEntityFacets } from '@leanscope/ecs-engine/react-api/hooks/useEntityFacets';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { Fragment, useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { BlocktypeFacet, ListStyleFacet, TexttypeFacet, TodoStateFacet } from '../../../../../app/additionalFacets';
import { Blocktype, DataType, ListStyle, SupabaseColumn, SupabaseTable, Texttype } from '../../../../../base/enums';
import { BLOCK_TYPE_TEXT_DATA, TEXT_TYPE_TEXT_DATA } from '../../../../../base/textData';
import { useSelectedLanguage } from '../../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../../lib/supabase';
import { displayButtonTexts } from '../../../../../utils/displayText';
import { getPreviewTextStyle } from '../../../functions/getTextStyle';
import { useCurrentBlockeditor } from '../../../hooks/useCurrentBlockeditor';

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
  const [selectedBlocks] = useEntities((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));
  const firstSelectedBlockEntity = selectedBlocks[0];
  const [textTypeProps, blocktypeProps] = useEntityFacets(firstSelectedBlockEntity, TexttypeFacet, BlocktypeFacet);
  const firstSelectedBlockTextType = textTypeProps?.texttype;
  const firstSelectedBlockType = blocktypeProps?.blocktype;
  const [currentTextType, setCurrentTextType] = useState<Texttype | null>(null);
  const [currentBlockType, setCurrentBlockType] = useState<Blocktype | null>(null);

  useEffect(() => {
    setCurrentTextType(
      (selectedBlocks.length !== 0 &&
        selectedBlocks.every(
          (blockEntity) =>
            (blockEntity?.get(TexttypeFacet)?.props.texttype || Texttype.NORMAL) ===
            (selectedBlocks[0].get(TexttypeFacet)?.props.texttype || Texttype.NORMAL),
        ) &&
        selectedBlocks[0].get(TexttypeFacet)?.props.texttype) ||
        Texttype.NORMAL ||
        null,
    );

    setCurrentBlockType(
      (selectedBlocks.length !== 0 &&
        selectedBlocks.every(
          (blockEntity) =>
            (blockEntity.get(BlocktypeFacet)?.props.blocktype || Blocktype.TEXT) ===
            (selectedBlocks[0].get(BlocktypeFacet)?.props.blocktype || Blocktype.TEXT),
        ) &&
        selectedBlocks[0].get(BlocktypeFacet)?.props.blocktype) ||
        Blocktype.TEXT ||
        null,
    );
  }, [selectedBlocks.length, firstSelectedBlockTextType, firstSelectedBlockType]);

  return { currentTextType, currentBlockType };
};

const BlockTypeOption = (props: {
  blockType: Blocktype;
  currentBlockType: Blocktype | null;
  updateSelectedBlocksBlockType: (lsc: ILeanScopeClient, blockType: Blocktype) => void;
  customIcon?: React.ReactNode;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockType, currentBlockType, updateSelectedBlocksBlockType, customIcon } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const handleClick = () => updateSelectedBlocksBlockType(lsc, blockType);

  return (
    <StyledOptionWrapper onClick={handleClick} isSelected={currentBlockType == blockType}>
      {customIcon || BLOCK_TYPE_TEXT_DATA[blockType][selectedLanguage]}
    </StyledOptionWrapper>
  );
};

const TextTypeOption = (props: {
  textType: Texttype;
  currentTextType: Texttype | null;
  updateSelectedBlocksTextType: (lsc: ILeanScopeClient, textType: Texttype) => void;
  customIcon?: React.ReactNode;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { textType, currentTextType, updateSelectedBlocksTextType, customIcon } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const handleClick = () => updateSelectedBlocksTextType(lsc, textType);

  return (
    <StyledOptionWrapper
      isSelected={currentTextType === textType}
      onClick={handleClick}
      style={{ ...getPreviewTextStyle(textType) }}
    >
      {customIcon || TEXT_TYPE_TEXT_DATA[textType][selectedLanguage]}
    </StyledOptionWrapper>
  );
};

const updateSelectedBlocksTextType = async (lsc: ILeanScopeClient, newTextType: Texttype) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));
  selectedBlockEntities.forEach(async (blockEntity) => {
    const blockType = blockEntity.get(BlocktypeFacet)?.props.blocktype;

    if (blockType !== Blocktype.TEXT && blockType !== Blocktype.TODO && blockType !== Blocktype.LIST) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));
    }

    blockEntity.add(new TexttypeFacet({ texttype: newTextType }));

    const id = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ text_type: newTextType })
      .eq(SupabaseColumn.ID, id);

    if (error) {
      console.error('Error updating text type of block in supabase:', error);
    }
  });
};

const updateSelectedBlocksBlockType = async (lsc: ILeanScopeClient, newBlockType: Blocktype) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

  const isAlreadyBlockType = selectedBlockEntities.every(
    (blockEntity) => blockEntity.get(BlocktypeFacet)?.props?.blocktype === newBlockType,
  );

  selectedBlockEntities.forEach(async (blockEntity) => {
    if (isAlreadyBlockType) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));
    } else if (newBlockType === Blocktype.TODO) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TODO }));
      blockEntity.add(new TodoStateFacet({ todoState: 0 }));
    } else if (newBlockType === Blocktype.LIST) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.LIST }));
      blockEntity.add(new ListStyleFacet({ listStyle: ListStyle.UNORDERED }));
    } else if (newBlockType === Blocktype.PAGE) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.PAGE }));
    } else if (newBlockType === Blocktype.TEXT) {
      blockEntity.add(new BlocktypeFacet({ blocktype: Blocktype.TEXT }));
    }

    const id = blockEntity.get(IdentifierFacet)?.props.guid;

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ type: newBlockType })
      .eq(SupabaseColumn.ID, id);

    if (error) {
      console.error('Error updating block type of block in supabase:', error);
    }
  });
};

const StyleOptions = () => {
  const { currentTextType, currentBlockType } = useSelectedBlockTypes();
  const { blockeditorState } = useCurrentBlockeditor();
  const [isMoreTextOptionsVisible, setIsMoreTextOptionsVisible] = useState<boolean>(false);
  const { selectedLanguage } = useSelectedLanguage();

  // TODO: Custom hook for isVisible state

  useEffect(() => {
    setIsMoreTextOptionsVisible(false);
  }, [blockeditorState]);

  return (
    <Fragment>
      <StyledOptionRow2Wrapper>
        <TextTypeOption
          textType={Texttype.HEADING}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <TextTypeOption
          textType={Texttype.NORMAL}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <BlockTypeOption
          blockType={Blocktype.PAGE}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <StyledMoreButton
          onClick={() => {
            setIsMoreTextOptionsVisible(true);
          }}
        >
          {displayButtonTexts(selectedLanguage).more}
        </StyledMoreButton>
      </StyledOptionRow2Wrapper>

      <StyledOptionRowWarpper>
        <BlockTypeOption
          blockType={Blocktype.TODO}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <BlockTypeOption
          blockType={Blocktype.LIST}
          currentBlockType={currentBlockType}
          updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
        />
        <TextTypeOption
          customIcon={<div>B</div>}
          textType={Texttype.BOLD}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
        />
        <TextTypeOption
          textType={Texttype.UNDERLINE}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
          customIcon={<div style={{ textDecoration: 'underline' }}>U</div>}
        />
        <TextTypeOption
          textType={Texttype.ITALIC}
          currentTextType={currentTextType}
          updateSelectedBlocksTextType={updateSelectedBlocksTextType}
          customIcon={<p className="italic  font-serif ">I</p>}
        />
      </StyledOptionRowWarpper>

      <motion.div
        transition={{ type: 'Tween' }}
        animate={{ y: isMoreTextOptionsVisible ? 0 : 600 }}
        initial={{
          y: 600,
          position: 'fixed',
          bottom: 10,
          width: '100%',
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
              textType={Texttype.TITLE}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttype.SUBTITLE}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttype.HEADING}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
          </StyledFurtherOptionRowWrapper>
          <StyledSecondFurtherOptionRowWrapper>
            <TextTypeOption
              textType={Texttype.BOLD}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttype.NORMAL}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
            <TextTypeOption
              textType={Texttype.CAPTION}
              currentTextType={currentTextType}
              updateSelectedBlocksTextType={updateSelectedBlocksTextType}
            />
          </StyledSecondFurtherOptionRowWrapper>
          <StyledSecondFurtherOptionRowWrapper>
            <BlockTypeOption
              blockType={Blocktype.PAGE}
              currentBlockType={currentBlockType}
              updateSelectedBlocksBlockType={updateSelectedBlocksBlockType}
            />
          </StyledSecondFurtherOptionRowWrapper>
        </StyledMoreOptionSheetWrapper>
      </motion.div>
    </Fragment>
  );
};

export default StyleOptions;
