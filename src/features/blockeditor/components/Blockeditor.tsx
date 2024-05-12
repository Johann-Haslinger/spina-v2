import React, { ChangeEvent, Fragment } from "react";
import { ActionRow, NavBarButton, NavigationBar, PrimaryButton, Spacer, Title } from "../../../components";
import InitializeBlockeditorSystem from "../systems/InitializeBlockeditorSystem";
import { useCurrentBlockeditor } from "../hooks/useCurrentBlockeditor";
import { IoAdd, IoColorWandOutline, IoEllipsisHorizontalCircleOutline, IoSparklesOutline } from "react-icons/io5";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayButtonTexts } from "../../../utils/displayText";
import { changeBlockeditorState } from "../functions/changeBlockeditorState";
import UpdateBlockStateSystem from "../systems/UpdateBlockStateSystem";
import { useOutsideBlockareaClick } from "../hooks/useOutsideBlockareaClick";
import ComponentRenderer from "./ComponentRenderer";
import LoadBlocksSystem from "../systems/LoadBlocksSystem";

// function getTextTypeForString(textType: string): TextTypes {
//   if (textType === "Titel") {
//     return TextTypes.TITLE;
//   }
//   if (textType === "Untertitel") {
//     return TextTypes.SUBTITLE;
//   }
//   if (textType == "Fett") {
//     return TextTypes.BOLD;
//   }
//   if (textType === "Kursiv") {
//     return TextTypes.ITALIC;
//   }
//   if (textType === "Unterstrichen") {
//     return TextTypes.UNDERLINE;
//   }
//   if (textType === "Beschriftung") {
//     return TextTypes.CAPTION;
//   }
//   if (textType === "Überschrift") {
//     return TextTypes.HEADING;
//   }
//   if (textType === "Normal") {
//     return TextTypes.NORMAL;
//   }
//   return TextTypes.NORMAL;
// }

interface BlockeditorProps {
  id: string;
  title: string;
  customHeaderArea?: React.ReactNode;
  onHeaderBlur?: (e: ChangeEvent<HTMLParagraphElement>) => void;
  generateBlocksString?: string;
  customOptionRows?: React.ReactNode;
  customGenerateOptionRows?: React.ReactNode;
  onBlockGenerate?: () => void;
  customEditOptions?: React.ReactNode;
  customContent?: React.ReactNode;
  hideAddBlockButton?: boolean;
}

const Blockeditor = (props: BlockeditorProps) => {
  const { id, title, customHeaderArea, customOptionRows, hideAddBlockButton, customGenerateOptionRows, customContent } =
    props;
  const { selectedLanguage } = useSelectedLanguage();
  const { blockeditorState, blockeditorEntity } = useCurrentBlockeditor();
  const { blocksAreaRef, addBlockAreaRef } = useOutsideBlockareaClick();

  return (
    <Fragment>
      <InitializeBlockeditorSystem blockeditorId={id} />
      <LoadBlocksSystem />
      <UpdateBlockStateSystem />

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

            {!hideAddBlockButton && (
              <NavBarButton>
                <IoAdd onClick={() => changeBlockeditorState(blockeditorEntity, "create")} />
              </NavBarButton>
            )}

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

      <Title>{title}</Title>
      {customHeaderArea ? customHeaderArea : null}
      <Spacer />
      {customContent ? (
        customContent
      ) : (
        <Fragment>
          <div ref={blocksAreaRef}>
            <ComponentRenderer />
            {/* <EditMenu
              backfuction={() => handleChangeBlockeditorState("view")}
              handleAddBlockLocally={handleAddBlock}
              handleUpdateBlockLocally={handleUpdateBlockLocally}
              deleteBlockLocally={deleteBlock}
              blocks={blocks}
              handleChangeBlockeditorState={handleChangeBlockeditorState}
              BlockeditorState={blockeditorState}
            />
            <CreateMenu
              parentId={id}
              handleChangeBlockeditorState={handleChangeBlockeditorState}
              BlockeditorState={blockeditorState}
              blocks={blocks}
              handleAddBlockLocally={handleAddBlock}
            /> */}
          </div>
          <div ref={addBlockAreaRef}></div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Blockeditor;
