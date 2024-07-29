import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { useContext, useEffect } from "react";
import { SelectedLanguageFacet } from "../app/additionalFacets";
import {
  AdditionalTags,
  SupportedLanguages,
  SupportedThemes,
} from "../base/enums";

const InitializeAppSystem = (props: { mockupData?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData = false } = props;

  useEffect(() => {
    const appStateEntity = new Entity();
    lsc.engine.addEntity(appStateEntity);
    appStateEntity.add(AdditionalTags.APP_STATE_ENTITY);
    appStateEntity.add(SupportedThemes.LIGHT);
    if (mockupData) {
      appStateEntity.add(AdditionalTags.MOCKUP_DATA);
    } else {
      appStateEntity.add(AdditionalTags.ONLINE);
    }

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      appStateEntity.add(
        storedTheme === "dark" ? SupportedThemes.DARK : SupportedThemes.LIGHT,
      );
    } else {
      localStorage.setItem("theme", SupportedThemes.LIGHT);
      appStateEntity.add(SupportedThemes.LIGHT);
    }

    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
      appStateEntity.add(
        new SelectedLanguageFacet({
          selectedLanguage:
            storedLanguage == "en"
              ? SupportedLanguages.EN
              : SupportedLanguages.DE,
        }),
      );
    }

    return () => {
      lsc.engine.removeEntity(appStateEntity);
    };
  }, []);

  return null;
};

export default InitializeAppSystem;
