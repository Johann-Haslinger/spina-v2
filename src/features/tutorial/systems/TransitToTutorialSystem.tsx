import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useContext, useEffect } from 'react';
import { useLoadingIndicator } from '../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../common/hooks/useSchoolSubjects';
import { Story } from '../../../common/types/enums';

const TransitToTutorialSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  useEffect(() => {
    if (schoolSubjectEntities.length > 0 || isLoadingIndicatorVisible) return;

    lsc.stories.transitTo(Story.OBSERVING_TUTORIAL_STORY);
  }, [schoolSubjectEntities.length, isLoadingIndicatorVisible]);

  return null;
};

export default TransitToTutorialSystem;
