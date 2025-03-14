import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { Story, SupportedTheme } from '../../../common/types/enums';
import { displayLabelTexts } from '../../../common/utilities/displayText';
import { CloseButton, FlexBox, Section, SectionRow, SelectInput, Sheet, Spacer } from '../../../components';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';

const GeneralSettingsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_GENERAL_SETTINGS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { isDarkModeActive, changeTheme } = useSelectedTheme();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last icon={isDarkModeActive ? <IoMoonOutline /> : <IoSunnyOutline />}>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).theme}</p>
            <SelectInput
              value={isDarkModeActive ? SupportedTheme.DARK : SupportedTheme.LIGHT}
              onChange={(e) => changeTheme(e.target.value as SupportedTheme)}
            >
              <option value={SupportedTheme.DARK}>Dark</option>
              <option value={SupportedTheme.LIGHT}>Light</option>
            </SelectInput>
          </FlexBox>
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default GeneralSettingsSheet;
