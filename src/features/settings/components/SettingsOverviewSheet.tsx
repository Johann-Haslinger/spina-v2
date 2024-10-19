import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { PropsWithChildren, ReactNode, useContext } from 'react';
import { IoChevronForward, IoCreate, IoGrid, IoInformationCircle, IoPersonCircle, IoServer } from 'react-icons/io5';
import tw from 'twin.macro';
import { useUserData } from '../../../common/hooks/useUserData';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { Story } from '../../../common/types/enums';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import DataSettingsSheet from './DataSettingsSheet';
import GeneralSettingsSheet from './GeneralSettingsSheet';
import HelpAreaSheet from './HelpAreaSheet';
import ProfileSettingsSheet from './ProfileSettingsSheet';
import SchoolSubjectSettingsSheet from './SchoolSubjectSettingsSheet';

const SettingsOverviewSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);
  const { profilePicture, userEmail } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);
  const openProfileSettings = () => lsc.stories.transitTo(Story.OBSERVING_PROFILE_SETTINGS_STORY);
  const openGeneralSettings = () => lsc.stories.transitTo(Story.OBSERVING_GENERAL_SETTINGS_STORY);
  const openSchoolSubjectSettings = () => lsc.stories.transitTo(Story.OBSERVING_SCHOOL_SUBJECT_SETTINGS_STORY);
  const openDataSettings = () => lsc.stories.transitTo(Story.OBSERVING_DATA_SETTINGS_STORY);
  const openHelpArea = () => lsc.stories.transitTo(Story.OBSERVING_HELP_AREA_STORY);

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={navigateBack}>
        <FlexBox>
          <div />
          <CloseButton onClick={navigateBack} />
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow
            onClick={openProfileSettings}
            last
            icon={
              !profilePicture ? (
                <div tw="text-4xl text-secondary-text dark:text-secondary-text-dark">
                  <IoPersonCircle />
                </div>
              ) : (
                <div
                  style={{
                    backgroundImage: `url(${profilePicture})`,
                  }}
                  tw="size-9 bg-cover dark:bg-white rounded-full bg-black"
                />
              )
            }
          >
            <FlexBox>
              <div>
                <p tw="font-medium">{userEmail}</p>
                <p tw="text-sm text-secondary-text">Profil anzeigen</p>
              </div>
              <div tw="text-secondary-text opacity-50">
                <IoChevronForward />
              </div>
            </FlexBox>
          </SectionRow>
        </Section>
        <Spacer size={2} />
        <Section>
          <SettingsLink icon={<IoCreate />} color={COLOR_ITEMS[1].color} onClick={openGeneralSettings}>
            Allgemein
          </SettingsLink>
          <SettingsLink isLast icon={<IoGrid />} color={COLOR_ITEMS[2].color} onClick={openSchoolSubjectSettings}>
            Schulfächer
          </SettingsLink>
        </Section>
        <Spacer size={2} />
        <Section>
          <SettingsLink icon={<IoServer />} color={COLOR_ITEMS[3].color} onClick={openDataSettings}>
            Speicher und Daten
          </SettingsLink>
          <SettingsLink isLast icon={<IoInformationCircle />} color={COLOR_ITEMS[4].color} onClick={openHelpArea}>
            Hilfe
          </SettingsLink>
        </Section>
      </Sheet>

      <ProfileSettingsSheet />
      <GeneralSettingsSheet />
      <HelpAreaSheet />
      <SchoolSubjectSettingsSheet />
      <DataSettingsSheet />
    </div>
  );
};

export default SettingsOverviewSheet;

const SettingsLink = (
  props: { icon: ReactNode; color: string; onClick: () => void; isLast?: boolean } & PropsWithChildren,
) => {
  const { icon, color, onClick, children, isLast } = props;

  return (
    <SectionRow onClick={onClick} last={isLast} icon={<StyledLinkIcon color={color}>{icon}</StyledLinkIcon>}>
      <FlexBox>
        <p>{children}</p>
        <div tw="text-secondary-text opacity-50">
          <IoChevronForward />
        </div>
      </FlexBox>
    </SectionRow>
  );
};

const StyledLinkIcon = styled.div<{ color: string }>`
  ${tw` relative right-1 p-[0.3rem]  text-lg rounded-md`}
  color: ${({ color }) => color};
  background-color: ${({ color }) => color + 30};
`;

{
  /* <SectionRow last>
<FlexBox>
  <p>{displayLabelTexts(selectedLanguage).language}</p>
  <SelectInput value={selectedLanguage} onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}>
    {Object.values(SupportedLanguage).map((language) => (
      <option key={language} value={language}>
        {language}
      </option>
    ))}
  </SelectInput>
</FlexBox>
</SectionRow> */
}
