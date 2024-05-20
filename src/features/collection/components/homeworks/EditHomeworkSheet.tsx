import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { DueDateFacet, TitleFacet } from "../../../../app/additionalFacets";
import { Stories } from "../../../../base/enums";
import {
  DateInput,
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { useSelectedHomework } from "../../hooks/useSelectedHomework";

const EditHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedHomeworkTitle, selectedHomeworkEntity, selectedHomeworkId, selectedHomeworkDueDate } =
    useSelectedHomework();
  const [newTitle, setNewTitle] = useState(selectedHomeworkTitle);
  const [newDueDate, setNewDueDate] = useState(selectedHomeworkTitle);

  useEffect(() => {
    setNewTitle(selectedHomeworkTitle);
    setNewDueDate(selectedHomeworkDueDate);
  }, [selectedHomeworkTitle, selectedHomeworkDueDate]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_HOMEWORKS_STORY);

  const updateHomework = async () => {
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
        console.error("Error updating homework set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedHomeworkTitle || newDueDate !== selectedHomeworkDueDate) && (
          <PrimaryButton onClick={updateHomework}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last>
          <FlexBox>
            <div>{displayLabelTexts(selectedLanguage).dueDate}</div>
            <DateInput type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
          </FlexBox>
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditHomeworkSheet;
