import { useAppState } from "../../collection/hooks/useAppState";
import { FlexBox, SaveButton, Section, SectionRow, SelectInput, Sheet, Spacer } from "../../../components";
import { useSelectedTheme } from "../../collection/hooks/useSelectedTheme";
import { SupportedLanguages, SupportedThemes } from "../../../base/enums";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";

const Settings = () => {
  const { isSettingVisible, toggleSettings } = useAppState();
  const { changeTheme: changeMode, isDarkMode } = useSelectedTheme();
  const { selectedLanguage, changeLanguage } = useSelectedLanguage();
  const theme = isDarkMode ? SupportedThemes.DARK : SupportedThemes.LIGHT;

  const navigateBack = () => toggleSettings();

  return (
    <Sheet visible={isSettingVisible} navigateBack={toggleSettings}>
      <SaveButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).done}</SaveButton>
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
