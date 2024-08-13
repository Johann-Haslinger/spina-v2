import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierProps } from '@leanscope/ecs-models';
import { useContext } from 'react';
import {
  IoArrowDownCircleOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { AnswerFacet, QuestionFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataTypes, Stories } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../utils/displayText';
import { isChildOfQuery } from '../../../../utils/queries';
import { useEntityHasChildren } from '../../../collection/hooks/useEntityHasChildren';
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';
import LoadGroupFlashcardsSystem from '../../systems/LoadGroupFlashcardsSystem';
import DeleteGroupFlashcardSetAlert from './DeleteGroupFlashcardSetAlert';
import EditGroupFlashcardSetSheet from './EditGroupFlashcardSetSheet';
import GroupFlashcardCell from './GroupFlashcardCell';

const GroupFlashcardSetView = (props: TitleProps & EntityProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicTitle } = useSelectedGroupTopic();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditGroupFlashcardSetSheet = () => lsc.stories.transitTo(Stories.EDETING_GROUP_FLASHCARD_SET_STORY);
  const openDeleteGroupFlashcardSetAlert = () => lsc.stories.transitTo(Stories.DELETING_GROUP_FLASHCARD_SET_STORY);
  const openCloneResourceSheet = () => lsc.stories.transitTo(Stories.CLONING_RESOURCE_FROM_GROUP_STORY);

  return (
    <Fragment>
      <LoadGroupFlashcardsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton onClick={openCloneResourceSheet}>
            <IoArrowDownCircleOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoCreateOutline />} onClick={openEditGroupFlashcardSetSheet}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>

                <ActionRow destructive last icon={<IoTrashOutline />} onClick={openDeleteGroupFlashcardSetAlert}>
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
        {!hasChildren && <NoContentAddedHint />}
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => e.hasTag(DataTypes.GROUP_FLASHCARD) && isChildOfQuery(e, entity)}
            get={[[QuestionFacet, AnswerFacet], []]}
            onMatch={GroupFlashcardCell}
          />
        </CollectionGrid>
      </View>

      <EditGroupFlashcardSetSheet />
      <DeleteGroupFlashcardSetAlert />
    </Fragment>
  );
};

export default GroupFlashcardSetView;
