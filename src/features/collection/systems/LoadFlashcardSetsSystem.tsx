import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummyFlashcardSets } from "../../../base/dummy";
import {
  DataTypes,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { useCurrentDataSource } from "../../../hooks/useCurrentDataSource";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayAlertTexts } from "../../../utils/displayText";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchFlashcardSetsForTopic = async (topicId: string) => {
  const { data: flashcardSets, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARD_SETS)
    .select("title, id, date_added")
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error("Error fetching flashcardSets:", error);
    return [];
  }

  return flashcardSets || [];
};

const LoadFlashcardSetsSystem = () => {
  const {
    isUsingMockupData: mockupData,
    isUsingSupabaseData: shouldFetchFromSupabase,
  } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    const initializeFlashcardSetEntities = async () => {
      if (selectedTopicId) {
        const flashcardSets = mockupData
          ? dummyFlashcardSets
          : shouldFetchFromSupabase
            ? await fetchFlashcardSetsForTopic(selectedTopicId)
            : [];

        flashcardSets.forEach((flashcardSet) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === flashcardSet.id &&
              e.hasTag(DataTypes.FLASHCARD_SET),
          );

          if (!isExisting) {
            const noteEntity = new Entity();
            lsc.engine.addEntity(noteEntity);
            noteEntity.add(
              new TitleFacet({
                title:
                  flashcardSet.title ||
                  displayAlertTexts(selectedLanguage).noTitle,
              }),
            );
            noteEntity.add(new IdentifierFacet({ guid: flashcardSet.id }));
            noteEntity.add(
              new DateAddedFacet({ dateAdded: flashcardSet.date_added }),
            );

            noteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            noteEntity.addTag(DataTypes.FLASHCARD_SET);
          }
        });
      }
    };

    initializeFlashcardSetEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadFlashcardSetsSystem;
