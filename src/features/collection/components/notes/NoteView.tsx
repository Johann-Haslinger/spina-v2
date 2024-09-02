import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, ImageFacet, ParentFacet, TextProps } from '@leanscope/ecs-models';
import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import {
  IoAdd,
  IoAlbumsOutline,
  IoArrowUpCircleOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoCopyOutline,
  IoEllipsisHorizontalCircleOutline,
  IoFolderOutline,
  IoHeadsetOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { v4 } from 'uuid';
import { DateAddedFacet, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  SecondaryText,
  Spacer,
  TextEditor,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { useBookmarked } from '../../../study/hooks/useBookmarked';
import { useFormattedDateAdded } from '../../hooks/useFormattedDateAdded';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadNotePodcastsSystem from '../../systems/LoadNotePodcastsSystem';
import LoadNoteTextSystem from '../../systems/LoadNoteTextSystem';
import GenerateFlashcardsSheet from '../generation/GenerateFlashcardsSheet';
import GenerateImprovedTextSheet from '../generation/GenerateImprovedTextSheet';
import GeneratePodcastSheet from '../generation/GeneratePodcastSheet';
import PodcastRow from '../podcasts/PodcastRow';
import DeleteNoteAlert from './DeleteNoteAlert';

const addFile = (lsc: ILeanScopeClient, entity: Entity, file: string) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const id = v4();

  if (!parentId) return;

  console.log('Adding file', file);
  const newFileEntity = new Entity();
  lsc.engine.addEntity(newFileEntity);
  newFileEntity.add(new IdentifierFacet({ guid: id }));
  newFileEntity.add(new ParentFacet({ parentId: parentId }));
  newFileEntity.add(new ImageFacet({ imageSrc: file }));
};

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);
  const { text, updateText } = useText(entity);
  const formattedDateAdded = useFormattedDateAdded(entity);
  const { openFilePicker, fileInput } = useFileSelector((file) => addFile(lsc, entity, file));
  const hasAttachedResources = useHastAttachedResources(entity);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_NOTE_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Story.GENERATING_FLASHCARDS_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Story.GENERATING_PODCAST_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);
  const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient
      .from(SupabaseTable.NOTES)
      .update({ title: value })
      .eq(SupabaseColumn.ID, guid);

    if (error) {
      console.error('Error updating note title', error);
    }
  };

  return (
    <Fragment>
      <LoadNoteTextSystem />
      <LoadNotePodcastsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <div>
                <ActionRow icon={<IoSparklesOutline />} first onClick={openImproveTextSheet}>
                  {displayActionTexts(selectedLanguage).improveText}
                </ActionRow>
                <ActionRow icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow last icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                  {displayActionTexts(selectedLanguage).generateFlashcards}
                </ActionRow>
              </div>
            }
          >
            <IoColorWandOutline />
          </NavBarButton>{' '}
          <NavBarButton
            content={
              <div>
                <ActionRow icon={<IoCopyOutline />} first onClick={() => {}}>
                  {displayActionTexts(selectedLanguage).addFlashcards}
                </ActionRow>
                <ActionRow last icon={<IoFolderOutline />} onClick={openFilePicker}>
                  {displayActionTexts(selectedLanguage).addFile}
                </ActionRow>
              </div>
            }
          >
            <IoAdd />
          </NavBarButton>
          <NavBarButton
            content={
              <div>
                <ActionRow first icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                  {isBookmarked
                    ? displayActionTexts(selectedLanguage).unbookmark
                    : displayActionTexts(selectedLanguage).bookmark}
                </ActionRow>
                <ActionRow icon={<IoArrowUpCircleOutline />} onClick={openAddResourceToLerningGroupSheet}>
                  {displayActionTexts(selectedLanguage).addToLearningGroup}
                </ActionRow>
                <ActionRow last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </div>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title editable onBlur={handleTitleBlur}>
          {title}
        </Title>
        <Spacer size={2} />
        <SecondaryText>{formattedDateAdded}</SecondaryText>
        <Spacer size={6} />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
        <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
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
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />

      {fileInput}
    </Fragment>
  );
};

export default NoteView;

// const AttachedFileCell = (props: TitleProps & EntityProps) => {};

const useHastAttachedResources = (entity: Entity) => {
  const [hasAttachedResources, setHasAttachedResources] = useState(false);
  const [attachedResourceEntities] = useEntities((e) => isChildOfQuery(e, entity) && e.has(ImageFacet));

  useEffect(() => {
    setHasAttachedResources(attachedResourceEntities.length > 0);
  }, [entity, attachedResourceEntities.length]);

  return hasAttachedResources;
};

const useFileSelector = (onFileSelect: (file: string) => void) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const maxWidth = 1080;
        const maxHeight = 180;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        context?.drawImage(image, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg');

        onFileSelect(resizedImage);
      };
    };

    if (selectedFile) reader.readAsDataURL(selectedFile);
    setIsSelectingImageSrc(false);
    return '';
  };

  const fileInput = isSelectingImageSrc && (
    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
  );

  return { openFilePicker, fileInput };
};
