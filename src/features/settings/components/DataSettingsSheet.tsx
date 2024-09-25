import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { AdditionalTag, DataType, Story, SupabaseTable } from '../../../base/enums';
import {
  Alert,
  AlertButton,
  CloseButton,
  FlexBox,
  SecondaryText,
  Section,
  SectionRow,
  Sheet,
  Spacer,
} from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { displayActionTexts } from '../../../utils/displayText';
import { dataTypeQuery } from '../../../utils/queries';

const archiveAllTopics = async (lsc: ILeanScopeClient, userId: string) => {
  lsc.engine.entities.filter((e) => dataTypeQuery(e, DataType.TOPIC)).forEach((e) => e.add(AdditionalTag.ARCHIVED));

  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).update({ is_archived: true }).eq('user_id', userId);

  if (error) {
    console.error('Error archiving topics:', error.message);
  }
};

const deleteAllTopics = async (lsc: ILeanScopeClient, userId: string) => {
  lsc.engine.entities.filter((e) => dataTypeQuery(e, DataType.TOPIC)).forEach((e) => lsc.engine.removeEntity(e));

  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).delete().eq('user_id', userId);

  if (error) {
    console.error('Error deleting topics:', error.message);
  }
};

const deleteUserAccount = async (userId: string) => {
  const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('Error deleting user account:', deleteError.message);
    return;
  }

  console.log('User account deleted successfully.');
};

enum DeleteAlert {
  DELETE_TOPICS,
  DELETE_ACCOUNT,
}

const DataSettingsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_DATA_SETTINGS_STORY);
  const { userId } = useUserData();
  const [deleteAlert, setDeleteAlert] = useState<DeleteAlert | null>(null);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);
  const dismissDeleteAlert = () => setDeleteAlert(null);

  const handleDeleteAlertClick = () => {
    if (deleteAlert === DeleteAlert.DELETE_TOPICS) {
      deleteAllTopics(lsc, userId);
    } else if (deleteAlert === DeleteAlert.DELETE_ACCOUNT) {
      deleteUserAccount(userId);
    }
  };

  return (
    <div>
      <Sheet navigateBack={navigateBack} visible={isVisible}>
        <FlexBox>
          <div />
          <CloseButton onClick={navigateBack} />
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow onClick={() => archiveAllTopics(lsc, userId)}>Alle Themen archivieren</SectionRow>
          <SectionRow onClick={() => setDeleteAlert(DeleteAlert.DELETE_TOPICS)} last role="destructive">
            Alle Themen löschen
          </SectionRow>
        </Section>
        <Spacer size={2} />
        <Section>
          <SectionRow>
            <SecondaryText> Daten Exortieren</SecondaryText>
          </SectionRow>
          <SectionRow onClick={() => setDeleteAlert(DeleteAlert.DELETE_ACCOUNT)} last role="destructive">
            Account löschen
          </SectionRow>
        </Section>
        <Spacer size={2} />
      </Sheet>

      <Alert navigateBack={dismissDeleteAlert} visible={deleteAlert !== null}>
        <AlertButton onClick={dismissDeleteAlert} role="primary">
          {displayActionTexts(selectedLanguage).cancel}
        </AlertButton>
        <AlertButton onClick={handleDeleteAlertClick} role="destructive">
          {displayActionTexts(selectedLanguage).delete}
        </AlertButton>
      </Alert>
    </div>
  );
};

export default DataSettingsSheet;
