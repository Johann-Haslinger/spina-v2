import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { AnswerFacet, QuestionFacet, TitleFacet } from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories, SupabaseColumns, SupabaseTables } from "../../../../base/enums";
import {
  FlexBox,
  GeneratingIndecator,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Sheet,
  Spacer,
} from "../../../../components";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { addSubtopic } from "../../../../functions/addSubtopic";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../../hooks/useUserData";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts } from "../../../../utils/displayText";
import { generateImprovedText } from "../../../../utils/generateResources";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { addBlockEntitiesFromString } from "../../../blockeditor/functions/addBlockEntitiesFromString";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";

const GenerateTextFromFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const {
    selectedFlashcardSetId,
    selectedFlashcardSetEntity,
    selectedFlashcardSetParentId,
    selectedFlashcardSetTitle,
  } = useSelectedFlashcardSet();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsStoryCurrent(Stories.GENERATING_TEXT_FROM_FLASHCARDS_STORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcardEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.FLASHCARD));
  const [generatedText, setGeneratedText] = useState<string>("");
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  useEffect(() => {
    const generateTextFromFlashcards = async () => {
      setIsGenerating(true);
      const textToImprove = flashcardEntities
        .filter((e) => isChildOfQuery(e, selectedFlashcardSetEntity))
        .map((entity) => {
          const question = entity.get(QuestionFacet)?.props.question;
          const answer = entity.get(AnswerFacet)?.props.answer;
          return `${question} ${answer}` + "\n";
        })
        .join(" ");

      if (textToImprove) {
        const imporvedText = await generateImprovedText(textToImprove);

        setGeneratedText(imporvedText);
      }

      setIsGenerating(false);
    };

    if (isVisible && selectedFlashcardSetId) {
      generateTextFromFlashcards();
    }
  }, [isVisible, flashcardEntities]);

  const saveText = async () => {
    navigateBack();

    selectedFlashcardSetEntity?.add(AdditionalTags.NAVIGATE_BACK);

    if (selectedFlashcardSetId) {
      setTimeout(async () => {
        const subtopicEntity = new Entity();
        subtopicEntity.add(new IdentifierFacet({ guid: selectedFlashcardSetId }));
        subtopicEntity.add(new ParentFacet({ parentId: selectedFlashcardSetParentId || "" }));
        subtopicEntity.add(new TitleFacet({ title: selectedFlashcardSetTitle || "" }));
        subtopicEntity.add(new TextFacet({ text: generatedText || "" }));
        subtopicEntity.add(DataTypes.SUBTOPIC);

        addSubtopic(lsc, subtopicEntity, userId);

        addBlockEntitiesFromString(lsc, generatedText, selectedFlashcardSetId, "");

        const { error: flashcardSetError } = await supabaseClient
          .from(SupabaseTables.FLASHCARD_SETS)
          .delete()
          .eq(SupabaseColumns.ID, selectedFlashcardSetId);

        if (flashcardSetError) {
          console.error("Error deleting flashcard set", flashcardSetError);
        }
      }, 200);
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {!isGenerating && generatedText !== "" && (
          <PrimaryButton onClick={saveText}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      {isGenerating ? (
        <GeneratingIndecator />
      ) : (
        <ScrollableBox>
          <SapientorConversationMessage
            message={{
              role: "gpt",
              message: `Passt das so für dich?<br/> <br/>
           ${generatedText}
           <br/><br/>`,
            }}
          />
        </ScrollableBox>
      )}
    </Sheet>
  );
};

export default GenerateTextFromFlashcardsSheet;
