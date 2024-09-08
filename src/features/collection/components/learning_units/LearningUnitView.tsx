import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, ImageFacet, Tags, UrlFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import {
  AnswerFacet,
  FileFacet,
  LearningUnitTypeProps,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
  TitleProps,
  TypeFacet,
} from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, LearningUnitType, LearningUnitViews } from '../../../../base/enums';
import { BackButton, CollectionGrid, SecondaryText, Spacer, TextEditor, View } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import FlashcardQuizView from '../../../study/components/FlashcardQuizView';
import { addFileToLearningUnit } from '../../functions/addFileToLearningUnit';
import { useFileSelector } from '../../hooks/useFileSelector';
import { useFormattedDateAdded } from '../../hooks/useFormattedDateAdded';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadFlashcardsSystem from '../../systems/LoadFlashcardsSystem';
import AddFlashcardsSheet from '../flashcard-sets/AddFlashcardsSheet';
import EditFlashcardSheet from '../flashcard-sets/EditFlashcardSheet';
import FlashcardCell from '../flashcard-sets/FlashcardCell';
import GenerateFlashcardsSheet from '../generation/GenerateFlashcardsSheet';
import GenerateImprovedTextSheet from '../generation/GenerateImprovedTextSheet';
import GeneratePodcastSheet from '../generation/GeneratePodcastSheet';
import LearningUnit from './DeleteLearningUnitAlert';
import FileRow from './FileRow';
import FileViewer from './FileViewer';
import LearningUnitNavBar from './LearningUnitNavBar';
import LearningUnitTitle from './LearningUnitTitle';
import StyleActionSheet from './StyleActionSheet';

const LearningUnitView = (props: TitleProps & IdentifierProps & EntityProps & LearningUnitTypeProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, type } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);
  const { text, updateText } = useText(entity);
  const formattedDateAdded = useFormattedDateAdded(entity);
  const { openFilePicker, fileInput } = useFileSelector((file) => addFileToLearningUnit(lsc, entity, file));
  const hasAttachedResources = useHastAttachedResources(entity);
  const { currentView, setCurrentView } = useCurrentView(type);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);

  return (
    <div>
      <LoadFlashcardsSystem />

      <View visible={isVisible}>
        <LearningUnitNavBar currentView={currentView} openFilePicker={openFilePicker} entity={entity} type={type} />

        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <LearningUnitTitle {...props} />
        <Spacer size={2} />
        <SecondaryText>{formattedDateAdded}</SecondaryText>
        <Spacer size={6} />
        {type == LearningUnitType.MIXED && <Tabbar currentView={currentView} changeCurrentView={setCurrentView} />}

        {currentView == LearningUnitViews.FLASHCARDS ? (
          <CollectionGrid columnSize="large">
            <EntityPropsMapper
              query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.FLASHCARD)}
              get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
              onMatch={FlashcardCell}
            />
          </CollectionGrid>
        ) : (
          <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
        )}

        {hasAttachedResources && (
          <div>
            <Spacer size={6} />
            <EntityPropsMapper
              query={(e) => isChildOfQuery(e, entity) && e.has(ImageFacet)}
              get={[[ImageFacet], []]}
              onMatch={(props) => <img src={props.imageSrc} alt="Attached resource" />}
            />
          </div>
        )}

        <div>
          <EntityPropsMapper
            query={(e) => isChildOfQuery(e, entity) && e.has(FileFacet)}
            get={[[FileFacet, TitleFacet, UrlFacet, TypeFacet], []]}
            onMatch={FileRow}
          />
        </div>
      </View>

      <LearningUnit />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />
      <StyleActionSheet />
      <AddFlashcardsSheet />
      <FlashcardQuizView />

      <EntityPropsMapper
        query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.FLASHCARD) && e.hasTag(Tags.SELECTED)}
        get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
        onMatch={EditFlashcardSheet}
      />

      <EntityPropsMapper
        query={(e) => isChildOfQuery(e, entity) && e.has(FileFacet) && e.hasTag(Tags.SELECTED)}
        get={[[FileFacet, TitleFacet, UrlFacet], []]}
        onMatch={FileViewer}
      />

      {fileInput}
    </div>
  );
};

export default LearningUnitView;

const useHastAttachedResources = (entity: Entity) => {
  const [hasAttachedResources, setHasAttachedResources] = useState(false);
  const [attachedResourceEntities] = useEntities((e) => isChildOfQuery(e, entity) && e.has(ImageFacet));

  useEffect(() => {
    setHasAttachedResources(attachedResourceEntities.length > 0);
  }, [entity, attachedResourceEntities.length]);

  return hasAttachedResources;
};

const StyledTabbar = styled.div`
  ${tw` mb-6 dark:bg-seconderyDark bg-tertiary w-fit rounded-full `}
`;

const StyledTab = styled.button<{ active: boolean; color: string }>`
  ${tw`text-seconderyText  w-28 rounded-full  px-3 py-1`}
  ${({ active }) =>
    active && tw`text-white bg-black dark:bg-white dark:text-black transition-all `} /* background-color: ${({
    color,
    active,
  }) => active && color}; */
`;

const Tabbar = (props: { currentView: LearningUnitViews; changeCurrentView: (view: LearningUnitViews) => void }) => {
  const { changeCurrentView, currentView } = props;
  const { color } = useSelectedSchoolSubjectColor();

  return (
    <StyledTabbar>
      <StyledTab
        color={color}
        active={currentView == LearningUnitViews.NOTE}
        onClick={() => changeCurrentView(LearningUnitViews.NOTE)}
      >
        Notiz
      </StyledTab>
      <StyledTab
        color={color}
        active={currentView == LearningUnitViews.FLASHCARDS}
        onClick={() => changeCurrentView(LearningUnitViews.FLASHCARDS)}
      >
        Karten
      </StyledTab>
    </StyledTabbar>
  );
};

const useCurrentView = (type: LearningUnitType) => {
  const [initialLearningUnitType] = useState(type);
  const [currentView, setCurrentView] = useState(
    type == LearningUnitType.FLASHCARD_SET ? LearningUnitViews.FLASHCARDS : LearningUnitViews.NOTE,
  );

  useEffect(() => {
    if (initialLearningUnitType != type && type == LearningUnitType.MIXED) {
      setCurrentView(
        currentView == LearningUnitViews.FLASHCARDS ? LearningUnitViews.NOTE : LearningUnitViews.FLASHCARDS,
      );
    }
  }, [type]);

  return { currentView, setCurrentView };
};
