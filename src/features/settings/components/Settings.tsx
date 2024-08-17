import { SupportedLanguages, SupportedThemes } from '../../../base/enums';
import { FlexBox, PrimaryButton, Section, SectionRow, SelectInput, Sheet, Spacer } from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { displayButtonTexts, displayLabelTexts } from '../../../utils/displayText';
import { useAppState } from '../../collection/hooks/useAppState';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';

const Settings = () => {
  const { isSettingVisible, toggleSettings } = useAppState();
  const { changeTheme: changeMode, isDarkModeAktiv: isDarkMode } = useSelectedTheme();
  const { selectedLanguage, changeLanguage } = useSelectedLanguage();
  const theme = isDarkMode ? SupportedThemes.DARK : SupportedThemes.LIGHT;

  const navigateBack = () => toggleSettings();

  return (
    <Sheet visible={isSettingVisible} navigateBack={toggleSettings}>
      <PrimaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).done}</PrimaryButton>
      <Spacer />
      <Section>
        <SectionRow>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).theme}</p>
            <SelectInput value={theme} onChange={(e) => changeMode(e.target.value as SupportedThemes)}>
              <option value={SupportedThemes.DARK}>Dark</option>
              <option value={SupportedThemes.LIGHT}>Light</option>
            </SelectInput>
          </FlexBox>
        </SectionRow>
        <SectionRow last>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).language}</p>
            <SelectInput
              value={selectedLanguage}
              onChange={(e) => changeLanguage(e.target.value as SupportedLanguages)}
            >
              {Object.values(SupportedLanguages).map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </SelectInput>
          </FlexBox>
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default Settings;
