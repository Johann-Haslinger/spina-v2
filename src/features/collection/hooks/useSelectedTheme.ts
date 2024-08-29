import { useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { AdditionalTag, SupportedTheme } from '../../../base/enums';

export const useSelectedTheme = () => {
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTag.APP_STATE_ENTITY));
  const [isDarkModeAktiv] = useEntityHasTags(appStateEntity, SupportedTheme.DARK);

  const changeTheme = (theme: SupportedTheme) => {
    if (theme === SupportedTheme.DARK) {
      appStateEntity?.add(SupportedTheme.DARK);
      appStateEntity?.remove(SupportedTheme.LIGHT);
      localStorage.setItem('theme', SupportedTheme.DARK);
    } else {
      appStateEntity?.add(SupportedTheme.LIGHT);
      appStateEntity?.remove(SupportedTheme.DARK);
      localStorage.setItem('theme', SupportedTheme.LIGHT);
    }
  };

  return { isDarkModeAktive: isDarkModeAktiv, changeTheme };
};
