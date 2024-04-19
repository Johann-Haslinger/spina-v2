import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks, StoryGuid } from "./base/enums";
import { formatNavLinkAsPath } from "./utils";
import { Collection, Exams, Groups, Homeworks, Overview } from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import LoadTopicEntitiesSystem from "./features/collection/systems/LoadTopicEntitiesSystem";
import StoriesInitSystem from "./systems/StoriesInitSystem";
import { Sidebar } from "./components";
import AppInitSystem from "./systems/AppInitSystem";

function App() {
  return (
    <>
      <AppInitSystem />
      <StoriesInitSystem initialStory={StoryGuid.OBSERVING_COLLECTION_STORY} />
      <ViewManagerSystem />
      <LoadTopicEntitiesSystem />
      <SchoolSubjectsInitSystem />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route
            path={formatNavLinkAsPath(NavigationLinks.OVERVIEW)}
            element={<Overview />}
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
      </BrowserRouter>
    </>
  );
}
2;

export default App;
