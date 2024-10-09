import { useEntity, useEntityComponents, useEntityHasTags } from '@leanscope/ecs-engine';
import { ColorFacet } from '@leanscope/ecs-models';
import { AdditionalTag, SupportedTheme } from '../../../base/enums';

export const useSelectedTheme = () => {
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTag.APP_STATE_ENTITY));
  const [isDarkModeActive] = useEntityHasTags(appStateEntity, SupportedTheme.DARK);
  const [colorFacet] = useEntityComponents(appStateEntity, ColorFacet);
  const customTheme = colorFacet?.props?.colorName;

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

  return { isDarkModeActive, changeTheme, customTheme };
};
