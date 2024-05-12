import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";
import {
  SecondaryButton,
  FlexBox,
  GeneratingIndecator,
  PrimaryButton,
  ScrollableBox,
  Sheet,
  Spacer,
} from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { useContext, useEffect, useState } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";
import { AnswerFacet, QuestionFacet, TitleFacet } from "../../../../app/additionalFacets";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { generateImprovedText } from "../../../../utils/generateResources";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { useUserData } from "../../../../hooks/useUserData";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../../lib/supabase";
import { v4 } from "uuid";

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

    const newSubTopic = {
      user_id: userId,
      id: selectedFlashcardSetId,
      name: selectedFlashcardSetTitle,
      parentId: selectedFlashcardSetParentId,
    };

    selectedFlashcardSetEntity?.add(AdditionalTags.NAVIGATE_BACK);

    if (selectedFlashcardSetId) {
      setTimeout(async () => {
        const subtopicEntity = new Entity();
        lsc.engine.addEntity(subtopicEntity);
        subtopicEntity.add(new IdentifierFacet({ guid: selectedFlashcardSetId }));
        subtopicEntity.add(new ParentFacet({ parentId: selectedFlashcardSetParentId || "" }));
        subtopicEntity.add(new TitleFacet({ title: selectedFlashcardSetTitle || "" }));
        subtopicEntity.add(new TextFacet({ text: generatedText || "" }));
        subtopicEntity.add(DataTypes.SUBTOPIC);

        const { error: subtopicsError } = await supabaseClient.from("subTopics").insert([newSubTopic]);

        if (subtopicsError) {
          console.error("Error inserting subtopic", subtopicsError);
        }
        const newKnowledge = {
          user_id: userId,
          id: v4(),
          text: generatedText,
          parentId: selectedFlashcardSetId,
        };

        const { error: knowledgeError } = await supabaseClient.from("knowledges").insert([newKnowledge]);

        if (knowledgeError) {
          console.error("Error inserting knowledge", knowledgeError);
        }

        const { error: flashcardSetError } = await supabaseClient
          .from("flashcardSets")
          .delete()
          .eq("id", selectedFlashcardSetId);

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
