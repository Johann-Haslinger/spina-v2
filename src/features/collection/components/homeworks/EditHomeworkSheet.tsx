import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { DueDateFacet, TitleFacet } from "../../../../app/AdditionalFacets";
import { Stories } from "../../../../base/enums";
import {
  Sheet,
  FlexBox,
  Spacer,
  Section,
  SectionRow,
  TextInput,
  CancelButton,
  SaveButton,
  DateInput,
} from "../../../../components";
import { useSelectedHomework } from "../../hooks/useSelectedHomework";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const EditHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDIT_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedHomeworkTitle,
    selectedHomeworkEntity,
    selectedHomeworkId,
    selectedHomeworkDueDate,
  } = useSelectedHomework();
  const [newTitle, setNewTitle] = useState(selectedHomeworkTitle);
  const [newDueDate, setNewDueDate] = useState(selectedHomeworkTitle);

  useEffect(() => {
    setNewTitle(selectedHomeworkTitle);
    setNewDueDate(selectedHomeworkDueDate);
  }, [selectedHomeworkTitle, selectedHomeworkDueDate]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_HOMEWORKS_STORY);

  const updateHomework = async () => {
    console.log("updateHomework", newDueDate, newTitle);
    if (newTitle && newDueDate) {
      navigateBack();
      selectedHomeworkEntity?.add(new TitleFacet({ title: newTitle }));
      selectedHomeworkEntity?.add(new DueDateFacet({ dueDate: newDueDate }));

      const { error } = await supabaseClient
        .from("homeworks")
        .update({
          title: newTitle,
          dueDate: newDueDate,
        })
        .eq("id", selectedHomeworkId);

      if (error) {
        console.error("Error updating flashcard set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        {(newTitle !== selectedHomeworkTitle ||
          newDueDate !== selectedHomeworkDueDate) && (
          <SaveButton onClick={updateHomework}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </SectionRow>
        <SectionRow type="last">
          <FlexBox>
            <div> Due Date</div>
            <DateInput
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </FlexBox>
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditHomeworkSheet;
