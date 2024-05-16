import { Fragment, useContext } from "react";
import { useCurrentBlockeditor } from "../../../hooks/useCurrentBlockeditor";
import { Entity } from "@leanscope/ecs-engine";
import { Blocktypes, DataTypes, Stories } from "../../../../../base/enums";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { v4 } from "uuid";
import { addBlock } from "../../../functions/addBlock";
import { BlocktypeFacet, TitleFacet } from "../../../../../app/additionalFacets";
import { sortEntitiesByOrder } from "../../../../../utils/sortEntitiesByOrder";
import {
  IoColorPalette,
  IoLayers,
  IoArrowForwardCircleOutline,
  IoShareOutline,
  IoColorWandOutline,
  IoTrash,
} from "react-icons/io5";
import { COLOR_ITEMS } from "../../../../../base/constants";
import HandleKeyPresEditMenuSystem from "../../../systems/HandleKeyPresEditMenuSystem";
import EditOption from "./EditOption";
import DeleteBlocksAlert from "../../DeleteBlocksAlert";
import StyleOptions from "./StyleOptions";

type Option = {
  name: string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  content?: React.ReactNode | null;
  customFunc?: () => void;
  isLarge?: boolean;
};

const StyledMenuContainer = styled.div`
  ${tw` flex  absolute left-0 bottom-5 right-0 justify-center w-screen`}
`;

const StyledMenuWrapper = styled.div`
  ${tw`bg-primary dark:bg-tertiaryDark dark:bg-opacity-40 bg-opacity-40 backdrop-blur-xl overflow-x-scroll  flex-auto mx-auto h-20 overflow-y-clip  rounded-lg pr-1 flex  md:overflow-hidden  w-11/12 md:w-[30rem]  dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.13)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]`}
`;

const groupSelectedBlocks = (lsc: ILeanScopeClient) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const firstSelectedBlockEntity = selectedBlockEntities.filter((e) => e.has(TextFacet)).sort(sortEntitiesByOrder)[0];

  const firstBlockOrder = firstSelectedBlockEntity.get(FloatOrderFacet)?.props.index || 0;
  const firstBlockText = firstSelectedBlockEntity.get(TextFacet)?.props.text || "";
  const firstBlockParentId = firstSelectedBlockEntity.get(ParentFacet)?.props.parentId || "";

  const newPageBlockId = v4();

  const newPageBlockEntity = new Entity();
  newPageBlockEntity.add(new IdentifierFacet({ guid: newPageBlockId }));
  newPageBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.PAGE }));
  newPageBlockEntity.add(new FloatOrderFacet({ index: firstBlockOrder }));
  newPageBlockEntity.add(new TitleFacet({ title: firstBlockText }));
  newPageBlockEntity.add(new ParentFacet({ parentId: firstBlockParentId }));
  newPageBlockEntity.add(DataTypes.BLOCK);

  addBlock(lsc, newPageBlockEntity);

  selectedBlockEntities
    .filter((e) => e !== firstSelectedBlockEntity)
    .forEach((blockEntity) => {
      blockEntity.add(new ParentFacet({ parentId: newPageBlockId }));
    });

  // TODO: Update the parent id of the selected blocks in the database
};

const addContentToSelectedBlock = async (lsc: ILeanScopeClient) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const firstSelectedBlockEntity = selectedBlockEntities[0];

  firstSelectedBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.PAGE }));

  // TODO: Update the block type of the selected block in the database
};

const showStyleOptionQuery = (pressedBlocks: readonly Entity[]) => {
  return pressedBlocks.every((block) => {
    const blocktype = block.get(BlocktypeFacet)?.props.blocktype;

    return blocktype === Blocktypes.TEXT || blocktype === Blocktypes.TODO || blocktype === Blocktypes.LIST;
  });
};

const showImageOptionQuery = (pressedBlocks: readonly Entity[]) => {
  return pressedBlocks.every((block) => block.get(BlocktypeFacet)?.props.blocktype === Blocktypes.IMAGE);
};

const showAddContentOptionQuery = (pressedBlocks: readonly Entity[]) => {
  return (
    pressedBlocks.length === 1 &&
    pressedBlocks[0] &&
    (pressedBlocks[0].get(BlocktypeFacet)?.props.blocktype === Blocktypes.TEXT ||
      pressedBlocks[0].get(BlocktypeFacet)?.props.blocktype === Blocktypes.TODO ||
      pressedBlocks[0].get(BlocktypeFacet)?.props.blocktype === Blocktypes.LIST)
  );
};

const showGroupOptionQuery = (pressedBlocks: readonly Entity[]) => pressedBlocks.length > 1;

const Editmenu = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { blockeditorState } = useCurrentBlockeditor();
  const isVisible = blockeditorState === "edit";

  const openDeleteSheet = () => lsc.stories.transitTo(Stories.DELETING_BLOCKS_STORY);

  const editOptions = [
    {
      name: "Stil",
      icon: <IoColorPalette />,
      color: COLOR_ITEMS[3].color,
      bgColor: COLOR_ITEMS[3].backgroundColor,
      content: <StyleOptions />,
      canShow: showStyleOptionQuery,
    },
    {
      name: "Layout",
      icon: <IoLayers />,
      color: COLOR_ITEMS[4].color,
      bgColor: COLOR_ITEMS[4].backgroundColor,
      content:
        // <LayoutOptions
        //   pressedBlocks={pressedBlocks as ImageBlock[]}
        //   handleUpdateBlockLocally={handleUpdateBlockLocally}
        // />
        null,
      canShow: showImageOptionQuery,
    },
    {
      name: "+ Inhalt",
      icon: <IoArrowForwardCircleOutline />,
      color: COLOR_ITEMS[2].color,
      bgColor: COLOR_ITEMS[2].backgroundColor,
      customFunc: addContentToSelectedBlock,
      canShow: showAddContentOptionQuery,
    },
    {
      name: "Gruppe",
      icon: <IoArrowForwardCircleOutline />,
      color: COLOR_ITEMS[4].color,
      bgColor: COLOR_ITEMS[4].backgroundColor,
      customFunc: groupSelectedBlocks,
      canShow: showGroupOptionQuery,
    },
    {
      name: "Aktionen",
      icon: <IoShareOutline />,
      color: COLOR_ITEMS[1].color,
      bgColor: COLOR_ITEMS[1].backgroundColor,
      content:
        // <ActionOptions
        //   backfuction={backfuction}
        //   blocks={blocks}
        //   handleDeleteBlockLocally={deleteBlockLocally}
        //   handleAddBlockLocally={handleAddBlockLocally}
        //   pressedBlocks={pressedBlocks}
        // />
        null,
      canShow: () => true,
    },
    {
      name: "Sapientor",
      icon: <IoColorWandOutline />,
      color: COLOR_ITEMS[0].color,
      bgColor: COLOR_ITEMS[0].backgroundColor,
      content: null,
      isLarge: true,
      canShow: () => true,
    },
    {
      name: "Löschen",
      icon: <IoTrash />,
      color: COLOR_ITEMS[6].color,
      bgColor: COLOR_ITEMS[6].backgroundColor,
      customFunc: () => openDeleteSheet(),
      canShow: () => true,
    },
  ];

  return (
    <Fragment>
      <HandleKeyPresEditMenuSystem />

      <StyledMenuContainer>
        <motion.div
          transition={{ type: "Tween" }}
          animate={{ y: !isVisible ? 200 : 0 }}
          initial={{ y: 200 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
        >
          <StyledMenuWrapper>
            {editOptions.map((option, idx) => (
              <EditOption key={idx} canShow={option.canShow} isVisible={isVisible} option={option as Option} />
            ))}
          </StyledMenuWrapper>
        </motion.div>
      </StyledMenuContainer>
      {/* 
      <DestructiveActionSheet
        isVisible={isTryingToDeleteViewVisible}
        setIsVisible={setIsTryingToDeleteViewVisible}
        length={pressedBlocks.length}
        deleteFunc={deleteSelectedBlocks}
      /> */}

      <DeleteBlocksAlert />
    </Fragment>
  );
};

export default Editmenu;
