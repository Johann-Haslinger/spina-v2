import React, { ChangeEvent, Fragment } from "react";
import { ActionRow, BackButton, NavBarButton, NavigationBar, PrimaryButton, Spacer, Title } from "../../../components";
import InitializeBlockeditorSystem from "../systems/InitializeBlockeditorSystem";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { IoAdd, IoColorWandOutline, IoEllipsisHorizontalCircleOutline, IoSparklesOutline } from "react-icons/io5";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayAlertTexts, displayButtonTexts } from "../../../utils/displayText";
import { changeBlockeditorState } from "../functions/changeBlockeditorState";
import UpdateBlockStateSystem from "../systems/UpdateBlockStateSystem";
import ComponentRenderer from "./ComponentRenderer";
import LoadBlocksSystem from "../systems/LoadBlocksSystem";
import ChangeBlockeditorStateSystem from "../systems/ChangeBlockeditorStateSystem";
import { useClickOutsideBlockEditorHandler } from "../hooks/useClickOutsideBlockEditorHandler";
import tw from "twin.macro";
import styled from "@emotion/styled";
import Editmenu from "./menus/edit-menu/Editmenu";
import Createmenu from "./menus/Createmenu";
import { useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";

const StyledTitleWrapper = styled.div`
  ${tw`px-2`}
`;

const StyledAddBlockArea = styled.div`
  ${tw`h-96 w-full `}
`;

// const AddNewBlockSystem = () => {
//   const lsc = useContext(LeanScopeClientContext);
//   const { blockeditorId } = useCurrentBlockeditor();
//   const [blockEntities] = useEntities(
//     (e) => e.has(DataTypes.BLOCK) && e.get(IdentifierFacet)?.props.guid === blockeditorId
//   );

//   useEffect(() => {
//     setTimeout(() => {
//       if (blockEntities.length === 0) {
//         {
//           const newBlockEntity = new Entity();
//           newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
//           newBlockEntity.add(new ParentFacet({ parentId: blockeditorId }));
//           newBlockEntity.add(new BlocktypeFacet({ blocktype: Blocktypes.TEXT }));
//           newBlockEntity.add(new TexttypeFacet({ texttype: Texttypes.NORMAL }));
//           newBlockEntity.add(new FloatOrderFacet({ index: 1 }));
//           newBlockEntity.add(DataTypes.BLOCK);
//           newBlockEntity.add(AdditionalTags.FOCUSED);

//           addBlock(lsc, newBlockEntity);
//         }
//       }
//     }, 300);
//   }, [blockEntities.length, blockeditorId]);

//   return null;
// };

interface BlockeditorProps {
  id: string;
  title?: string;
  navigateBack?: () => void;
  customHeaderArea?: React.ReactNode;
  onHeaderBlur?: (e: ChangeEvent<HTMLParagraphElement>) => void;
  generateBlocksString?: string;
  customOptionRows?: React.ReactNode;
  customGenerateOptionRows?: React.ReactNode;
  onBlockGenerate?: () => void;
  customEditOptions?: React.ReactNode;
  customContent?: React.ReactNode;
}

const Blockeditor = (props: BlockeditorProps) => {
  const { id, title, customHeaderArea, customOptionRows, customGenerateOptionRows, customContent, navigateBack } =
    props;
  const { selectedLanguage } = useSelectedLanguage();
  const { blockeditorState, blockeditorEntity, blockeditorId } = useCurrentBlockeditor();
  const { blocksAreaRef, addBlockAreaRef } = useClickOutsideBlockEditorHandler();
  const [parentEntity] = useEntity(
    (e) => e.get(IdentifierFacet)?.props.guid === blockeditorEntity?.get(ParentFacet)?.props.parentId
  );
  const backbuttonLabel = parentEntity?.get(TextFacet)?.props.text;

  return (
    <Fragment>
      <InitializeBlockeditorSystem initinalOpen blockeditorId={id} />
      <LoadBlocksSystem />
      <UpdateBlockStateSystem />
      <ChangeBlockeditorStateSystem />

      <NavigationBar>
        {blockeditorState === "view" ? (
          <Fragment>
            <NavBarButton
              content={
                <Fragment>
                  <ActionRow
                    icon={<IoSparklesOutline />}
                    first
                    last={customGenerateOptionRows !== undefined ? false : true}
                  >
                    {displayActionTexts(selectedLanguage).improveText}
                  </ActionRow>
                  {customGenerateOptionRows}
                </Fragment>
              }
            >
              <IoColorWandOutline />
            </NavBarButton>

            <NavBarButton>
              <IoAdd onClick={() => changeBlockeditorState(blockeditorEntity, "create")} />
            </NavBarButton>

            <NavBarButton content={customOptionRows ? customOptionRows : null}>
              <IoEllipsisHorizontalCircleOutline />
            </NavBarButton>
          </Fragment>
        ) : (
          <PrimaryButton onClick={() => changeBlockeditorState(blockeditorEntity, "view")}>
            {displayButtonTexts(selectedLanguage).done}
          </PrimaryButton>
        )}
      </NavigationBar>
      <StyledTitleWrapper>
        {navigateBack && <BackButton navigateBack={navigateBack}>{backbuttonLabel}</BackButton>}
        <Title>{title || displayAlertTexts(selectedLanguage).noTitle}</Title>
        {customHeaderArea ? customHeaderArea : null}
        <Spacer />
      </StyledTitleWrapper>
      {customContent ? (
        customContent
      ) : (
        <Fragment>
          <div ref={blocksAreaRef}>
            <ComponentRenderer />
            {id == blockeditorId && (
              <Fragment>
                <Editmenu />
                <Createmenu />
              </Fragment>
            )}
          </div>
          <StyledAddBlockArea ref={addBlockAreaRef} />
        </Fragment>
      )}
      {/* <EntityPropsMapper
        query={(e) => e.has(DataTypes.BLOCK) && e.has(Tags.CURRENT) && e.get(IdentifierFacet)?.props.guid !== id}
        get={[[TextFacet, IdentifierFacet], []]}
        onMatch={FurtherView}
      /> */}
    </Fragment>
  );
};

export default Blockeditor;
