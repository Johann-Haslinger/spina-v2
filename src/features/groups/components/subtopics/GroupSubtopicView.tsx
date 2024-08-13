import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, Tags, TextProps } from '@leanscope/ecs-models';
import { Fragment, useContext, useState } from 'react';
import {
  IoArrowDownCircleOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
  TitleProps,
} from '../../../../app/additionalFacets';
import { AdditionalTags, DataTypes, Stories } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  SegmentedControl,
  SegmentedControlCell,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import InitializeBlockeditorSystem from '../../../blockeditor/systems/InitializeBlockeditorSystem';
import EditFlashcardSheet from '../../../collection/components/flashcard-sets/EditFlashcardSheet';
import LernvideoRow from '../../../collection/components/lern-videos/LernvideoRow';
import PodcastRow from '../../../collection/components/podcasts/PodcastRow';
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';
import LoadGroupSubtopicResourcesSystem from '../../systems/LoadGroupSubtopicResourcesSystem';
import GroupFlashcardCell from '../flashcard-sets/GroupFlashcardCell';
import DeleteGroupSubtopicAlert from './DeleteGroupSubtopicAlert';
import EditGroupSubtopicSheet from './EditGroupSubtopicSheet';

const StyledCardsWrapper = styled.div`
  ${tw` w-full px-2`}
`;

enum GroupSubtopicViewStates {
  NOTE,
  FLASHCARDS,
}

const GroupSubtopicView = (props: TitleProps & EntityProps & IdentifierProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid, text } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicTitle } = useSelectedGroupTopic();
  const [groupSubtopicViewState, setGroupSubtopicViewState] = useState(GroupSubtopicViewStates.NOTE);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETING_GROUP_SUBTOPIC_STORY);
  const openEditSheet = () => lsc.stories.transitTo(Stories.EDETING_GROUP_SUBTOPIC_STORY);
  const openCloneResourceSheet = () => lsc.stories.transitTo(Stories.CLONING_RESOURCE_FROM_GROUP_STORY);

  return (
    <Fragment>
      <LoadGroupSubtopicResourcesSystem />
      <InitializeBlockeditorSystem isGroupBlockeditor blockeditorId={guid} />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton onClick={openCloneResourceSheet}>
            <IoArrowDownCircleOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow icon={<IoCreateOutline />} onClick={openEditSheet} first>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>

                <ActionRow last destructive icon={<IoTrashOutline />} onClick={openDeleteAlert}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{selectedGroupTopicTitle}</BackButton>
        <Title>{title}</Title>
        <Spacer />
        <div>
          <SegmentedControl>
            <SegmentedControlCell
              active={groupSubtopicViewState == GroupSubtopicViewStates.NOTE}
              onClick={() => setGroupSubtopicViewState(GroupSubtopicViewStates.NOTE)}
              first
            >
              {displayActionTexts(selectedLanguage).note}
            </SegmentedControlCell>
            <SegmentedControlCell
              active={groupSubtopicViewState == GroupSubtopicViewStates.FLASHCARDS}
              onClick={() => setGroupSubtopicViewState(GroupSubtopicViewStates.FLASHCARDS)}
              leftNeighbourActive={groupSubtopicViewState == GroupSubtopicViewStates.NOTE}
            >
              {displayActionTexts(selectedLanguage).flashcards}
            </SegmentedControlCell>
          </SegmentedControl>

          <Spacer />
          <EntityPropsMapper
            query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
            get={[[TitleFacet, DateAddedFacet], []]}
            onMatch={PodcastRow}
          />
          <EntityPropsMapper
            query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.LERNVIDEO)}
            get={[[TitleFacet, DateAddedFacet], []]}
            onMatch={LernvideoRow}
          />
        </div>
        <Spacer />

        <div>
          {groupSubtopicViewState == GroupSubtopicViewStates.FLASHCARDS ? (
            <StyledCardsWrapper>
              <CollectionGrid columnSize="large">
                <EntityPropsMapper
                  query={(e) => dataTypeQuery(e, DataTypes.GROUP_FLASHCARD) && isChildOfQuery(e, entity)}
                  get={[[QuestionFacet, AnswerFacet], []]}
                  onMatch={GroupFlashcardCell}
                />
              </CollectionGrid>
            </StyledCardsWrapper>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )}
        </div>
      </View>

      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataTypes.FLASHCARD)}
        get={[[AnswerFacet, QuestionFacet, IdentifierFacet, MasteryLevelFacet], []]}
        onMatch={EditFlashcardSheet}
      />

      <EditGroupSubtopicSheet />
      <DeleteGroupSubtopicAlert />
    </Fragment>
  );
};

export default GroupSubtopicView;
