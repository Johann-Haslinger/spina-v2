import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks, StoryGuid } from "./base/enums";
import { formatNavLinkAsPath } from "./utils";
import { Collection, Exams, Groups, Homeworks, Overview, Study } from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import LoadTopicsSystem from "./features/collection/systems/LoadTopicsSystem";
import StoriesInitSystem from "./systems/StoriesInitSystem";
import { Sidebar } from "./components";
import AppInitSystem from "./systems/AppInitSystem";
import { useUserData } from "./hooks/useUserData";
import { AuthUI } from "./features/auth-ui";
import { Settings } from "./features/settings";

function App() {
  const { session } = useUserData();

  return !session ? (
    <AuthUI />
  ) : (
    <>
      <StoriesInitSystem initialStory={StoryGuid.OBSERVING_COLLECTION_STORY} />
      <AppInitSystem />
      <ViewManagerSystem />
      <LoadTopicsSystem />
      <SchoolSubjectsInitSystem />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.OVERVIEW)}
            element={<Overview />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.STUDY)}
            element={<Study />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.HOMEWORKS)}
            element={<Homeworks />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.EXAMS)}
            element={<Exams />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.COLLECTION)}
            element={<Collection />}
          />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.GROUPS)}
            element={<Groups />}
          />
        </Routes>
        <Sidebar />
        <Settings />
      </BrowserRouter>
    </>
  );
}
2;

export default App;
