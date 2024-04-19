import { SupportedLanguages } from "../base/enums";
import { Facet } from "../base/facet";

export interface TitleProps {
  title: string;
}

export class TitleFacet extends Facet<TitleProps>{
  constructor(props: TitleProps) {
    super(props);
  }
}
export interface SelectedLanguageProps {
  selectedLanguage: SupportedLanguages;
}

export class SelectedLanguageFacet extends Facet<SelectedLanguageProps>{
  constructor(props: SelectedLanguageProps) {
    super(props);
  }
}