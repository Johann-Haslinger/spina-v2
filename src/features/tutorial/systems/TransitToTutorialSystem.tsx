import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useContext, useEffect } from 'react';
import { useLoadingIndicator } from '../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../common/hooks/useSchoolSubjects';
import { Story } from '../../../common/types/enums';

import { useLocation } from 'react-router-dom';

const TransitToTutorialSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();
  const location = useLocation();

  useEffect(() => {
    if (schoolSubjectEntities.length > 0 || isLoadingIndicatorVisible || location.pathname === '/verified-email') return;

    lsc.stories.transitTo(Story.OBSERVING_TUTORIAL_STORY);
  }, [schoolSubjectEntities.length, isLoadingIndicatorVisible, location.pathname]);

  return null;
};

export default TransitToTutorialSystem;
