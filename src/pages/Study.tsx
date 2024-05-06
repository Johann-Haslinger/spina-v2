import { Fragment, useContext } from "react";
import { CollectionGrid, NavBarButton, NavigationBar, Spacer, Title, View } from "../components";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import { IoAdd } from "react-icons/io5";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, Stories } from "../base/enums";
import {
  FlashcardGroupCell,
  FlashcardGroupsInitSystem,
  LoadFlashcardsSystem,
} from "../features/study";
import { DateAddedFacet, TitleFacet } from "../app/AdditionalFacets";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import AddFlashcardGroupSheet from "../features/study/components/AddFlashcardGroupSheet";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { FlashcardSetView } from "../features/collection";

const Study = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();

  const openAddFlashcardGroupSheet = () => lsc.stories.transitTo(Stories.ADD_FLASHCARD_GROUP_STORY);

  return (
    <Fragment>
      <FlashcardGroupsInitSystem />
      <LoadFlashcardsSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddFlashcardGroupSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).study}</Title>
        <Spacer />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_GROUP)}
            get={[[TitleFacet, DateAddedFacet], []]}
            onMatch={FlashcardGroupCell}
          />
        </CollectionGrid>
      </View>
      <EntityPropsMapper
        query={(e) => e.has(DataTypes.FLASHCARD_GROUP) && e.has(DataTypes.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <AddFlashcardGroupSheet />
    </Fragment>
  );
};

export default Study;
