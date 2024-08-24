import { useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { AdditionalTags, SupportedThemes } from '../../../base/enums';

export const useSelectedTheme = () => {
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTags.APP_STATE_ENTITY));
  const [isDarkModeAktiv] = useEntityHasTags(appStateEntity, SupportedThemes.DARK);

  const changeTheme = (theme: SupportedThemes) => {
    if (theme === SupportedThemes.DARK) {
      appStateEntity?.add(SupportedThemes.DARK);
      appStateEntity?.remove(SupportedThemes.LIGHT);
      localStorage.setItem('theme', SupportedThemes.DARK);
    } else {
      appStateEntity?.add(SupportedThemes.LIGHT);
      appStateEntity?.remove(SupportedThemes.DARK);
      localStorage.setItem('theme', SupportedThemes.LIGHT);
    }
  };

  return { isDarkModeAktive: isDarkModeAktiv, changeTheme };
};
