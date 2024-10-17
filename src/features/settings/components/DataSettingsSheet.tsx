import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../common/hooks/useUserData';
import { AdditionalTag, DataType, Story, SupabaseTable } from '../../../common/types/enums';
import { addNotificationEntity } from '../../../common/utilities';
import { displayActionTexts } from '../../../common/utilities/displayText';
import { dataTypeQuery } from '../../../common/utilities/queries';
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
import supabaseClient from '../../../lib/supabase';

const archiveAllTopics = async (lsc: ILeanScopeClient, userId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).update({ is_archived: true }).eq('user_id', userId);

  if (error) {
    console.error('Error archiving topics:', error.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Archivieren deiner Themen',
      message: error.message,
      type: 'error',
    });
    return;
  }

  lsc.engine.entities.filter((e) => dataTypeQuery(e, DataType.TOPIC)).forEach((e) => e.add(AdditionalTag.ARCHIVED));
};

const deleteAllTopics = async (lsc: ILeanScopeClient, userId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).delete().eq('user_id', userId);

  if (error) {
    console.error('Error deleting topics:', error.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen deiner Themen',
      message: error.message,
      type: 'error',
    });
    return;
  }

  lsc.engine.entities.filter((e) => dataTypeQuery(e, DataType.TOPIC)).forEach((e) => lsc.engine.removeEntity(e));
};

const deleteUserAccount = async (lsc: ILeanScopeClient, userId: string) => {
  const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('Error deleting user account:', deleteError.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen deines Accounts',
      message: deleteError.message,
      type: 'error',
    });

    return;
  }
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
      deleteUserAccount(lsc, userId);
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
