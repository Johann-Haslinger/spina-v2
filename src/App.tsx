import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationLinks } from "./base/enums";
import { formatNavLinkAsPath } from "./utils";
import { Collection, Exams, Groups, Homeworks, Overview } from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import LoadTopicEntitiesSystem from "./features/collection/systems/LoadTopicEntitiesSystem";


function App() {
  return (
    <>
      <ViewManagerSystem />
      <LoadTopicEntitiesSystem  />
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
        {/* <Sidebar /> */}
      </BrowserRouter>
    </>
  );
}
2;

export default App;
