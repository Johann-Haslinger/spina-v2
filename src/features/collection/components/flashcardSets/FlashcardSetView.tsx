import React, { useContext } from "react";
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
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
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadFlashcardsSystem from "../../systems/LoadFlashcardsSystem";
import FlashcardCell from "./FlashcardCell";
import { isChildOfQuery } from "../../../../utils/queries";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import {
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import EditFlashcardSetSheet from "./EditFlashcardSetSheet";
import DeleteFlashcardSetAlert from "./DeleteFlashcardSetAlert";
import { displayActionTexts } from "../../../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const FlashcardSetView = (
  props: TitleProps & EntityProps & IdentifierProps
) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditFlashcardSetSheet = () =>
    lsc.stories.transitTo(Stories.EDIT_FLASHCARD_SET_STORY);

  const openDeleteFlashcardSetAlert = () =>
    lsc.stories.transitTo(Stories.DELETE_FLASHCARD_SET_STORY);

  return (
    <>
      <LoadFlashcardsSystem mockupData />

      <View visibe={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <>
                <ActionRow
                  isFirst
                  icon={<IoCreateOutline />}
                  onClick={openEditFlashcardSetSheet}
                >
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow
                  destructive
                  isLast
                  icon={<IoTrashOutline />}
                  onClick={openDeleteFlashcardSetAlert}
                >
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle}
        </BackButton>
        <Title>{title}</Title>
        <Spacer size={8} />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) =>
              e.hasTag(DataTypes.FLASHCARD) && isChildOfQuery(e, entity)
            }
            get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
      </View>

      <EditFlashcardSetSheet />
      <DeleteFlashcardSetAlert />
    </>
  );
};

export default FlashcardSetView;
