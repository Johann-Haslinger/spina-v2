import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { AdditionalTag, DataType, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { dataTypeQuery } from '../../../../utils/queries';

const DeletePodcastAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const [selectedPodcastEntity] = useEntity((e) => e.has(AdditionalTag.DELETE) && dataTypeQuery(e, DataType.PODCAST));
  const selectedPodcastId = selectedPodcastEntity?.get(IdentifierFacet)?.props.guid;

  const navigateBack = () => selectedPodcastEntity?.remove(AdditionalTag.DELETE);
  const deletePodcast = async () => {
    navigateBack();
    if (selectedPodcastEntity) {
      lsc.engine.removeEntity(selectedPodcastEntity);

      const { error } = await supabaseClient
        .from(SupabaseTable.PODCASTS)
        .delete()
        .eq(SupabaseColumn.ID, selectedPodcastId);

      if (error) {
        console.error('Error deleting podcast', error);
      }
    }
  };

  return (
    <Alert visible={selectedPodcastId !== undefined}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deletePodcast} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeletePodcastAlert;
