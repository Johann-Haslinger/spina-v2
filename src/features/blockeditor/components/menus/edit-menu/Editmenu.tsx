import styled from "@emotion/styled";
import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { FloatOrderFacet, IdentifierFacet, ParentFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { Fragment, useContext } from "react";
import {
  IoArrowForwardCircleOutline,
  IoColorPalette,
  IoColorWandOutline,
  IoLayers,
  IoShareOutline,
  IoTrash,
} from "react-icons/io5";
import tw from "twin.macro";
import { v4 } from "uuid";
import { BlocktypeFacet, TexttypeFacet, TitleFacet } from "../../../../../app/additionalFacets";
import { COLOR_ITEMS } from "../../../../../base/constants";
import { AdditionalTags, Blocktypes, DataTypes, Stories, SupabaseColumns, SupabaseTables, Texttypes } from "../../../../../base/enums";
import { useSelectedLanguage } from "../../../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../../../hooks/useUserData";
import supabaseClient from "../../../../../lib/supabase";
import { displayLabelTexts } from "../../../../../utils/displayText";
import { sortEntitiesByOrder } from "../../../../../utils/sortEntitiesByOrder";
import { addBlock } from "../../../functions/addBlock";
import { changeBlockeditorState } from "../../../functions/changeBlockeditorState";
import { useCurrentBlockeditor } from "../../../hooks/useCurrentBlockeditor";
import HandleKeyPresEditMenuSystem from "../../../systems/HandleKeyPresEditMenuSystem";
import DeleteBlocksAlert from "../../DeleteBlocksAlert";
import ActionOptions from "./ActionOptions";
import EditOption from "./EditOption";
import LayoutOptions from "./LayoutOptions";
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
  ${tw`bg-primary dark:bg-tertiaryDark bg-opacity-90 backdrop-blur-xl flex-auto mx-auto h-20   rounded-lg pr-1 flex    w-11/12 md:w-[30rem]  dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.13)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]`}
`;

const groupSelectedBlocks = (lsc: ILeanScopeClient, userId: string) => {
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

  addBlock(lsc, newPageBlockEntity, userId);

  selectedBlockEntities
    .filter((e) => e !== firstSelectedBlockEntity)
    .forEach(async (blockEntity) => {
      blockEntity.add(new ParentFacet({ parentId: newPageBlockId }));

      const id = blockEntity.get(IdentifierFacet)?.props.guid;

      const { error } = await supabaseClient
        .from(SupabaseTables.BLOCKS)
        .update({ parentId: newPageBlockId })
        .eq(SupabaseColumns.ID, id);

      if (error) {
        console.error("Error updating block in supabase:", error);
      }
    });
};

const addContentToSelectedBlock = async (lsc: ILeanScopeClient, userId: string) => {
  const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const firstSelectedBlockEntity = selectedBlockEntities[0];
  const firstSelectedBlockId = firstSelectedBlockEntity.get(IdentifierFacet)?.props.guid || "";

  firstSelectedBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.PAGE }));
  firstSelectedBlockEntity.add(AdditionalTags.OPEN);

  const newBlockEntity = new Entity();
  newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
  newBlockEntity.add(new ParentFacet({ parentId: firstSelectedBlockId }));
  newBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
  newBlockEntity.add(new TexttypeFacet({ texttype: Texttypes.NORMAL }));
  newBlockEntity.add(new FloatOrderFacet({ index: 1 }));
  newBlockEntity.add(DataTypes.BLOCK);
  newBlockEntity.add(AdditionalTags.FOCUSED);

  addBlock(lsc, newBlockEntity, userId);

  const { error } = await supabaseClient
    .from(SupabaseTables.BLOCKS)
    .update({ type: Blocktypes.PAGE })
    .eq(SupabaseColumns.ID, firstSelectedBlockId);

  if (error) {
    console.error("Error updating block in supabase:", error);
  }
};

const showStyleOptionQuery = (pressedBlocks: readonly Entity[]) => {
  return pressedBlocks.every((block) => {
    const blocktype = block.get(BlocktypeFacet)?.props.blocktype;

    return (
      blocktype === Blocktypes.TEXT ||
      blocktype === Blocktypes.TODO ||
      blocktype === Blocktypes.LIST ||
      blocktype === Blocktypes.PAGE
    );
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
  const { blockeditorState, blockeditorEntity } = useCurrentBlockeditor();
  const isVisible = blockeditorState === "edit";
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const openDeleteSheet = () => lsc.stories.transitTo(Stories.DELETING_BLOCKS_STORY);

  const editOptions = [
    {
      name: displayLabelTexts(selectedLanguage).style,
      icon: <IoColorPalette />,

      color: COLOR_ITEMS[3].accentColor,
      content: <StyleOptions />,
      canShow: showStyleOptionQuery,
    },
    {
      name: displayLabelTexts(selectedLanguage).layout,
      icon: <IoLayers />,
      color: COLOR_ITEMS[4].accentColor,
      content: <LayoutOptions />,
      canShow: showImageOptionQuery,
    },
    {
      name: displayLabelTexts(selectedLanguage).addContent,
      icon: <IoArrowForwardCircleOutline />,
      color: COLOR_ITEMS[2].accentColor,
      customFunc: () => addContentToSelectedBlock(lsc, userId),
      canShow: showAddContentOptionQuery,
    },
    {
      name: displayLabelTexts(selectedLanguage).group,
      icon: <IoArrowForwardCircleOutline />,
      color: COLOR_ITEMS[5].accentColor,
      customFunc: () => groupSelectedBlocks(lsc, userId),
      canShow: showGroupOptionQuery,
    },
    {
      name: displayLabelTexts(selectedLanguage).share,
      icon: <IoShareOutline />,
      color: COLOR_ITEMS[1].accentColor,
      content: <ActionOptions backfuction={() => changeBlockeditorState(blockeditorEntity, "view")} />,
      canShow: () => true,
    },
    {
      name: displayLabelTexts(selectedLanguage).sapientor,
      icon: <IoColorWandOutline />,
      color: COLOR_ITEMS[4].accentColor,
      content: null,
      isLarge: true,
      canShow: () => true,
    },
    {
      name: displayLabelTexts(selectedLanguage).delete,
      icon: <IoTrash />,
      color: COLOR_ITEMS[7].accentColor,
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

      <DeleteBlocksAlert />
    </Fragment>
  );
};

export default Editmenu;
