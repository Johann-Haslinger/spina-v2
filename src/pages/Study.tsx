import React from "react";
import {
  CollectionLayout,
  NavBarButton,
  NavigationBar,
  Title,
  View,
} from "../components";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/selectDisplayText";
import { IoAdd } from "react-icons/io5";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes } from "../base/enums";
import {
  FlashcardGroupCell,
  FlashcardGroupsInitSystem,
  FlashcardGroupView,
  LoadFlashcardsSystem,
} from "../features/study";
import { TitleFacet } from "../app/AdditionalFacets";
import { Tags } from "@leanscope/ecs-models";

const Study = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <>
      <FlashcardGroupsInitSystem mokUpData />
      <LoadFlashcardsSystem mokUpData />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).studyHeaderText}</Title>
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
    </>
  );
};

export default Study;
