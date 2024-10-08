import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useContext, useEffect } from 'react';
import { Story } from '../../../base/enums';

const TransitToTutorialSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    lsc.stories.transitTo(Story.OBSERVING_TUTORIAL_STORY);
    
  }, []);

  return null;
};

export default TransitToTutorialSystem;
