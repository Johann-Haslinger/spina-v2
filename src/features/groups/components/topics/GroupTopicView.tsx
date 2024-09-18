import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { DescriptionProps, IdentifierFacet } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  SecondaryText,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts, displayAlertTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import FlashcardSetCell from '../../../collection/components/flashcard-sets/FlashcardSetCell';
import LearningUnitCell from '../../../collection/components/learning_units/LearningUnitCell';
import { useEntityHasChildren } from '../../../collection/hooks/useEntityHasChildren';
import { useSelectedGroupSchoolSubject } from '../../hooks/useSelectedGroupSchoolSubject';
import CloningResourceFromGroupSheet from '../CloningResourceFromGroupSheet';
import DeleteGroupTopicAlert from './DeleteGroupTopicAlert';
import EditGroupGroupTopicSheet from './EditGroupTopicSheet';

const GroupTopicView = (props: TitleProps & EntityProps & DescriptionProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedGroupSchoolSubjectTitle } = useSelectedGroupSchoolSubject();
  const { selectedLanguage } = useSelectedLanguage();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openEditTopicSheet = () => lsc.stories.transitTo(Story.EDITING_GROUP_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Story.DELETING_GROUP_TOPIC_STORY);

  return (
    <Fragment>
      {/* TODO: implement homeworks and flashcard sets to group topic view */}

      {/* <LoadGroupFlashcardSetsSystem />
      <LoadGroupHomeworksSystem /> */}

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
            query={(e) => dataTypeQuery(e, DataType.GROUP_SUBTOPIC) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.GROUP_NOTE) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={LearningUnitCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.GROUP_FLASHCARD_SET) && isChildOfQuery(e, entity)}
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>
      </View>

      <DeleteGroupTopicAlert />
      <EditGroupGroupTopicSheet />
      <CloningResourceFromGroupSheet />
    </Fragment>
  );
};

export default GroupTopicView;
