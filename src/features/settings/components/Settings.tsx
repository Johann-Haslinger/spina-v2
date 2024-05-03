import { useAppState } from "../../collection/hooks/useAppState";
import { Sheet } from "../../../components";
import { useSelectedTheme } from "../../collection/hooks/useSelectedTheme";
import { SupportedLanguages, SupportedThemes } from "../../../base/enums";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";

const Settings = () => {
  const { isSettingVisible, toggleSettings } = useAppState();
  const { changeTheme: changeMode, isDarkMode } = useSelectedTheme();
  const { selectedLanguage, changeLanguage } = useSelectedLanguage();
  const theme = isDarkMode ? SupportedThemes.DARK : SupportedThemes.LIGHT;

  return (
    <Sheet visible={isSettingVisible} navigateBack={toggleSettings}>
      Settings
      <select value={theme} onChange={(e) => changeMode(e.target.value as SupportedThemes)}>
        <option value={SupportedThemes.DARK}>Dark</option>
        <option value={SupportedThemes.LIGHT}>Light</option>
      </select>
      <select value={selectedLanguage} onChange={(e) => changeLanguage(e.target.value as SupportedLanguages)}>
        {Object.values(SupportedLanguages).map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </Sheet>
  );
};

export default Settings;
