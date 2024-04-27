import React, { useState } from "react";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from "../../../../components";
import {
  AnswerFacet,
  AnswerProps,
  MasteryLevelProps,
  QuestionFacet,
  QuestionProps,
} from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import supabaseClient from "../../../../lib/supabase";
import { IdentifierProps } from "@leanscope/ecs-models";

const EditFlashcardSheet = (
  props: QuestionProps &
    AnswerProps &
    MasteryLevelProps &
    EntityProps &
    IdentifierProps
) => {
  const { question, answer, masteryLevel, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const [questionValue, setQuestionValue] = useState(question);
  const [answerValue, setAnswerValue] = useState(answer);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  const updateFlashcard = async () => {
    navigateBack();

    entity.add(new QuestionFacet({ question: questionValue }));
    entity.add(new AnswerFacet({ answer: answerValue }));

    const { error } = await supabaseClient
      .from("flashCards")
      .update({
        question: questionValue,
        answer: answerValue,
      })
      .eq("id", guid);

    if (error) {
      console.error("Error updating flashcard: ", error);
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        {(questionValue !== question || answerValue !== answer) && (
          <SaveButton onClick={updateFlashcard}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextAreaInput
            value={questionValue}
            onChange={(e) => setQuestionValue(e.target.value)}
          />
        </SectionRow>
        <SectionRow type="last">
          <TextAreaInput
            value={answerValue}
            onChange={(e) => setAnswerValue(e.target.value)}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditFlashcardSheet;
