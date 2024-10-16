import { SelectedLanguageFacet } from '../../common/types/additionalFacets';
import { useAppState } from '../../features/collection/hooks/useAppState';
import { SupportedLanguage } from '../types/enums';

export const useSelectedLanguage = () => {
  const { appStateEntity } = useAppState();

  const selectedLanguage = appStateEntity?.get(SelectedLanguageFacet)?.props.selectedLanguage || SupportedLanguage.DE;

  const changeLanguage = (language: SupportedLanguage) => {
    appStateEntity?.add(new SelectedLanguageFacet({ selectedLanguage: language }));

    localStorage.setItem('language', language);
  };

  return { selectedLanguage, changeLanguage };
};
