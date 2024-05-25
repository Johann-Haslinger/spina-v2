import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { DescriptionProps, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataTypes, Stories } from '../../../../base/enums';
import { ActionRow, BackButton, CollectionGrid, NavBarButton, NavigationBar, NoContentAddedHint, SecondaryText, Spacer, Title, View } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts, displayAlertTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import FlashcardSetCell from '../../../collection/components/flashcard-sets/FlashcardSetCell';
import NoteCell from '../../../collection/components/notes/NoteCell';
import SubtopicCell from '../../../collection/components/subtopics/SubtopicCell';
import { useEntityHasChildren } from '../../../collection/hooks/useEntityHasChildren';
import { useSelectedGroupSchoolSubject } from '../../hooks/useSelectedGroupSchoolSubject';
import LoadGroupFlashcardSetsSystem from '../../systems/LoadGroupFlashcardSetsSystem';
import LoadGroupHomeworksSystem from '../../systems/LoadGroupHomeworksSystem';
import LoadGroupGroupNotesSystem from '../../systems/LoadGroupNotesSystem';
import LoadGroupGroupSubtopicsSystem from '../../systems/LoadGroupSubtopicsSystem';
import GroupFlashcardSetView from '../flashcard-sets/GroupFlashcardSetView';
import GroupNoteView from '../notes/GroupNoteView';
import GroupSubtopicView from '../subtopics/GroupSubtopicView';
import DeleteGroupTopicAlert from './DeleteGroupTopicAlert';
import EditGroupGroupTopicSheet from './EditGroupTopicSheet';
import CloningResourceFromGroupSheet from '../CloningResourceFromGroupSheet';


const GroupTopicView = (props: TitleProps & EntityProps & DescriptionProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedGroupSchoolSubjectTitle } = useSelectedGroupSchoolSubject();
  const { selectedLanguage } = useSelectedLanguage();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditTopicSheet = () => lsc.stories.transitTo(Stories.EDETING_GROUP_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Stories.DELETING_GROUP_TOPIC_STORY);

  return (
    <Fragment>
      <LoadGroupGroupSubtopicsSystem />
      <LoadGroupGroupNotesSystem />
      <LoadGroupFlashcardSetsSystem />
      <LoadGroupHomeworksSystem />


      <View visible={isVisible}>
        <NavigationBar>

          <NavBarButton
            content={
              <Fragment>
                <ActionRow first onClick={openEditTopicSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteTopicAlert} icon={<IoTrashOutline />} destructive last>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>{selectedGroupSchoolSubjectTitle}</BackButton>
        <Title>{title}</Title>
        <Spacer size={4} />
        <SecondaryText>{props.description || displayAlertTexts(selectedLanguage).noDescription}</SecondaryText>
        <Spacer size={2} />

        <Spacer />
        {!hasChildren && <NoContentAddedHint />}

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.GROUP_SUBTOPIC) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={SubtopicCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.GROUP_NOTE) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={NoteCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.GROUP_FLASHCARD_SET) && isChildOfQuery(e, entity)}
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>

      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.GROUP_SUBTOPIC) && e.has(Tags.SELECTED) && isChildOfQuery(e, entity)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={GroupSubtopicView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.GROUP_NOTE) && isChildOfQuery(e, entity) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={GroupNoteView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.GROUP_FLASHCARD_SET) && isChildOfQuery(e, entity) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={GroupFlashcardSetView}
      />



      <DeleteGroupTopicAlert />
      <EditGroupGroupTopicSheet />
      <CloningResourceFromGroupSheet />
      
    </Fragment>
  );
}

export default GroupTopicView