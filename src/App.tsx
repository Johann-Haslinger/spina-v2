import styled from "@emotion/styled";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import tw from "twin.macro";
import { DataTypes, NavigationLinks, Stories } from "./base/enums";
import { Sidebar } from "./components";
import { AuthUI } from "./features/auth-ui";
import { Settings } from "./features/settings";
import { useSession } from "./hooks/useSession";
import { Collection, Exams, Groups, Homeworks, Overview, Study } from "./pages/Index";
import InitializeAppSystem from "./systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "./systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "./systems/InitializeStoriesSystem";
import InitializeUserSystem from "./systems/InitializeUserSystem";
import ViewManagerSystem from "./systems/ViewManagerSystem";
import { formatNavLinkAsPath } from "./utils/formatNavLinkAsPath";
import { SapientorIcon } from "./features/collection/components/sapientor";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { TitleFacet, DateAddedFacet, SourceFacet } from "./app/additionalFacets";
import PodcastSheet from "./features/collection/components/podcasts/PodcastSheet";
import { dataTypeQuery } from "./utils/queries";
import { Tags } from "@leanscope/ecs-models";

const StyledContentWrapper = styled.div`
  ${tw`w-screen h-screen bg-primary dark:bg-primaryDark`}
`;

function App() {
  const { session } = useSession();

  return !session ? (
    <AuthUI />
  ) : (
    <StyledContentWrapper>
      <InitializeUserSystem />
      <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
      <InitializeAppSystem />
      <ViewManagerSystem />
      <InitializeSchoolSubjectsSystem />

      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.OVERVIEW)} element={<Overview />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.STUDY)} element={<Study />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.HOMEWORKS)} element={<Homeworks />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.EXAMS)} element={<Exams />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.COLLECTION)} element={<Collection />} />
          <Route path={formatNavLinkAsPath(NavigationLinks.GROUPS)} element={<Groups />} />
        </Routes>

        <Settings />
      </BrowserRouter>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.PODCAST) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
        onMatch={PodcastSheet}
      />

      <SapientorIcon />
    </StyledContentWrapper>
  );
}
2;

export default App;
