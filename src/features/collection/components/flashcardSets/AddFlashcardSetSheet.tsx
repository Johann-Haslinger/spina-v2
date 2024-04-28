import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useState } from "react";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { v4 } from "uuid";
import { DueDateFacet, TitleFacet } from "../../../../app/AdditionalFacets";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import supabaseClient from "../../../../lib/supabase";
import { useUserData } from "../../../../hooks/useUserData";

const AddFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [flashcardSetTitle, setFlashcardSetTitle] = useState("");
  const { selectedTopicId } = useSelectedTopic();
  const { userId } = useUserData();

  const addFlashcardSet = async () => {
    navigateBack();
    const flashcardSetId = v4();
    const parentId = selectedTopicId || "";

    const newFlashcardSetEntity = new Entity();
    lsc.engine.addEntity(newFlashcardSetEntity);
    newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
    newFlashcardSetEntity.add(new TitleFacet({ title: flashcardSetTitle }));
    newFlashcardSetEntity.add(new DueDateFacet({ dueDate: new Date().toISOString() }) );
    newFlashcardSetEntity.add(new ParentFacet({ parentId: parentId }));
    newFlashcardSetEntity.addTag(DataTypes.FLASHCARD_SET);

    const { error } = await supabaseClient.from("flashcardSets").insert([
      {
        user_id: userId,
        id: flashcardSetId,
        flashcardSetName: flashcardSetTitle,
        parentId: parentId,
      },
    ]);

    if (error) {
      console.error("Error adding flashcard set", error);
    } 
  };

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        {flashcardSetTitle && (
          <SaveButton onClick={addFlashcardSet}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow type="last">
          <TextInput
            value={flashcardSetTitle}
            onChange={(e) => setFlashcardSetTitle(e.target.value)}
            placeholder="Flashcard Set Title"
          />
        </SectionRow>
      </Section>
      <Spacer size={2} />
    </Sheet>
  );
};

export default AddFlashcardSetSheet;
