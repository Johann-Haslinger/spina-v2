import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks, Stories } from "./base/enums";
import { Collection, Exams, Groups, Homeworks, Overview, Study } from "./pages/Index";
import InitializeSchoolSubjectsSystem from "./systems/InitializeSchoolSubjectsSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import InitializeStoriesSystem from "./systems/InitializeStoriesSystem";
import { Sidebar } from "./components";
import InitializeAppSystem from "./systems/InitializeAppSystem";
import { AuthUI } from "./features/auth-ui";
import { Settings } from "./features/settings";
import { formatNavLinkAsPath } from "./utils/formatNavLinkAsPath";
import InitializeUserSystem from "./systems/InitializeUserSystem";
import { useSession } from "./hooks/useSession";
import { Fragment } from "react/jsx-runtime";

function App() {
  const { session } = useSession();

  return !session ? (
    <AuthUI />
  ) : (
    <Fragment>
      <InitializeUserSystem />
      <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
      <InitializeAppSystem />
      <ViewManagerSystem />
      <InitializeSchoolSubjectsSystem />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.OVERVIEW)} element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.STUDY)} element={<Study />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.HOMEWORKS)} element={<Homeworks />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.EXAMS)} element={<Exams />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.COLLECTION)} element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.GROUPS)} element={<Groups />} />
        </Routes>
        <Sidebar />
        <Settings />
      </BrowserRouter>
    </Fragment>
  );
}
2;

export default App;
