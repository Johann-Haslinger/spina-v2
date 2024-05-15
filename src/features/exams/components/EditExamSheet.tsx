import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useState, useEffect } from "react";
import { TitleFacet, DueDateFacet } from "../../../app/additionalFacets";
import { Stories } from "../../../base/enums";
import {
  Sheet,
  FlexBox,
  SecondaryButton,
  PrimaryButton,
  Spacer,
  Section,
  SectionRow,
  TextInput,
  DateInput,
} from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { useSelectedExam } from "../hooks/useSelectedExam";

const EditExamSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedExamTitle, selectedExamEntity, selectedExamId, selectedExamDueDate } = useSelectedExam();
  const [newTitle, setNewTitle] = useState(selectedExamTitle);
  const [newDueDate, setNewDueDate] = useState(selectedExamTitle);

  useEffect(() => {
    setNewTitle(selectedExamTitle);
    setNewDueDate(selectedExamDueDate);
  }, [selectedExamTitle, selectedExamDueDate]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_EXAMS_STORY);

  const updateExam = async () => {
    if (newTitle && newDueDate) {
      navigateBack();
      selectedExamEntity?.add(new TitleFacet({ title: newTitle }));
      selectedExamEntity?.add(new DueDateFacet({ dueDate: newDueDate }));

      const { error } = await supabaseClient
        .from("exams")
        .update({
          title: newTitle,
          dueDate: newDueDate,
        })
        .eq("id", selectedExamId);

      if (error) {
        console.error("Error updating exam set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedExamTitle || newDueDate !== selectedExamDueDate) && (
          <PrimaryButton onClick={updateExam}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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

export default EditExamSheet;
