import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks, Stories } from "./base/enums";
import { Collection, Exams, Groups, Homeworks, Overview, Study } from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import StoriesInitSystem from "./systems/StoriesInitSystem";
import { Sidebar } from "./components";
import AppInitSystem from "./systems/AppInitSystem";
import { AuthUI } from "./features/auth-ui";
import { Settings } from "./features/settings";
import { formatNavLinkAsPath } from "./utils/formatNavLinkAsPath";
import UserInitSystem from "./systems/UserInitSystem";
import { useSession } from "./hooks/useSession";
import { Fragment } from "react/jsx-runtime";

function App() {
  const { session } = useSession();

  return !session ? (
    <AuthUI />
  ) : (
    <Fragment>
      <UserInitSystem />
      <StoriesInitSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
      <AppInitSystem />
      <ViewManagerSystem />
      <SchoolSubjectsInitSystem />

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
