import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import tw from 'twin.macro';
import { DateAddedFacet, SourceFacet, TitleFacet } from './app/additionalFacets';
import { DataType, NavigationLink, Story } from './base/enums';
import { InitializeLoadingIndicatorSystem } from './common/systems';
import { Sidebar } from './components';
import TabBar from './components/navigation/TabBar';
import { AuthUI } from './features/auth-ui';
import PodcastSheet from './features/collection/components/podcasts/PodcastSheet';
import { Profile, Settings } from './features/settings';
import { useSession } from './hooks/useSession';
import { Collection, Exams, Flashcards, Groups, Homeworks, Overview } from './pages/Index';
import {
  InitializeAppSystem,
  InitializeSchoolSubjectsSystem,
  InitializeStoriesSystem,
  InitializeUserSystem,
  ViewManagerSystem,
} from './systems';
import { formatNavLinkAsPath } from './utils/formatNavLinkAsPath';
import { dataTypeQuery } from './utils/queries';

const StyledContentWrapper = styled.div`
  ${tw`w-screen h-screen bg-primary dark:bg-primary-dark`}
`;

function App() {
  const { isLoggedIn } = useSession();

  return isLoggedIn == false ? (
    <div>
      <AuthUI />
    </div>
  ) : (
    <StyledContentWrapper>
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
          <Route path={formatNavLinkAsPath(NavigationLink.OVERVIEW)} element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLink.HOMEWORKS)} element={<Homeworks />} />
          <Route path={formatNavLinkAsPath(NavigationLink.EXAMS)} element={<Exams />} />
          <Route path={formatNavLinkAsPath(NavigationLink.COLLECTION)} element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLink.GROUPS)} element={<Groups />} />
          <Route path={formatNavLinkAsPath(NavigationLink.FLASHCARDS)} element={<Flashcards />} />
        </Routes>

        <Settings />
        <Profile />
        <TabBar />
      </BrowserRouter>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.PODCAST) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
        onMatch={PodcastSheet}
      />
    </StyledContentWrapper>
  );
}
2;

export default App;
