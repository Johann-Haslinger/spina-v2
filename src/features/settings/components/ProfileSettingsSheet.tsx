import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { IoLogOutOutline, IoTrashOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { useUserData } from '../../../common/hooks/useUserData';
import { Story } from '../../../common/types/enums';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import DeleteAccountAlert from './DeleteAccountAlert';

const StyledSecondaryText = tw.p`text-sm text-secondary-text`;

const ProfileSettingsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_PROFILE_SETTINGS_STORY);

  const { userEmail, signOut } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);
  const openDeleteAccountAlert = () => lsc.stories.transitTo(Story.DELETING_ACCOUNT_STORY);

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={navigateBack}>
        <FlexBox>
          <div />
          <CloseButton onClick={navigateBack} />
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow>{userEmail}</SectionRow>
          <SectionRow last>
            <StyledSecondaryText>Während der Testläufe kannst du deine Email Adresse nicht ändern.</StyledSecondaryText>
          </SectionRow>
        </Section>
        <Spacer />
        <Section>
          <SectionRow onClick={signOut} role="destructive" icon={<IoLogOutOutline />}>
            Abmelden
          </SectionRow>
          <SectionRow last onClick={openDeleteAccountAlert} role="destructive" icon={<IoTrashOutline />}>
            Account löschen
          </SectionRow>
        </Section>
      </Sheet>

      <DeleteAccountAlert />
    </div>
  );
};

export default ProfileSettingsSheet;
