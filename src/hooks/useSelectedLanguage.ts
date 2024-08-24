import { SelectedLanguageFacet } from '../app/additionalFacets';
import { SupportedLanguage } from '../base/enums';
import { useAppState } from '../features/collection/hooks/useAppState';

export const useSelectedLanguage = () => {
  const { appStateEntity } = useAppState();

  const selectedLanguage = appStateEntity?.get(SelectedLanguageFacet)?.props.selectedLanguage || SupportedLanguage.DE;

  const changeLanguage = (language: SupportedLanguage) => {
    appStateEntity?.add(new SelectedLanguageFacet({ selectedLanguage: language }));

    localStorage.setItem('language', language);
  };

  return { selectedLanguage, changeLanguage };
};
