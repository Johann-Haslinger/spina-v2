import { useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags, SupportedThemes } from "../../../base/enums";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";



export const useSelectedTheme = () => {
  const [appStateEntity] = useEntity((e) =>
    e.has(AdditionalTags.APP_STATE_ENTITY)
  );

  const [darkTheme] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.DARK_THEME
  );

  const changeTheme = (theme: SupportedThemes) => {
   if (theme === SupportedThemes.DARK) {
      appStateEntity?.add(AdditionalTags.DARK_THEME);
      appStateEntity?.remove(AdditionalTags.LIGHT_THEME);
    } else {
      appStateEntity?.add(AdditionalTags.LIGHT_THEME);
      appStateEntity?.remove(AdditionalTags.DARK_THEME);
    }
  }

  return { isDarkMode: darkTheme, changeMode: changeTheme };
};
