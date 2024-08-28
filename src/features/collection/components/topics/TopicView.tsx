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
import { DateAddedFacet, SourceFacet, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, Story } from '../../../../base/enums';
import {
  ActionRow,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  View,
} from '../../../../components';
import { addNote } from '../../../../functions/addNote';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../../hooks/useUserData';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';
import { displayActionTexts, displayDataTypeTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import AddResourceToLearningGroupSheet from '../../../groups/components/AddResourceToLearningGroupSheet';
import { useEntityHasChildren } from '../../hooks/useEntityHasChildren';
import { useSelectedSchoolSubjectGrid } from '../../hooks/useSchoolSubjectGrid';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import LoadChaptersSystem from '../../systems/LoadChapterSystem';
import LoadExercisesSystem from '../../systems/LoadExercisesSystem';
import LoadFlashcardSetsSystem from '../../systems/LoadFlashcardSetsSystem';
import LoadHomeworksSystem from '../../systems/LoadHomeworksSystem';
import LoadNotesSystem from '../../systems/LoadNotesSystem';
import LoadSubtopicsSystem from '../../systems/LoadSubtopicsSystem';
import ChapterEditor from '../chapter/ChaptersEditor';
import ExerciseCell from '../exercises/ExerciseCell';
import ExerciseView from '../exercises/ExerciseView';
import AddFlashcardSetSheet from '../flashcard-sets/AddFlashcardSetSheet';
import FlashcardSetCell from '../flashcard-sets/FlashcardSetCell';
import FlashcardSetView from '../flashcard-sets/FlashcardSetView';
import GenerateResourcesFromImageSheet from '../generation/GenerateResourcesFromImageSheet';
import AddHomeworkSheet from '../homeworks/AddHomeworkSheet';
import HomeworkCell from '../homeworks/HomeworkCell';
import HomeworkView from '../homeworks/HomeworkView';
import NoteCell from '../notes/NoteCell';
import NoteView from '../notes/NoteView';
import SubtopicCell from '../subtopics/SubtopicCell';
import SubtopicView from '../subtopics/SubtopicView';
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
        newImagePromptEntity.add(AdditionalTags.GENERATE_FROM_IMAGE_PROMPT);

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
  ${tw`w-full  top-0 z-0 mt-14 xl:mt-0 h-64 md:h-[21rem] xl:h-96 2xl:h-[28rem] bg-contain   flex md:bg-fixed`}
  background-image: ${({ image }) => `url(${image})`};
  ${({ grid }) => (grid ? tw`bg-contain` : tw`bg-auto`)}
`;

const StyledTopicTitle = styled.div`
  ${tw` pr-4 text-4xl w-full md:w-[40rem] pl-4 md:pl-20 lg:pl-32 xl:pl-60 2xl:pl-96 text-white font-bold`}
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
  ${tw`w-full pb-4 md:pb-8 flex flex-col justify-end h-full overflow-visible`}
  ${({ overlay }) => overlay && tw`bg-black  bg-opacity-30  `}
`;

const StyledBackButton = styled.div`
  ${tw` size-9 mb-4  transition-all md:hover:scale-105 text-xl ml-4 md:ml-20 lg:ml-32 xl:ml-60 2xl:ml-96 bg-white bg-opacity-25 backdrop-blur-lg text-white rounded-full flex justify-center items-center`}
`;

const StyledTopicViewContainer = styled.div`
  ${tw`w-full overflow-x-hidden h-full`}
`;

// const StyledChapterWrapper = styled.div`
//   ${tw`divide-y transition-all dark:bg-seconderyDark dark:bg-opacity-80 dark:divide-primaryBorderDark bg-tertiary px-4 py-2 rounded-xl bg-opacity-40 divide-primaryBorder  mb-10`}
// `;

// const StyledBetaBadge = styled.div`
//   ${tw`bg-primaryColor text-primaryColor font-bold hover:opacity-70 transition-all w-fit bg-opacity-10 text-sm rounded-lg mb-4 px-4 py-1`}
// `;

const TopicView = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, imageSrc } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { openImageSelector } = useImageSelector();
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();
  const [scrollY, setScrollY] = useState(0);
  const { width } = useWindowDimensions();
  const grid = useSelectedSchoolSubjectGrid();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
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
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(DataType.NOTE);
      newNoteEntity.add(Tags.SELECTED);

      addNote(lsc, newNoteEntity, userId);
    }
  };

  return (
    <Fragment>
      <LoadNotesSystem />
      <LoadFlashcardSetsSystem />
      <LoadHomeworksSystem />
      <LoadSubtopicsSystem />
      <LoadExercisesSystem />
      <LoadChaptersSystem />

      <View hidePadding visible={isVisible}>
        <StyledTopicViewContainer
          onScroll={(e) => {
            const scrollY = e.currentTarget.scrollTop;
            setScrollY(scrollY);
          }}
        >
          <StyledNavbarBackground />
          <NavigationBar tw="bg-black">
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
              <div tw="h-fit w-full">
                <StyledBackButton onClick={navigateBack}>
                  <IoArrowBack />
                </StyledBackButton>
                <StyledTopicTitle>{title}</StyledTopicTitle>
              </div>
            </StyledImageOverlay>
          </StyledTopAreaWrapper>

          <StyledTopicResourcesWrapper largeShadow={imageSrc ? true : false}>
            {/* <StyledBetaBadge>BETA</StyledBetaBadge>
            <StyledChapterWrapper>
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.CHAPTER) && isChildOfQuery(e, entity)}
                sort={(a, b) => (a.get(OrderFacet)?.props.orderIndex || 0) - (b.get(OrderFacet)?.props.orderIndex || 0)}
                get={[[TitleFacet, OrderFacet], []]}
                onMatch={ChapterCell}
              />
              <AddChapterButton />
            </StyledChapterWrapper> */}

            {!hasChildren && <NoContentAddedHint />}

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.SUBTOPIC) && isChildOfQuery(e, entity)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={SubtopicCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.NOTE) && isChildOfQuery(e, entity)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={NoteCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.EXERCISE) && isChildOfQuery(e, entity)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={ExerciseCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && isChildOfQuery(e, entity)}
                get={[[TitleFacet, IdentifierFacet], []]}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                onMatch={FlashcardSetCell}
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
        query={(e) => dataTypeQuery(e, DataType.NOTE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={NoteView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        onMatch={HomeworkView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={SubtopicView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.EXERCISE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={ExerciseView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.CHAPTER) && e.has(Tags.SELECTED)}
        get={[[ParentFacet], []]}
        onMatch={ChapterEditor}
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
