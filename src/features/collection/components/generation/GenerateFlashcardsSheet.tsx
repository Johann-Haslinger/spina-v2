import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import {
  SecondaryButton,
  FlexBox,
  GeneratingIndecator,
  PrimaryButton,
  ScrollableBox,
  Sheet,
  Spacer,
} from "../../../../components";
import { useSelectedNote } from "../../hooks/useSelectedNote";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/displayText";
import PreviewFlashcard from "../flashcard-sets/PreviewFlashcard";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import { QuestionFacet, AnswerFacet, MasteryLevelFacet, TitleFacet } from "../../../../app/additionalFacets";
import supabaseClient from "../../../../lib/supabase";
import { v4 } from "uuid";
import { useUserData } from "../../../../hooks/useUserData";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { generateFlashCards } from "../../../../utils/generateResources";
import { useVisibleBlocks } from "../../../blockeditor/hooks/useVisibleBlocks";


type Flashcard = {
  question: string;
  answer: string;
};

const StyledPreviewCardsWrapper = styled.div`
  ${tw`w-full md:px-4`}
`;

const GenerateFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.GENERATING_FLASHCARDS_STORY);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const { selectedNoteTitle, selectedNoteText, selectedNoteId, selectedNoteParentId, selectedNoteEntity } =
    useSelectedNote();
  const { selectedLanguage } = useSelectedLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const { userId } = useUserData();
  const { visibleText } = useVisibleBlocks();

  useEffect(() => {
    const generateFlashcards = async () => {
      setIsGenerating(true);
      const flashcards = await generateFlashCards(visibleText || "");
      setIsGenerating(false);

      setTimeout(() => {
        setGeneratedFlashcards(flashcards);
      }, 200);
    };

    if (isVisible && visibleText && generatedFlashcards.length === 0) {
      generateFlashcards();
    }
  }, [isVisible, visibleText]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const saveFlashcards = async () => {
    navigateBack();

    const parentId = selectedNoteId;
    let addedFlashcards: {
      id: string;
      question: string;
      answer: string;
      difficulty: number;
      parentId: string;
      user_id: string;
    }[] = [];

    if (parentId) {
      generatedFlashcards.forEach((flashcard) => {
        if (!flashcard.question || !flashcard.answer) return;

        const flashcardId = v4();

        const newFlashcardEntity = new Entity();
        lsc.engine.addEntity(newFlashcardEntity);
        newFlashcardEntity.add(new IdentifierFacet({ guid: flashcardId }));
        newFlashcardEntity.add(new ParentFacet({ parentId: parentId }));
        newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
        newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
        newFlashcardEntity.add(new MasteryLevelFacet({ masteryLevel: 0 }));
        newFlashcardEntity.add(DataTypes.FLASHCARD);

        addedFlashcards.push({
          id: flashcardId,
          question: flashcard.question,
          answer: flashcard.answer,
          difficulty: 0,
          parentId: parentId,
          user_id: userId,
        });
      });

      const { error } = await supabaseClient.from("flashCards").insert(addedFlashcards);

      if (error) {
        console.error("Error inserting flashcards", error);
      }

      const newSubTopic = {
        user_id: userId,
        id: selectedNoteId,
        name: selectedNoteTitle,
        parentId: selectedNoteParentId,
      };

      selectedNoteEntity?.add(AdditionalTags.NAVIGATE_BACK);

      setTimeout(async () => {
        const subtopicEntity = new Entity();
        lsc.engine.addEntity(subtopicEntity);
        subtopicEntity.add(new IdentifierFacet({ guid: newSubTopic.id }));
        subtopicEntity.add(new ParentFacet({ parentId: selectedNoteParentId || "" }));
        subtopicEntity.add(new TitleFacet({ title: selectedNoteTitle || "" }));
        subtopicEntity.add(new TextFacet({ text: selectedNoteText || "" }));
        subtopicEntity.add(DataTypes.SUBTOPIC);

        const { error: subtopicsError } = await supabaseClient.from("subTopics").insert([newSubTopic]);

        if (subtopicsError) {
          console.error("Error inserting subtopic", subtopicsError);
        }

        const { error: noteError } = await supabaseClient.from("notes").delete().eq("id", selectedNoteId);

        if (noteError) {
          console.error("Error deleting note", noteError);
        }
      }, 200);
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {generatedFlashcards.length > 0 && (
          <PrimaryButton onClick={saveFlashcards}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      {isGenerating && <GeneratingIndecator />}
      <ScrollableBox>
        {!isGenerating && (
          <SapientorConversationMessage
            message={{
              role: "gpt",
              message: `Passen die Karteikarten so für dich?<br/> <br/> `,
            }}
          />
        )}
        <StyledPreviewCardsWrapper>
          {generatedFlashcards.map((flashcard, index) => (
            <PreviewFlashcard
              updateFlashcard={(flashcard) =>
                setGeneratedFlashcards([
                  ...generatedFlashcards.slice(0, index),
                  flashcard,
                  ...generatedFlashcards.slice(index + 1),
                ])
              }
              key={index}
              flashcard={flashcard}
            />
          ))}
        </StyledPreviewCardsWrapper>
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateFlashcardsSheet;
