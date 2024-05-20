import { Fragment, useContext } from "react";
import { CollectionGrid, NavBarButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from "../components";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import { IoAdd } from "react-icons/io5";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, Stories } from "../base/enums";
import { FlashcardGroupCell, InitializeFlashcardGroupsSystem, LoadFlashcardsSystem } from "../features/study";
import { DateAddedFacet, TitleFacet } from "../app/additionalFacets";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { FlashcardSetView } from "../features/collection";
import LernplanSection from "../features/study/components/LernplanSection";
import { sortEntitiesByDateAdded } from "../utils/sortEntitiesByTime";
import { useFlashcardGroups } from "../features/study/hooks/useFlashcardGroups";
import SubtopicView from "../features/collection/components/subtopics/SubtopicView";
import LoadSubtopicResourcesSystem from "../features/collection/systems/LoadSubtopicResourcesSystem";
import AddFlashcardSetSheet from "../features/collection/components/flashcard-sets/AddFlashcardSetSheet";
import FlashcardQuizView from "../features/study/components/FlashcardQuizView";

const Study = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { existFlashcardGroups } = useFlashcardGroups();

  const openAddFlashcardGroupSheet = () => lsc.stories.transitTo(Stories.ADDING_FLASHCARD_SET_STORY);

  return (
    <Fragment>
      <InitializeFlashcardGroupsSystem />
      <LoadFlashcardsSystem />
      <LoadSubtopicResourcesSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddFlashcardGroupSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).study}</Title>
        <Spacer />
        {!existFlashcardGroups && <NoContentAddedHint />}
        <LernplanSection />

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_GROUP)}
            get={[[TitleFacet, DateAddedFacet], []]}
            sort={sortEntitiesByDateAdded}
            onMatch={FlashcardGroupCell}
          />
        </CollectionGrid>
      </View>
      <EntityPropsMapper
        query={(e) => e.has(DataTypes.FLASHCARD_GROUP) && e.has(DataTypes.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <EntityPropsMapper
        query={(e) => e.has(DataTypes.FLASHCARD_GROUP) && e.has(DataTypes.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        onMatch={SubtopicView}
      />
      <AddFlashcardSetSheet />
      <FlashcardQuizView />
    </Fragment>
  );
};

export default Study;
