import { useContext, useState } from "react";
import {
  SecondaryButton,
  FlexBox,
  ProgressBar,
  PrimaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
} from "../../../../components";
import {
  AnswerFacet,
  AnswerProps,
  MasteryLevelProps,
  QuestionFacet,
  QuestionProps,
} from "../../../../app/a";
import { EntityProps } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayButtonTexts } from "../../../../utils/displayText";
import supabaseClient from "../../../../lib/supabase";
import { IdentifierProps } from "@leanscope/ecs-models";
import { IoBookmark, IoBookmarkOutline, IoTrashOutline } from "react-icons/io5";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useBookmarked } from "../../../study/hooks/useBookmarked";

const StyledMasteryLevelText = styled.div`
  ${tw`lg:pl-10 px-4 dark:text-primaryTextDark`}
`;

const EditFlashcardSheet = (props: QuestionProps & AnswerProps & MasteryLevelProps & EntityProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { question, answer, masteryLevel, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const [questionValue, setQuestionValue] = useState(question);
  const [answerValue, setAnswerValue] = useState(answer);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

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

  const deleteFlashcard = async () => {
    navigateBack();

    setTimeout(async () => {
      lsc.engine.removeEntity(entity);

      const { error } = await supabaseClient.from("flashCards").delete().eq("id", guid);

      if (error) {
        console.error("Error deleting flashcard: ", error);
      }
    }, 300);
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(questionValue !== question || answerValue !== answer) && (
          <PrimaryButton onClick={updateFlashcard}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextAreaInput value={questionValue} onChange={(e) => setQuestionValue(e.target.value)} />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput value={answerValue} onChange={(e) => setAnswerValue(e.target.value)} />
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow last>
          <FlexBox>
            <ProgressBar width={(masteryLevel / 5) * 100 + 2} />
            <StyledMasteryLevelText>{(masteryLevel / 5) * 100}%</StyledMasteryLevelText>
          </FlexBox>
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow
          last
          role="button"
          icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
          onClick={toggleBookmark}
        >
          {isBookmarked
            ? displayActionTexts(selectedLanguage).unbookmark
            : displayActionTexts(selectedLanguage).bookmark}
        </SectionRow>
      </Section>
      <Spacer size={2} />

      <Section>
        <SectionRow role="destructive" last icon={<IoTrashOutline />} onClick={deleteFlashcard}>
          {displayButtonTexts(selectedLanguage).delete}
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditFlashcardSheet;
