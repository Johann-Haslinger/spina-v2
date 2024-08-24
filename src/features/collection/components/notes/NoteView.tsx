import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierProps, TextProps } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import {
  IoAlbumsOutline,
  IoArrowUpCircleOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { DateAddedFacet, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, Story, SupabaseColumns, SupabaseTables } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
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
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadNotePodcastsSystem from '../../systems/LoadNotePodcastsSystem';
import LoadNoteTextSystem from '../../systems/LoadNoteTextSystem';
import GenerateFlashcardsSheet from '../generation/GenerateFlashcardsSheet';
import GenerateImprovedTextSheet from '../generation/GenerateImprovedTextSheet';
import GeneratePodcastSheet from '../generation/GeneratePodcastSheet';
import PodcastRow from '../podcasts/PodcastRow';
import DeleteNoteAlert from './DeleteNoteAlert';

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);
  const { text, updateText } = useText(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_NOTE_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Story.GENERATING_FLASHCARDS_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Story.GENERATING_PODCAST_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);
  const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient
      .from(SupabaseTables.NOTES)
      .update({ title: value })
      .eq(SupabaseColumns.ID, guid);

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
              <Fragment>
                <ActionRow icon={<IoSparklesOutline />} first onClick={openImproveTextSheet}>
                  {displayActionTexts(selectedLanguage).improveText}
                </ActionRow>
                <ActionRow icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow last icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                  {displayActionTexts(selectedLanguage).generateFlashcards}
                </ActionRow>
              </Fragment>
            }
          >
            <IoColorWandOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                  {isBookmarked
                    ? displayActionTexts(selectedLanguage).unbookmark
                    : displayActionTexts(selectedLanguage).bookmark}
                </ActionRow>
                <ActionRow icon={<IoArrowUpCircleOutline />} onClick={openAddResourceToLerningGroupSheet}>
                  {displayActionTexts(selectedLanguage).addToLearningGroup}
                </ActionRow>
                <ActionRow first last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title editable onBlur={handleTitleBlur}>
          {title}
        </Title>
        <Spacer />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
        <TextEditor value={text} onBlur={updateText} />
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />
    </Fragment>
  );
};

export default NoteView;
