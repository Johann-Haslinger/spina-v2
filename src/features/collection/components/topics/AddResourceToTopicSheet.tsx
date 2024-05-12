import { useContext } from "react";
import { SecondaryButton, FlexBox, Section, SectionRow, Sheet, Spacer } from "../../../../components";
import { DataTypes, Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts, displayDataTypeTexts } from "../../../../utils/displayText";
import { v4 } from "uuid";
import supabaseClient from "../../../../lib/supabase";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { useUserData } from "../../../../hooks/useUserData";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { DateAddedFacet } from "../../../../app/additionalFacets";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { IoAdd } from "react-icons/io5";

const AddResourceToTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_RESOURCE_TO_TOPIC_STORY);

  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const addNote = async () => {
    if (selectedTopicId) {
      navigateBack();
      const noteId = v4();

      const newNoteEntity = new Entity();
      lsc.engine.addEntity(newNoteEntity);
      newNoteEntity.add(new IdentifierFacet({ guid: noteId }));
      newNoteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(DataTypes.NOTE);
      newNoteEntity.add(Tags.SELECTED);

      const { error } = await supabaseClient
        .from("notes")
        .insert([{ id: noteId, parentId: selectedTopicId, user_id: userId }]);

      if (error) {
        console.error("Error adding note", error);
      }
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
      </FlexBox>
      <Spacer />

      <Section>
        <SectionRow icon={<IoAdd />} onClick={addNote} role="button">
          {displayDataTypeTexts(selectedLanguage).note}
        </SectionRow>
        <SectionRow
          icon={<IoAdd />}
          onClick={() => lsc.stories.transitTo(Stories.ADDING_FLASHCARD_SET_STORY)}
          role="button"
        >
          {displayDataTypeTexts(selectedLanguage).flashcardSet}
        </SectionRow>
        <SectionRow
          icon={<IoAdd />}
          onClick={() => lsc.stories.transitTo(Stories.ADDING_HOMEWORK_STORY)}
          last
          role="button"
        >
          {displayDataTypeTexts(selectedLanguage).homework}
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddResourceToTopicSheet;
