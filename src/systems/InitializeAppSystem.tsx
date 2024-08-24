import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { useContext, useEffect } from 'react';
import { SelectedLanguageFacet } from '../app/additionalFacets';
import { AdditionalTags, SupportedLanguage, SupportedTheme } from '../base/enums';

const InitializeAppSystem = (props: { mockupData?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockupData = false } = props;

  useEffect(() => {
    const appStateEntity = new Entity();
    lsc.engine.addEntity(appStateEntity);
    appStateEntity.add(AdditionalTags.APP_STATE_ENTITY);
    appStateEntity.add(SupportedTheme.LIGHT);
    if (mockupData) {
      appStateEntity.add(AdditionalTags.MOCKUP_DATA);
    } else {
      appStateEntity.add(AdditionalTags.ONLINE);
    }

    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      appStateEntity.add(storedTheme === 'dark' ? SupportedTheme.DARK : SupportedTheme.LIGHT);
    } else {
      localStorage.setItem('theme', SupportedTheme.LIGHT);
      appStateEntity.add(SupportedTheme.LIGHT);
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
