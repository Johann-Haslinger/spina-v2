import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { Story } from '../../../base/enums';
import { addNotificationEntity } from '../../../common/utilities';
import { Alert, AlertButton } from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { displayActionTexts } from '../../../utils/displayText';

const deleteUserAccount = async (lsc: ILeanScopeClient, userId: string) => {
  const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('Error deleting user account:', deleteError.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen deines Benutzerkontos',
      message: deleteError.message,
      type: 'error',
    });
    return;
  }

  console.log('User account deleted successfully.');
};

const DeleteAccountAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_ACCOUNT_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_PROFILE_SETTINGS_STORY);
  const handleDeleteAccount = () => deleteUserAccount(lsc, userId);

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={handleDeleteAccount} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteAccountAlert;
