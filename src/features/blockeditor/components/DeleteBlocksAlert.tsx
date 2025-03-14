import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { DataType, Story, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { displayActionTexts } from '../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../components';
import supabaseClient from '../../../lib/supabase';

const DeleteBlocksAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_BLOCKS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [selectedBlockEntities] = useEntities((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_BLOCKEDITOR_STORY);

  const deleteSelectedBlocks = async () => {
    navigateBack();

    selectedBlockEntities.forEach(async (blockEntity) => {
      lsc.engine.removeEntity(blockEntity);

      const id = blockEntity.get(IdentifierFacet)?.props.guid;

      const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).delete().eq(SupabaseColumn.ID, id);

      if (error) {
        console.error('Error deleting block from supabase:', error);
      }
    });
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteSelectedBlocks} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteBlocksAlert;
