import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { DescriptionProps, IdentifierFacet, ImageProps, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { Fragment, useContext, useState } from 'react';
import {
  IoAdd,
  IoArrowBack,
  IoCameraOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import {
  DateAddedFacet,
  DueDateFacet,
  LearningUnitTypeFacet,
  SourceFacet,
  TitleFacet,
  TitleProps,
} from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, LearningUnitType, Story } from '../../../../base/enums';
import {
  ActionRow,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  SecondaryText,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { addLearningUnit } from '../../../../functions/addLeaningUnit';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../../hooks/useUserData';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';
import { displayActionTexts, displayDataTypeTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery, learningUnitTypeQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import AddResourceToLearningGroupSheet from '../../../groups/components/AddResourceToLearningGroupSheet';
import { useEntityHasChildren } from '../../hooks/useEntityHasChildren';
import { useSelectedSchoolSubjectGrid } from '../../hooks/useSchoolSubjectGrid';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import LoadHomeworksSystem from '../../systems/LoadHomeworksSystem';
import LoadLearningUnitsSystm from '../../systems/LoadLearningUnitsSystm';
import ExerciseView from '../exercises/ExerciseView';
import AddFlashcardSetSheet from '../flashcard-sets/AddFlashcardSetSheet';
import GenerateResourcesFromImageSheet from '../generation/GenerateResourcesFromImageSheet';
import AddHomeworkSheet from '../homeworks/AddHomeworkSheet';
import HomeworkCell from '../homeworks/HomeworkCell';
import HomeworkView from '../homeworks/HomeworkView';
import LearningUnitCell from '../learning_units/LearningUnitCell';
import LearningUnitView from '../learning_units/LearningUnitView';
import DeleteTopicAlert from './DeleteTopicAlert';
import EditTopicSheet from './EditTopicSheet';

const useImageSelector = () => {
  const lsc = useContext(LeanScopeClientContext);

  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImagePromptEntity = new Entity();
        lsc.engine.addEntity(newImagePromptEntity);
        newImagePromptEntity.add(new SourceFacet({ source: base64 }));
        newImagePromptEntity.add(AdditionalTag.GENERATE_FROM_IMAGE_PROMPT);

        lsc.stories.transitTo(Story.GENERATING_RESOURCES_FROM_IMAGE);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageSelector = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', handleImageUpload);
    fileInput.click();
  };

  return {
    openImageSelector,
  };
};

const StyledTopAreaWrapper = styled.div<{ image: string; grid: boolean }>`
  ${tw`w-full  top-0 z-0 mt-14 xl:mt-0 h-64 md:h-[16rem] xl:h-96 2xl:h-[24rem]  flex`}
  background-image: ${({ image }) => `url(${image})`};
  ${({ grid }) => (grid ? tw`bg-contain  md:bg-fixed` : tw`bg-cover `)}
`;

const StyledTopicResourcesWrapper = styled.div<{ largeShadow: boolean }>`
  ${tw` px-4  md:px-20 h-fit min-h-screen     pt-10 pb-40  dark:bg-primaryDark transition-all   bg-primary  lg:px-32 xl:px-60 2xl:px-96 w-full`}
  ${({ largeShadow }) =>
    largeShadow
      ? tw`shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.6)] xl:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] `
      : tw`shadow-[0px_0px_20px_0px_rgba(0, 0, 0, 0.1)]  `}
`;

const StyledNavbarBackground = styled.div`
  ${tw`w-full xl:h-0 h-14 bg-primary  absolute top-0 left-0 dark:bg-primaryDark`}
`;

const StyledImageOverlay = styled.div<{ overlay?: string }>`
  ${tw`w-full  flex flex-col justify-end h-full overflow-visible`}
  ${({ overlay }) => overlay && tw`bg-black  bg-opacity-30  `}
`;

const StyledBackButton = styled.div`
  ${tw` size-10  relative top-5 transition-all md:hover:scale-105 text-2xl ml-4 md:ml-20 lg:ml-32 xl:ml-60 2xl:ml-96 bg-tertiary  text-black rounded-full flex justify-center items-center`}
`;

const StyledTopicViewContainer = styled.div`
  ${tw`w-full overflow-x-hidden h-full`}
`;

const TopicView = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, imageSrc, description } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { openImageSelector } = useImageSelector();
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();
  const [scrollY, setScrollY] = useState(0);
  const { width } = useWindowDimensions();
  const grid = useSelectedSchoolSubjectGrid();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openEditTopicSheet = () => lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Story.DELETING_TOPIC_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Story.ADDING_FLASHCARD_SET_STORY);
  const openAddHomeworkSheet = () => lsc.stories.transitTo(Story.ADDING_HOMEWORK_STORY);

  const saveNote = async () => {
    if (selectedTopicId) {
      const noteId = v4();

      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: noteId }));
      newNoteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
      newNoteEntity.add(new TitleFacet({ title: '' }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.NOTE }));
      newNoteEntity.add(DataType.LEARNING_UNIT);
      newNoteEntity.add(Tags.SELECTED);

      addLearningUnit(lsc, newNoteEntity, userId);
    }
  };

  return (
    <Fragment>
      <LoadLearningUnitsSystm />
      <LoadHomeworksSystem />

      <View hidePadding visible={isVisible}>
        <StyledTopicViewContainer
          onScroll={(e) => {
            const scrollY = e.currentTarget.scrollTop;
            setScrollY(scrollY);
          }}
        >
          <StyledNavbarBackground />
          <NavigationBar white={scrollY < 360 && width > 1280} tw="bg-black">
            <NavBarButton
              content={
                <div>
                  <ActionRow first icon={<IoAdd />} onClick={saveNote}>
                    {displayDataTypeTexts(selectedLanguage).note}
                  </ActionRow>
                  <ActionRow icon={<IoAdd />} onClick={openAddFlashcardsSheet}>
                    {displayDataTypeTexts(selectedLanguage).flashcardSet}
                  </ActionRow>
                  <ActionRow icon={<IoAdd />} hasSpace onClick={openAddHomeworkSheet}>
                    {displayDataTypeTexts(selectedLanguage).homework}
                  </ActionRow>
                  <ActionRow icon={<IoCameraOutline />} onClick={openImageSelector} last>
                    {displayActionTexts(selectedLanguage).generateFromImage}
                  </ActionRow>
                </div>
              }
            >
              <IoAdd color={scrollY < 360 && width > 1280 ? 'white' : ''} />
            </NavBarButton>

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
              <IoEllipsisHorizontalCircleOutline color={scrollY < 360 && width > 1280 ? 'white' : ''} />
            </NavBarButton>
          </NavigationBar>
          <StyledTopAreaWrapper grid={!imageSrc} image={imageSrc || grid}>
            <StyledImageOverlay overlay={imageSrc}>
              <StyledBackButton onClick={navigateBack}>
                <IoArrowBack />
              </StyledBackButton>
            </StyledImageOverlay>
          </StyledTopAreaWrapper>

          <StyledTopicResourcesWrapper largeShadow={imageSrc ? true : false}>
            <div tw="h-fit w-full">
              <Spacer />
              <Title>{title}</Title>
              {(description || !hasChildren) && <Spacer size={2} />}
              <div tw="md:w-4/5 ">
                <SecondaryText>
                  {hasChildren ? description : "Drücke auf das Plus Symbol, um etwas zu '" + title + "' hinzuzufügen."}
                </SecondaryText>
              </div>
              <Spacer size={8} />
            </div>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => learningUnitTypeQuery(e, LearningUnitType.MIXED) && isChildOfQuery(e, entity)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => learningUnitTypeQuery(e, LearningUnitType.NOTE) && isChildOfQuery(e, entity)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => learningUnitTypeQuery(e, LearningUnitType.FLASHCARD_SET) && isChildOfQuery(e, entity)}
                get={[[TitleFacet, IdentifierFacet], []]}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && isChildOfQuery(e, entity)}
                get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                onMatch={HomeworkCell}
              />
            </CollectionGrid>
          </StyledTopicResourcesWrapper>
        </StyledTopicViewContainer>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet, LearningUnitTypeFacet], []]}
        onMatch={LearningUnitView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet, DueDateFacet], []]}
        onMatch={HomeworkView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.EXERCISE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={ExerciseView}
      />

      <AddHomeworkSheet />
      <AddFlashcardSetSheet />

      <DeleteTopicAlert />
      <EditTopicSheet />
      <GenerateResourcesFromImageSheet />
      <AddResourceToLearningGroupSheet />
    </Fragment>
  );
};

export default TopicView;
