import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { AnswerFacet, QuestionFacet } from "../../../app/additionalFacets";
import { dummyFlashcards } from "../../../base/dummy";
import { DataTypes, SupabaseColumns } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedGroupFlashcardSet } from "../hooks/useSelectedGroupFlashcardSet";

const fetchGroupFlashcardsForGroupFlashcardGroup = async (parentId: string) => {
  const { data: groupFlashcards, error } = await supabaseClient
    .from("group_flashcards")
    .select("question, id, answer")
    .eq(SupabaseColumns.PARENT_ID, parentId);

  if (error) {
    console.error("Error fetching GroupFlashcards:", error);
    return [];
  }

  return groupFlashcards || [];
};

const LoadGroupFlashcardsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupFlashcardSetId } = useSelectedGroupFlashcardSet();

  useEffect(() => {
    const initializeGroupFlashcardEntities = async () => {
      if (selectedGroupFlashcardSetId) {
        const groupFlashcards = mockupData
          ? dummyFlashcards
          : shouldFetchFromSupabase
            ? await fetchGroupFlashcardsForGroupFlashcardGroup(
                selectedGroupFlashcardSetId,
              )
            : [];

        groupFlashcards.forEach((flashcard) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === flashcard.id &&
              e.hasTag(DataTypes.GROUP_FLASHCARD),
          );

          if (!isExisting) {
            const groupFlashcardEntity = new Entity();
            lsc.engine.addEntity(groupFlashcardEntity);
            groupFlashcardEntity.add(
              new IdentifierFacet({ guid: flashcard.id }),
            );
            groupFlashcardEntity.add(
              new QuestionFacet({ question: flashcard.question }),
            );
            groupFlashcardEntity.add(
              new AnswerFacet({ answer: flashcard.answer }),
            );
            groupFlashcardEntity.add(
              new ParentFacet({ parentId: selectedGroupFlashcardSetId }),
            );

            groupFlashcardEntity.addTag(DataTypes.GROUP_FLASHCARD);
          }
        });
      }
    };

    initializeGroupFlashcardEntities();
  }, [selectedGroupFlashcardSetId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupFlashcardsSystem;
