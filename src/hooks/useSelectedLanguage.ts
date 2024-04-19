import React from "react";
import { SupportedLanguages } from "../base/enums";
import { useAppState } from "../features/collection/hooks/useAppState";
import { SelectedLanguageFacet } from "../app/AdditionalFacets";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";

export const useSelectedLanguage = () => {
  const { appStateEntity } = useAppState();
  const [selectedLanguageFacet] = useEntityFacets(appStateEntity, SelectedLanguageFacet);
  const selectedLanguage = selectedLanguageFacet?.selectedLanguage || SupportedLanguages.EN;

  const changeLanguage = (language: SupportedLanguages) => {
    console.log("Changing language to", language);
    appStateEntity?.add(new SelectedLanguageFacet({ selectedLanguage: language }));

  }

  return { selectedLanguage, changeLanguage };
};
