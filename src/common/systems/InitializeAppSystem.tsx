import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { useContext, useEffect } from 'react';
import { SelectedLanguageFacet } from '../../common/types/additionalFacets';
import { AdditionalTag, SupportedLanguage, SupportedTheme } from '../types/enums';

const InitializeAppSystem = (props: { mockupData?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData = false } = props;

  useEffect(() => {
    const appStateEntity = new Entity();
    lsc.engine.addEntity(appStateEntity);
    appStateEntity.add(AdditionalTag.APP_STATE_ENTITY);
    appStateEntity.add(SupportedTheme.LIGHT);
    if (mockupData) {
      appStateEntity.add(AdditionalTag.MOCKUP_DATA);
    } else {
      appStateEntity.add(AdditionalTag.ONLINE);
    }
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      appStateEntity.add(storedTheme === 'dark' ? SupportedTheme.DARK : SupportedTheme.LIGHT);
    } else {
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDarkMode ? SupportedTheme.DARK : SupportedTheme.LIGHT;
      localStorage.setItem('theme', defaultTheme);
      appStateEntity.add(defaultTheme);
    }

    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage) {
      appStateEntity.add(
        new SelectedLanguageFacet({
          selectedLanguage: storedLanguage == 'en' ? SupportedLanguage.EN : SupportedLanguage.DE,
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
