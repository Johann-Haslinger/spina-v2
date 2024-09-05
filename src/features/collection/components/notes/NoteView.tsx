import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import {
  IdentifierFacet,
  IdentifierProps,
  ImageFacet,
  ParentFacet,
  Tags,
  TextProps,
  UrlFacet,
  UrlProps,
} from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import saveAs from 'file-saver';
import { motion } from 'framer-motion';
import { MouseEvent as ButtonMouseEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import {
  IoAdd,
  IoAlbumsOutline,
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoCopyOutline,
  IoDocumentOutline,
  IoEllipsisHorizontalCircleOutline,
  IoFolderOutline,
  IoHeadsetOutline,
  IoImageOutline,
  IoSparklesOutline,
  IoTextOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import {
  DateAddedFacet,
  FileFacet,
  TitleFacet,
  TitleProps,
  TypeFacet,
  TypeProps,
} from '../../../../app/additionalFacets';
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
import { useSelection } from '../../../../hooks/useSelection';
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
import FileViewer from './FileViewer';
import StyleActionSheet from './StyleActionSheet';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: string;
}

const addFile = async (lsc: ILeanScopeClient, entity: Entity, file: UploadedFile) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const id = v4();

  if (!parentId) return;

  const newFileEntity = new Entity();
  lsc.engine.addEntity(newFileEntity);
  newFileEntity.add(new IdentifierFacet({ guid: id }));
  newFileEntity.add(new ParentFacet({ parentId: parentId }));
  newFileEntity.add(new TypeFacet({ type: file.type }));
  newFileEntity.add(new UrlFacet({ url: file.url }));
  newFileEntity.add(new FileFacet({ file: file.file }));
  newFileEntity.add(new TitleFacet({ title: file.file.name }));

  // const { error } = await supabaseClient
  //   .from(SupabaseTable.FILES)
  //   .insert([{ id, parentId, type: file.type, url: file.url, file: file, title: file.file.name }]);

  // if (error) {
  //   console.error('Error adding file', error);
  // }
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
  const isEditTextStyleSheetVisible = useIsStoryCurrent(Story.EDITING_TEXT_STYLE_STORY);
  const hasSelection = useSelection();

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_NOTE_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Story.GENERATING_FLASHCARDS_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Story.GENERATING_PODCAST_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);
  const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const openEditTextStyleSheet = () => lsc.stories.transitTo(Story.EDITING_TEXT_STYLE_STORY);

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

  const handleButtonClick = (event: ButtonMouseEvent<HTMLButtonElement>) => {
    if (!hasSelection) return;

    event.preventDefault();
    event.stopPropagation();
    openEditTextStyleSheet();
  };

  return (
    <Fragment>
      <LoadNoteTextSystem />
      <LoadNotePodcastsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <button onClick={handleButtonClick}>
            <NavBarButton blocked={!hasSelection}>
              <IoTextOutline style={{ opacity: isEditTextStyleSheetVisible ? '0.5' : '1' }} />
            </NavBarButton>{' '}
          </button>
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

        <div>
          <EntityPropsMapper
            query={(e) => isChildOfQuery(e, entity) && e.has(FileFacet)}
            get={[[FileFacet, TitleFacet, UrlFacet, TypeFacet], []]}
            onMatch={FileRow}
          />
        </div>
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />
      <StyleActionSheet />

      <EntityPropsMapper
        query={(e) => isChildOfQuery(e, entity) && e.has(FileFacet) && e.hasTag(Tags.SELECTED)}
        get={[[FileFacet, TitleFacet, UrlFacet], []]}
        onMatch={FileViewer}
      />

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

const useFileSelector = (onFileSelect: (file: UploadedFile) => void) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        onFileSelect({ id: Date.now().toString(), file, url, type: file.type });
      });
    }
  };

  const fileInput = isSelectingImageSrc && (
    <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} style={{ display: 'none' }} />
  );

  return { openFilePicker, fileInput };
};

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 items-center pl-2 justify-between py-2 border-b border-black border-opacity-5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-seconderyText`}
`;

const StyledIcon = styled.div`
  ${tw`text-xl hover:opacity-50 text-seconderyText`}
`;

const FileRow = (props: TitleProps & UrlProps & EntityProps & TypeProps) => {
  const { entity, url, title, type } = props;
  const [isHovered, setIsHovered] = useState(false);

  const donwnloadFile = () => saveAs(url, title);
  const openFile = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledRowWrapper key={entity.id} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        onClick={openFile}
        tw="flex items-center space-x-6 pl-4 "
      >
        <div tw="text-2xl text-primaryColor">
          {' '}
          {type.startsWith('image/') ? <IoImageOutline /> : <IoDocumentOutline />}
        </div>
        <div>
          <StyledTitle>{title}</StyledTitle>
          <StyledDueDate>Zum Öffnen klicken</StyledDueDate>
        </div>
      </motion.div>
      <StyledIcon>
        <IoArrowDownCircleOutline onClick={donwnloadFile} />
      </StyledIcon>
    </StyledRowWrapper>
  );
};
