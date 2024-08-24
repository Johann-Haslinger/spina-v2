import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierProps } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoArrowDownCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { DateAddedFacet, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, Story, SupabaseColumns, SupabaseTables } from '../../../../base/enums';
import { ActionRow, NavBarButton, View } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import Blockeditor from '../../../blockeditor/components/Blockeditor';
import InitializeBlockeditorSystem from '../../../blockeditor/systems/InitializeBlockeditorSystem';
import GenerateFlashcardsSheet from '../../../collection/components/generation/GenerateFlashcardsSheet';
import GeneratePodcastSheet from '../../../collection/components/generation/GeneratePodcastSheet';
import PodcastRow from '../../../collection/components/podcasts/PodcastRow';
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';
import DeleteGroupNoteAlert from './DeleteGroupAlert';

const GroupNoteView = (props: TitleProps & IdentifierProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const { selectedGroupTopicTitle } = useSelectedGroupTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_GROUP_NOTE_STORY);
  const openCloneResourceSheet = () => lsc.stories.transitTo(Story.CLONING_RESOURCE_FROM_GROUP_STORY);

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient
      .from(SupabaseTables.GROUP_NOTES)
      .update({ title: value })
      .eq(SupabaseColumns.ID, guid);

    if (error) {
      console.error('Error updating group note title', error);
    }
  };

  return (
    <Fragment>
      <InitializeBlockeditorSystem isGroupBlockeditor blockeditorId={guid} />

      <View visible={isVisible}>
        <Blockeditor
          id={guid}
          handleTitleBlur={handleTitleBlur}
          title={title}
          backbuttonLabel={selectedGroupTopicTitle}
          navigateBack={navigateBack}
          customHeaderArea={
            <div>
              <EntityPropsMapper
                query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.PODCAST)}
                get={[[TitleFacet, DateAddedFacet], []]}
                onMatch={PodcastRow}
              />
            </div>
          }
          customEditOptions={
            <NavBarButton onClick={openCloneResourceSheet}>
              <IoArrowDownCircleOutline />
            </NavBarButton>
          }
          customActionRows={
            <Fragment>
              <ActionRow first last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </Fragment>
          }
        />
      </View>

      <DeleteGroupNoteAlert />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
    </Fragment>
  );
};

export default GroupNoteView;
