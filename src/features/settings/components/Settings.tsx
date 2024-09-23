import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { PropsWithChildren, ReactNode, useContext } from 'react';
import {
  IoChevronForward,
  IoCreateOutline,
  IoGridOutline,
  IoInformationCircleOutline,
  IoPersonCircle,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../../base/constants';
import { Story } from '../../../base/enums';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import { useUserData } from '../../../hooks/useUserData';

const Settings = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_SETTINGS_STORY);
  const { profilePicture, userEmail } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow
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
        <SettingsLink icon={<IoCreateOutline />} color={COLOR_ITEMS[1].color} onClick={() => {}}>
          Allgemein
        </SettingsLink>
        <SettingsLink isLast icon={<IoGridOutline />} color={COLOR_ITEMS[2].color} onClick={() => {}}>
          Schulfächer
        </SettingsLink>
      </Section>
      <Spacer size={2} />
      <Section>
        <SettingsLink isLast icon={<IoInformationCircleOutline />} color={COLOR_ITEMS[3].color} onClick={() => {}}>
          Hilfe
        </SettingsLink>
      </Section>
    </Sheet>
  );
};

export default Settings;

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

// <FlexBox>
//   <p>{displayLabelTexts(selectedLanguage).theme}</p>
//   <SelectInput value={theme} onChange={(e) => changeMode(e.target.value as SupportedTheme)}>
//     <option value={SupportedTheme.DARK}>Dark</option>
//     <option value={SupportedTheme.LIGHT}>Light</option>
//   </SelectInput>
// </FlexBox>;
