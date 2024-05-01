import React, { useContext, useState } from "react";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  TextEditor,
  Title,
  View,
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { Stories } from "../../../../base/enums";
import {
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { displayActionTexts } from "../../../../utils/selectDisplayText";
import EditSubtopicSheet from "./EditSubtopicSheet";
import DeleteSubtopicAlert from "./DeleteSubtopicAlert";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";

enum SubtopicViewStates {
  NOTE,
  FLASHCARDS,
}

const SubtopicView = (props: TitleProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedSubtopicTitle } = useSelectedSubtopic();
  const [subtopicViewState, setSubtopicViewState] = useState(
    SubtopicViewStates.NOTE
  );

  const navigateBack = () => entity.removeTag(Tags.SELECTED);
  const openDeleteAlert = () =>
    lsc.stories.transitTo(Stories.DELETE_SUBTOPIC_STORY);
  const openEditSheet = () =>
    lsc.stories.transitTo(Stories.EDIT_SUBTOPIC_STORY);

  return (
    <>
      <View visibe={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <>
                <ActionRow
                  icon={<IoCreateOutline />}
                  onClick={openEditSheet}
                  isFirst
                >
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow
                  isLast
                  destructive
                  icon={<IoTrashOutline />}
                  onClick={openDeleteAlert}
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
        <Title>{selectedSubtopicTitle}</Title>

        {subtopicViewState == SubtopicViewStates.NOTE ? (
          <TextEditor />
        ) : (
          <CollectionGrid>{/* <EntityPropsMapper /> */}</CollectionGrid>
        )}
      </View>

      <EditSubtopicSheet />
      <DeleteSubtopicAlert />
    </>
  );
};

export default SubtopicView;
