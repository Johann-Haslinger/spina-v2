import { SelectedLanguageFacet } from '../app/additionalFacets';
import { SupportedLanguages } from '../base/enums';
import { useAppState } from '../features/collection/hooks/useAppState';

export const useSelectedLanguage = () => {
  const { appStateEntity } = useAppState();

  const selectedLanguage = appStateEntity?.get(SelectedLanguageFacet)?.props.selectedLanguage || SupportedLanguages.DE;

  const changeLanguage = (language: SupportedLanguages) => {
    appStateEntity?.add(new SelectedLanguageFacet({ selectedLanguage: language }));

    localStorage.setItem('language', language);
  };

  return { selectedLanguage, changeLanguage };
};
