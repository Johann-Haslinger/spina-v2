import { useContext, useEffect } from "react";
import { Entity } from "@leanscope/ecs-engine";
import { AdditionalTags, SupportedLanguages } from "../base/enums";
import { SelectedLanguageFacet as SelectedLanguageFacet } from "../app/AdditionalFacets";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const AppInitSystem = (props: { mockupData?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData = false } = props;

  useEffect(() => {
    const appStateEntity = new Entity();
    lsc.engine.addEntity(appStateEntity);
    appStateEntity.add(AdditionalTags.APP_STATE_ENTITY);
    appStateEntity.add(AdditionalTags.LIGHT_THEME);
    if (mockupData) {
      appStateEntity.add(AdditionalTags.MOCKUP_DATA);
    }

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      appStateEntity.add(storedTheme === "dark" ? AdditionalTags.DARK_THEME : AdditionalTags.LIGHT_THEME);
    } else {
      localStorage.setItem("theme", AdditionalTags.LIGHT_THEME);
      appStateEntity.add(AdditionalTags.LIGHT_THEME);
    }

    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
      appStateEntity.add(
        new SelectedLanguageFacet({
          selectedLanguage: storedLanguage == "de" ? SupportedLanguages.DE : SupportedLanguages.EN,
        })
      );
    } else {
      localStorage.setItem("language", SupportedLanguages.EN);
      appStateEntity.add(new SelectedLanguageFacet({ selectedLanguage: SupportedLanguages.EN }));
    }

    return () => {
      lsc.engine.removeEntity(appStateEntity);
    };
  }, []);

  return null;
};

export default AppInitSystem;
