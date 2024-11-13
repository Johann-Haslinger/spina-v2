import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NotificationMenu } from './common/components/notifications';
import { NoNetworkAlert } from './common/components/others';
import {
  InitializeAppSystem,
  InitializeLoadingIndicatorSystem,
  InitializeSchoolSubjectsSystem,
  InitializeStoriesSystem,
  InitializeUserSystem,
  ViewManagerSystem,
} from './common/systems';
import { NavigationLink, Story } from './common/types/enums';
import { formatNavLinkAsPath } from './common/utilities/formatNavLinkAsPath';
import { Sidebar } from './components';
import TabBar from './components/navigation/TabBar';
import { AuthUI } from './features/auth-ui';
import { SettingsOverviewSheet } from './features/settings';
import { UseAsPWAInstructionsSheet } from './features/tutorial';
import Tutorial from './features/tutorial/components/Tutorial';
import TransitToTutorialSystem from './features/tutorial/systems/TransitToTutorialSystem';
import {
  Collection,
  Exams,
  Flashcards,
  Groups,
  Homeworks,
  Overview,
  SuccessPage,
  VerifiedEmailPage,
} from './pages/Index';

const App = () => {
  return (
    <div>
      <InitializeUserSystem />
      <InitializeStoriesSystem initialStory={Story.OBSERVING_COLLECTION_STORY} />
      <InitializeAppSystem />
      <ViewManagerSystem />
      <InitializeSchoolSubjectsSystem />
      <InitializeLoadingIndicatorSystem />

      <BrowserRouter>
        <TransitToTutorialSystem />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/verified-email" element={<VerifiedEmailPage />} />
          <Route path={formatNavLinkAsPath(NavigationLink.OVERVIEW)} element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLink.HOMEWORKS)} element={<Homeworks />} />
          <Route path={formatNavLinkAsPath(NavigationLink.EXAMS)} element={<Exams />} />
          <Route path={formatNavLinkAsPath(NavigationLink.COLLECTION)} element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLink.GROUPS)} element={<Groups />} />
          <Route path={formatNavLinkAsPath(NavigationLink.FLASHCARDS)} element={<Flashcards />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>

        <SettingsOverviewSheet />
        <TabBar />
        <NotificationMenu />
      </BrowserRouter>

      <NoNetworkAlert />
      <Tutorial />
      <AuthUI />
      <UseAsPWAInstructionsSheet />
    </div>
  );
};

export default App;
