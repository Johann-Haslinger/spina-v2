import React from "react";
import { SupportedLanguages } from "../base/enums";
import { SELECTED_LANGUAGE } from "../base/constants";

const useSelectedLanguage = (): SupportedLanguages => {
  return SELECTED_LANGUAGE;
};

export default useSelectedLanguage;
