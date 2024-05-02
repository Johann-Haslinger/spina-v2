import { useIsStoryCurrent } from "@leanscope/storyboarding";
import React, { useContext, useEffect, useState } from "react";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  ScrollableBox,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { IoAdd, IoColorWandOutline } from "react-icons/io5";
import { v4 } from "uuid";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from "../../../../app/AdditionalFacets";
import supabaseClient from "../../../../lib/supabase";
import { useUserData } from "../../../../hooks/useUserData";
import { generateFlashCards } from "../../../../utils/generateResources";
import GeneratingIndecator from "../../../../components/content/GeneratingIndecator";
import { useSeletedFlashcardGroup } from "../../hooks/useSelectedFlashcardGroup";
import PreviewFlashcard from "./PreviewFlashcard";

type Flashcard = {
  question: string;
  answer: string;
};

enum AddFlashcardsMethods {
  ADD_FLASHCARDS_MANUALLY,
  GENERATE_FLASHCARDS,
  IMPORT_FLASHCARDS,
  DONE,
}

const AddFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_FLASHCARDS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { selectedFlashcardGroupId } = useSeletedFlashcardGroup();
  const [addFlashcardsMethod, setAddFlashcardsMethod] = useState<AddFlashcardsMethods | undefined>(undefined);
  const { userId } = useUserData();
  const [generateFlashcardsPrompt, setGenerateFlashcardsPrompt] = useState("");
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  useEffect(() => {
    if (flashcards[flashcards.length - 1] && flashcards[flashcards.length - 1].answer !== "") {
      setFlashcards([...flashcards, { question: "", answer: "" }]);
    }
  }, [flashcards[flashcards.length - 1]]);

  useEffect(() => {
    setAddFlashcardsMethod(undefined);
    setGenerateFlashcardsPrompt("");
    setFlashcards([]);
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const saveFlashcards = async () => {
    navigateBack();
    const parentId = selectedFlashcardGroupId;
    let addedFlashcards: {
      id: string;
      question: string;
      answer: string;
      difficulty: number;
      parentId: string;
      user_id: string;
    }[] = [];

    if (parentId) {
      flashcards.forEach((flashcard) => {
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
    }
  };

  const handleGenerateFlashcards = async () => {
    setIsGeneratingFlashcards(true);
    const flashcards = await generateFlashCards(generateFlashcardsPrompt);
    setFlashcards(flashcards);
    setIsGeneratingFlashcards(false);
    setAddFlashcardsMethod(AddFlashcardsMethods.DONE);
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</CancelButton>
        {flashcards.length > 0 && (
          <SaveButton onClick={saveFlashcards}>{displayButtonTexts(selectedLanguage).save}</SaveButton>
        )}
      </FlexBox>
      <Spacer />
      {addFlashcardsMethod == undefined && (
        <Section>
          <SectionRow
            onClick={() => {
              setAddFlashcardsMethod(AddFlashcardsMethods.ADD_FLASHCARDS_MANUALLY);
              setFlashcards([{ question: "", answer: "" }]);
            }}
            role="button"
            icon={<IoAdd />}
          >
            Karte hinzufügen
          </SectionRow>
          <SectionRow
           last
            onClick={() => setAddFlashcardsMethod(AddFlashcardsMethods.GENERATE_FLASHCARDS)}
            role="button"
            icon={<IoColorWandOutline />}
          >
            Karten generieren
          </SectionRow>
        </Section>
      )}
      {addFlashcardsMethod == AddFlashcardsMethods.GENERATE_FLASHCARDS && !isGeneratingFlashcards && (
        <>
          <Section>
            <SectionRow last>
              <TextAreaInput
                placeholder="Worüber möchtest du Karten erzeugen?"
                onChange={(e) => setGenerateFlashcardsPrompt(e.target.value)}
              />
            </SectionRow>
          </Section>
          <Spacer size={2} />
          {generateFlashcardsPrompt && (
            <Section>
              <SectionRow role="button" icon={<IoColorWandOutline />}last onClick={handleGenerateFlashcards}>
                Karteikarten erzuegen
              </SectionRow>
            </Section>
          )}
        </>
      )}
      {isGeneratingFlashcards && <GeneratingIndecator />}
      <ScrollableBox>
        {flashcards.map((flashcard, index) => (
          <PreviewFlashcard
            updateFlashcard={(flashcard) =>
              setFlashcards([...flashcards.slice(0, index), flashcard, ...flashcards.slice(index + 1)])
            }
            key={index}
            flashcard={flashcard}
          />
        ))}
      </ScrollableBox>
    </Sheet>
  );
};

export default AddFlashcardsSheet;

