import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DateAddedFacet, SourceFacet, TitleFacet } from './app/additionalFacets';
import { DataType, NavigationLink, Story } from './base/enums';
import { NotificationMenu } from './common/components/notifications';
import { InitializeLoadingIndicatorSystem } from './common/systems';
import { Sidebar } from './components';
import TabBar from './components/navigation/TabBar';
import { AuthUI } from './features/auth-ui';
import PodcastSheet from './features/collection/components/podcasts/PodcastSheet';
import { SettingsOverviewSheet } from './features/settings';
import { UseAsPWAInstructionsSheet } from './features/tutorial';
import { Collection, Exams, Flashcards, Groups, Homeworks, Overview, SuccessPage } from './pages/Index';
import {
  InitializeAppSystem,
  InitializeSchoolSubjectsSystem,
  InitializeStoriesSystem,
  InitializeUserSystem,
  ViewManagerSystem,
} from './systems';
import { formatNavLinkAsPath } from './utils/formatNavLinkAsPath';
import { dataTypeQuery } from './utils/queries';

function App() {
  return (
    <div>
      <InitializeUserSystem />
      <InitializeStoriesSystem initialStory={Story.OBSERVING_COLLECTION_STORY} />
      <InitializeAppSystem />
      <ViewManagerSystem />
      <InitializeSchoolSubjectsSystem />
      <InitializeLoadingIndicatorSystem />
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path={formatNavLinkAsPath(NavigationLink.OVERVIEW)} element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLink.HOMEWORKS)} element={<Homeworks />} />
          <Route path={formatNavLinkAsPath(NavigationLink.EXAMS)} element={<Exams />} />
          <Route path={formatNavLinkAsPath(NavigationLink.COLLECTION)} element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLink.GROUPS)} element={<Groups />} />
          <Route path={formatNavLinkAsPath(NavigationLink.FLASHCARDS)} element={<Flashcards />} />
        </Routes>

        <SettingsOverviewSheet />
        <TabBar />
        <NotificationMenu />
      </BrowserRouter>
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.PODCAST) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
        onMatch={PodcastSheet}
      />{' '}
      <AuthUI />
      <UseAsPWAInstructionsSheet />
    </div>
  );
}

export default App;
