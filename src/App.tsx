import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {  NavigationLinks, Stories } from "./base/enums";
import {
  Collection,
  Exams,
  Groups,
  Homeworks,
  Overview,
  Study,
} from "./pages/Index";
import SchoolSubjectsInitSystem from "./systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem"
import StoriesInitSystem from "./systems/StoriesInitSystem";
import { Sidebar } from "./components";
import AppInitSystem from "./systems/AppInitSystem";
import { useUserData } from "./hooks/useUserData";
import { AuthUI } from "./features/auth-ui";
import { Settings } from "./features/settings";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "./app/AdditionalFacets";
import { v4 } from "uuid";
import { formatNavLinkAsPath } from "./utils/formatNavLinkAsPath";

function App() {
  const { session } = useUserData();

  return !session ? (
    <AuthUI />
  ) : (
    <>
      <EntityCreator
        facets={[
          new IdentifierFacet({ guid: v4(), displayName: v4() }),
          new TitleFacet({ title: "Sinus Exercise" }),
        ]}
        tags={[]}
      />

      <StoriesInitSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
      <AppInitSystem />

      <ViewManagerSystem />

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
