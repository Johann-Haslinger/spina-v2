import React, { useContext } from "react";
import {
  CollectionLayout,
  NavBarButton,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../components";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/selectDisplayText";
import { IoAdd } from "react-icons/io5";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, StoryGuid } from "../base/enums";
import {
  FlashcardGroupCell,
  FlashcardGroupsInitSystem,
  FlashcardGroupView,
  LoadFlashcardsSystem,
} from "../features/study";
import { TitleFacet } from "../app/AdditionalFacets";
import { Tags } from "@leanscope/ecs-models";
import AddFlashcardGroupSheet from "../features/study/components/AddFlashcardGroupSheet";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const Study = () => {
  const lsc = useContext(LeanScopeClientContext)
  const { selectedLanguage } = useSelectedLanguage();

  const openAddFlashcardGroupSheet = () => lsc.stories.transitTo(StoryGuid.ADD_FLASHCARD_GROUP_STORY);

  return (
    <>
      <FlashcardGroupsInitSystem mokUpData />
      <LoadFlashcardsSystem mokUpData />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddFlashcardGroupSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).studyHeaderText}</Title>
        <Spacer />
        <CollectionLayout>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_GROUP)}
            get={[[TitleFacet], []]}
            onMatch={FlashcardGroupCell}
          />
        </CollectionLayout>
      </View>
      <EntityPropsMapper
        query={(e) => e.has(DataTypes.FLASHCARD_GROUP) && e.has(Tags.SELECTED)}
        get={[[TitleFacet], []]}
        onMatch={FlashcardGroupView}
      />
      <AddFlashcardGroupSheet />
    </>
  );
};

export default Study;
