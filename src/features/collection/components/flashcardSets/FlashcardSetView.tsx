import React from "react";
import {
  BackButton,
  CollectionGrid,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../../../../components";
import {
  AnswerFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleProps,
} from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierProps, Tags } from "@leanscope/ecs-models";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { AdditionalTags, DataTypes } from "../../../../base/enums";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadFlashcardsSystem from "../../systems/LoadFlashcardsSystem";
import FlashcardCell from "./FlashcardCell";
import { isChildOfQuery } from "../../../../utils/queries";

const FlashcardSetView = (
  props: TitleProps & EntityProps & IdentifierProps
) => {
  const { title, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedTopicTitle } = useSelectedTopic();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <>
      <LoadFlashcardsSystem mockupData />

      <View visibe={isVisible}>
        <NavigationBar></NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle}
        </BackButton>
        <Title>{title}</Title>
        <Spacer size={8} />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => e.hasTag(DataTypes.FLASHCARD) && isChildOfQuery(e, entity)}
            get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
      </View>
    </>
  );
};

export default FlashcardSetView;
