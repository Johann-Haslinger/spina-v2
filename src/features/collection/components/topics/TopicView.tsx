import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, EntityPropsMapper, useEntityHasTags } from '@leanscope/ecs-engine';
import {
  DescriptionProps,
  IdentifierFacet,
  ImageFacet,
  ImageProps,
  ParentFacet,
  Tags,
  TextFacet,
} from '@leanscope/ecs-models';
import { useContext, useState } from 'react';
import {
  IoAdd,
  IoArchiveOutline,
  IoArrowBack,
  IoArrowUpCircleOutline,
  IoCameraOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { useLoadingIndicator } from '../../../../common/hooks';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { useWindowDimensions } from '../../../../common/hooks/useWindowDimensions';
import {
  DateAddedFacet,
  LearningUnitTypeFacet,
  SourceFacet,
  TitleFacet,
  TitleProps,
} from '../../../../common/types/additionalFacets';
import { AdditionalTag, DataType, LearningUnitType, Story, SupabaseTable } from '../../../../common/types/enums';
import { addLearningUnit } from '../../../../common/utilities/addLeaningUnit';
import { displayActionTexts, displayDataTypeTexts } from '../../../../common/utilities/displayText';
import { dataTypeQuery, isChildOfQuery, learningUnitTypeQuery } from '../../../../common/utilities/queries';
import { sortEntitiesByDateAdded, sortEntitiesByDueDate } from '../../../../common/utilities/sortEntitiesByTime';
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
import supabaseClient from '../../../../lib/supabase';
import AddResourceToLearningGroupSheet from '../../../groups/components/AddResourceToLearningGroupSheet';
import { useEntityHasChildren } from '../../hooks/useEntityHasChildren';
import { useSelectedSchoolSubjectGrid } from '../../hooks/useSchoolSubjectGrid';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import LoadHomeworksSystem from '../../systems/LoadHomeworksSystem';
import LoadLearningUnitsSystem from '../../systems/LoadLearningUnitsSystem';
import AddFlashcardSetSheet from '../flashcard-sets/AddFlashcardSetSheet';
import GeneratingLearningUnitFromImageSheet from '../generation/generate-learning-unit-from-image/GeneratingLearningUnitFromImageSheet';
import AddHomeworkSheet from '../homeworks/AddHomeworkSheet';
import HomeworkCell from '../homeworks/HomeworkCell';
import LearningUnitCell from '../learning_units/LearningUnitCell';
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

const changeIsArchived = async (entity: Entity, value: boolean) => {
  const id = entity.get(IdentifierFacet)?.props.guid;

  if (value) {
    entity.addTag(AdditionalTag.ARCHIVED);
    entity.remove(ImageFacet);
  } else {
    entity.removeTag(AdditionalTag.ARCHIVED);

    const { data, error } = await supabaseClient.from(SupabaseTable.TOPICS).select('image_url').eq('id', id).single();

    if (error) {
      console.error('Error fetching image url:', error);
    }

    if (data) {
      const imageUrl = data.image_url;
      entity.add(new ImageFacet({ imageSrc: imageUrl }));
    }
  }

  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).update({ is_archived: value }).eq('id', id);

  if (error) {
    console.error('Error updating archived status:', error);
  }
};

const StyledTopAreaWrapper = styled.div<{ image: string; grid: boolean; containImage: boolean }>`
  ${tw`w-full bg-center top-0 z-0 mt-14 xl:mt-0  h-48 md:h-[16rem] xl:h-72 2xl:h-80  flex`}
  background-image: ${({ image }) => `url(${image})`};
  ${({ containImage }) => !containImage && tw`bg-cover`}
`;

const StyledTopicResourcesWrapper = styled.div<{ largeShadow: boolean }>`
  ${tw` px-4  md:px-20 h-fit min-h-screen     pt-10 pb-40  dark:bg-primary-dark transition-all   bg-primary  lg:px-32 xl:px-60 2xl:px-96 w-full`}
  ${({ largeShadow }) =>
    largeShadow
      ? tw`shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.6)] xl:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] `
      : tw`shadow-[0px_0px_20px_0px_rgba(0, 0, 0, 0.1)]  `}
`;

const StyledNavbarBackground = styled.div`
  ${tw`w-full xl:h-0 h-14 bg-primary z-[50] fixed top-0 left-0 dark:bg-primary-dark`}
`;

const StyledImageOverlay = styled.div<{ overlay?: string }>`
  ${tw`w-full  flex flex-col justify-end h-full overflow-visible`}
  ${({ overlay }) => overlay && tw`bg-black  bg-opacity-30  `}
`;

const StyledBackButton = styled.div`
  ${tw` size-10  relative top-5 transition-all md:hover:scale-105 text-2xl ml-4 md:ml-20 lg:ml-32 xl:ml-60 2xl:ml-96 dark:bg-tertiary-dark dark:text-white bg-tertiary  text-black rounded-full flex justify-center items-center`}
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
  const [isArchived] = useEntityHasTags(entity, AdditionalTag.ARCHIVED);
  const { isLoadingIndicatorVisible } = useLoadingIndicator();
  const { color, backgroundColor } = useSelectedSchoolSubjectColor();

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openEditTopicSheet = () => lsc.stories.transitTo(Story.EDITING_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Story.DELETING_TOPIC_STORY);
  const openAddFlashcardSetSheet = () => lsc.stories.transitTo(Story.ADDING_FLASHCARD_SET_STORY);
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

  const handleChangeIsArchivedClick = () => {
    navigateBack();

    setTimeout(() => changeIsArchived(entity, !isArchived), 300);
  };

  const containImage = imageSrc?.startsWith('https://bnveuhstbhqhfinemehx') || false;
  const iconColor = scrollY < 270 && width > 1280 ? 'white' : '';

  return (
    <div>
      <LoadLearningUnitsSystem />
      <LoadHomeworksSystem />

      <View
        handleScroll={(e) => {
          const scrollY = e.currentTarget.scrollTop;
          setScrollY(scrollY);
        }}
        hidePadding
        visible={isVisible}
      >
        <StyledTopicViewContainer>
          <StyledNavbarBackground />
          <NavigationBar white={iconColor == 'white'} tw="bg-black">
            <NavBarButton
              content={
                <div>
                  <ActionRow first icon={<IoAdd />} onClick={saveNote}>
                    {displayDataTypeTexts(selectedLanguage).note}
                  </ActionRow>
                  <ActionRow icon={<IoAdd />} onClick={openAddFlashcardSetSheet}>
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
              color={iconColor}
            >
              <IoAdd />
            </NavBarButton>

            <NavBarButton
              content={
                <div>
                  <ActionRow first onClick={openEditTopicSheet} icon={<IoCreateOutline />}>
                    {displayActionTexts(selectedLanguage).edit}
                  </ActionRow>
                  <ActionRow
                    onClick={handleChangeIsArchivedClick}
                    icon={isArchived ? <IoArrowUpCircleOutline /> : <IoArchiveOutline />}
                  >
                    {!isArchived
                      ? displayActionTexts(selectedLanguage).archivate
                      : displayActionTexts(selectedLanguage).deArchivate}
                  </ActionRow>

                  <ActionRow onClick={openDeleteTopicAlert} icon={<IoTrashOutline />} destructive last>
                    {displayActionTexts(selectedLanguage).delete}
                  </ActionRow>
                </div>
              }
              color={iconColor}
            >
              <IoEllipsisHorizontalCircleOutline />
            </NavBarButton>
          </NavigationBar>
          <StyledTopAreaWrapper containImage={containImage} grid={!imageSrc} image={imageSrc || grid}>
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
                  {isLoadingIndicatorVisible ? (
                    <div tw="w-full opacity-15">
                      <Skeleton borderRadius={4} tw="w-full h-3" baseColor={color} highlightColor={backgroundColor} />
                      <Skeleton borderRadius={4} tw="w-1/2 h-3" baseColor={color} highlightColor={backgroundColor} />
                    </div>
                  ) : hasChildren ? (
                    description
                  ) : (
                    "Drücke auf das Plus Symbol, um etwas zu '" + title + "' hinzuzufügen."
                  )}
                </SecondaryText>
              </div>
              <Spacer size={8} />
            </div>
            {!isLoadingIndicatorVisible && (
              <div>
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
                    sort={(a, b) => sortEntitiesByDueDate(a, b)}
                    onMatch={HomeworkCell}
                  />
                </CollectionGrid>
              </div>
            )}
          </StyledTopicResourcesWrapper>
        </StyledTopicViewContainer>
      </View>

      <AddHomeworkSheet />
      <AddFlashcardSetSheet />

      <DeleteTopicAlert />
      <EditTopicSheet />
      <GeneratingLearningUnitFromImageSheet />
      <AddResourceToLearningGroupSheet />
    </div>
  );
};

export default TopicView;
