import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, EntityPropsMapper, useEntities, useEntityComponents } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, ImageFacet, Tags, TextFacet, UrlFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import {
  AnswerFacet,
  FilePathFacet,
  LearningUnitTypeProps,
  MasteryLevelFacet,
  PriorityProps,
  QuestionFacet,
  TitleFacet,
  TitleProps,
} from '../../../../app/additionalFacets';
import {
  AdditionalTag,
  DataType,
  LearningUnitPriority,
  LearningUnitType,
  LearningUnitViews,
  Story,
} from '../../../../base/enums';
import FlashcardQuizView from '../../../../common/components/flashcards/FlashcardQuizView';
import { updatePriority } from '../../../../common/utilities';
import {
  BackButton,
  CollectionGrid,
  NoContentAddedHint,
  SecondaryText,
  Spacer,
  TextEditor,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useUserData } from '../../../../hooks/useUserData';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { useDueFlashcards } from '../../../flashcards';
import { addFileToLearningUnit } from '../../functions/addFileToLearningUnit';
import { useFileSelector } from '../../hooks/useFileSelector';
import { useFormattedDateAdded } from '../../hooks/useFormattedDateAdded';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadFlashcardsSystem from '../../systems/LoadFlashcardsSystem';
import LoadLearningUnitFilesSystem from '../../systems/LoadLearningUnitFilesSystem';
import AddFlashcardsSheet from '../flashcard-sets/AddFlashcardsSheet';
import EditFlashcardSheet from '../flashcard-sets/EditFlashcardSheet';
import FlashcardCell from '../flashcard-sets/FlashcardCell';
import GenerateFlashcardsSheet from '../generation/GenerateFlashcardsSheet';
import GenerateImprovedTextSheet from '../generation/GenerateImprovedTextSheet';
import GeneratePodcastSheet from '../generation/GeneratePodcastSheet';
import DeleteLearningUnitAlert from './DeleteLearningUnitAlert';
import FileRow from './FileRow';
import FileViewer from './FileViewer';
import LearningUnitNavBar from './LearningUnitNavBar';
import LearningUnitTitle from './LearningUnitTitle';
import StyleActionSheet from './StyleActionSheet';

const StyledSelect = styled.select<{ value: LearningUnitPriority }>`
  ${tw`bg-secondary dark:bg-primary-dark  transition-all outline-none`}
`;

const LearningUnitView = (
  props: TitleProps & IdentifierProps & EntityProps & LearningUnitTypeProps & PriorityProps,
) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, type, priority } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);
  const { text, updateText, updateValue } = useText(entity);
  const { userId } = useUserData();
  const formattedDateAdded = useFormattedDateAdded(entity);
  const { openFilePicker, fileInput } = useFileSelector((file) => addFileToLearningUnit(lsc, entity, file, userId));
  const hasAttachedResources = useHastAttachedResources(entity);
  const { currentView, setCurrentView } = useCurrentView(type);
  const hasFlashcards = useHasFlashcards(entity);
  const { dueFlashcardEntity } = useDueFlashcards();
  const [textFacet] = useEntityComponents(entity, TextFacet);
  const isGeneratingImprovedTextViewVisible = useIsStoryCurrent(Story.GENERATING_IMPROVED_TEXT_STORY);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);

  useEffect(() => {
    updateValue(textFacet?.props.text || '');
  }, [currentView, isGeneratingImprovedTextViewVisible]);

  return (
    <div>
      <LoadFlashcardsSystem />
      <LoadLearningUnitFilesSystem />

      <View visible={isVisible}>
        <LearningUnitNavBar currentView={currentView} openFilePicker={openFilePicker} entity={entity} type={type} />

        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <LearningUnitTitle {...props} />
        <Spacer size={2} />
        <SecondaryText>
          {formattedDateAdded}
          {type !== LearningUnitType.NOTE && (
            <span>
              ,{' '}
              <StyledSelect
                onChange={(e) =>
                  updatePriority(lsc, entity, Number(e.target.value) as LearningUnitPriority, dueFlashcardEntity)
                }
                value={priority}
                defaultValue={0}
              >
                <option value={LearningUnitPriority.ACTIVE}>Aktiv</option>
                <option value={LearningUnitPriority.MAINTAINING}>Aufrechterhalten</option>
                <option value={LearningUnitPriority.PAUSED}>Pausiert</option>
              </StyledSelect>
            </span>
          )}
        </SecondaryText>
        <Spacer size={6} />
        {type == LearningUnitType.MIXED && <Tabbar currentView={currentView} changeCurrentView={setCurrentView} />}

        {currentView == LearningUnitViews.FLASHCARDS ? (
          <div>
            <Spacer size={2} />
            <CollectionGrid columnSize="large">
              <EntityPropsMapper
                query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.FLASHCARD)}
                get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
                onMatch={FlashcardCell}
              />
            </CollectionGrid>

            {!hasFlashcards && <NoContentAddedHint />}
          </div>
        ) : (
          <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
        )}
        <Spacer />
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

        <div tw="z-[100]">
          <EntityPropsMapper
            query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.FILE)}
            get={[[FilePathFacet, TitleFacet], []]}
            onMatch={FileRow}
          />
        </div>
      </View>

      <DeleteLearningUnitAlert />
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
        query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.FILE) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet, UrlFacet, FilePathFacet], []]}
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

const useHasFlashcards = (entity: Entity) => {
  const [flashcardEntities] = useEntities((e) => isChildOfQuery(e, entity) && e.has(DataType.FLASHCARD));

  return flashcardEntities.length > 0;
};

const StyledTabbar = styled.div`
  ${tw` mb-8  transition-all dark:bg-secondary-dark bg-tertiary w-fit rounded-full `}
`;

const StyledTab = styled.button<{ active: boolean }>`
  ${tw`text-secondary-text  transition-all w-28 rounded-full  px-3 py-1`}
  ${({ active }) => active && tw`text-white bg-black dark:bg-white dark:text-black transition-all `}
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
