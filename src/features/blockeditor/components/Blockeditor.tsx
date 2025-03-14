import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useEntityHasTags } from '@leanscope/ecs-engine';
import React, { Fragment, useContext } from 'react';
import { IoAdd, IoColorWandOutline, IoEllipsisHorizontalCircleOutline, IoSparklesOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { AdditionalTag, Story } from '../../../common/types/enums';
import { displayActionTexts, displayButtonTexts } from '../../../common/utilities/displayText';
import { ActionRow, BackButton, NavBarButton, NavigationBar, PrimaryButton, Spacer, Title } from '../../../components';
import GenerateImprovedTextSheet from '../../collection/components/generation/GenerateImprovedTextSheet';
import { changeBlockeditorState } from '../functions/changeBlockeditorState';
import { useClickOutsideBlockEditorHandler } from '../hooks/useClickOutsideBlockEditorHandler';
import { useCurrentBlockeditor } from '../hooks/useCurrentBlockeditor';
import ChangeBlockeditorStateSystem from '../systems/ChangeBlockeditorStateSystem';
import LoadBlocksSystem from '../systems/LoadBlocksSystem';
import UpdateBlockStateSystem from '../systems/UpdateBlockStateSystem';
import ComponentRenderer from './ComponentRenderer';
import Createmenu from './menus/Createmenu';
import Editmenu from './menus/edit-menu/Editmenu';

const StyledTitleWrapper = styled.div`
  ${tw`px-2`}
`;

const StyledAddBlockArea = styled.div`
  ${tw`h-96 w-full `}
`;

interface BlockeditorProps {
  id: string;
  title?: string;
  navigateBack?: () => void;
  customHeaderArea?: React.ReactNode;
  handleTitleBlur?: (value: string) => void;
  generateBlocksString?: string;
  customActionRows?: React.ReactNode;
  customGenerateActionRows?: React.ReactNode;
  onBlockGenerate?: () => void;
  customEditOptions?: React.ReactNode;
  customContent?: React.ReactNode;
  backbuttonLabel?: string;
}

const Blockeditor = (props: BlockeditorProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const {
    id,
    title,
    customHeaderArea,
    customActionRows,
    customGenerateActionRows,
    customContent,
    navigateBack,
    handleTitleBlur,
    backbuttonLabel,
    customEditOptions,
  } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const { blockeditorState, blockeditorEntity, blockeditorId } = useCurrentBlockeditor();
  const { blocksAreaRef, addBlockAreaRef } = useClickOutsideBlockEditorHandler();
  const [isGroupBlockeditor] = useEntityHasTags(blockeditorEntity, AdditionalTag.GROUP_BLOCK_EDITOR);

  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);

  return (
    blockeditorEntity && (
      <Fragment>
        <LoadBlocksSystem />
        <UpdateBlockStateSystem />
        <ChangeBlockeditorStateSystem />
        <NavigationBar>
          {blockeditorState === 'view' ? (
            <Fragment>
              {!customContent && !isGroupBlockeditor && (
                <NavBarButton
                  content={
                    <Fragment>
                      <ActionRow
                        icon={<IoSparklesOutline />}
                        first
                        onClick={openImproveTextSheet}
                        last={customGenerateActionRows !== undefined ? false : true}
                      >
                        {displayActionTexts(selectedLanguage).improveText}
                      </ActionRow>
                      {customGenerateActionRows}
                    </Fragment>
                  }
                >
                  <IoColorWandOutline />
                </NavBarButton>
              )}
              {customEditOptions}
              {!customContent && !isGroupBlockeditor && (
                <NavBarButton>
                  <IoAdd onClick={() => changeBlockeditorState(blockeditorEntity, 'create')} />
                </NavBarButton>
              )}

              <NavBarButton content={customActionRows}>
                <IoEllipsisHorizontalCircleOutline />
              </NavBarButton>
            </Fragment>
          ) : (
            <PrimaryButton onClick={() => changeBlockeditorState(blockeditorEntity, 'view')}>
              {displayButtonTexts(selectedLanguage).done}
            </PrimaryButton>
          )}
        </NavigationBar>
        <StyledTitleWrapper>
          {navigateBack && <BackButton navigateBack={navigateBack}>{backbuttonLabel}</BackButton>}
          <Title editable={handleTitleBlur && !isGroupBlockeditor ? true : false} onBlur={handleTitleBlur}>
            {title}
          </Title>
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

        {id == blockeditorId && <GenerateImprovedTextSheet />}
      </Fragment>
    )
  );
};

export default Blockeditor;
