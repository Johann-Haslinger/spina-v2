import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { Story } from '../../../base/enums';
import { BackButton, NavigationBar, View } from '../../../components';

const HomeworkArchive = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_HOMEWORKS_ARCHIVE_STORY);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_HOMEWORKS_STORY);

  return (
    <View visible={isVisible}>
      <NavigationBar />
      <BackButton navigateBack={navigateBack} />
    </View>
  );
};

export default HomeworkArchive;
