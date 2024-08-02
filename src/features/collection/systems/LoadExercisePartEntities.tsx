import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/additionalFacets";
import { dummyExerciseParts } from "../../../base/dummy";
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

const fetchExercisePartsForTopic = async (topicId: string) => {
  const { data: ExerciseParts, error } = await supabaseClient
    .from(SupabaseTables.EXERCISE_PARTS)
    .select("title, id, date_added")
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error("Error fetching ExerciseParts:", error);
    return [];
  }

  return ExerciseParts || [];
};

const LoadExercisePartsSystem = () => {
  const {
    isUsingMockupData: mockupData,
    isUsingSupabaseData: shouldFetchFromSupabase,
  } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    const initializeExercisePartEntities = async () => {
      if (selectedTopicId) {
        const exerciseParts = mockupData
          ? dummyExerciseParts
          : shouldFetchFromSupabase
            ? await fetchExercisePartsForTopic(selectedTopicId)
            : [];

        exerciseParts.forEach((exercisePart) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === exercisePart.id &&
              e.hasTag(DataTypes.EXERCISE_PART),
          );

          if (!isExisting) {
            const exercisePartEntity = new Entity();
            lsc.engine.addEntity(exercisePartEntity);
            exercisePartEntity.add(
              new TitleFacet({
                title:
                  exercisePart.title ||
                  displayAlertTexts(selectedLanguage).noTitle,
              }),
            );
            exercisePartEntity.add(
              new IdentifierFacet({ guid: exercisePart.id }),
            );

            exercisePartEntity.add(
              new ParentFacet({ parentId: selectedTopicId }),
            );
            exercisePartEntity.addTag(DataTypes.EXERCISE_PART);
          }
        });
      }
    };

    initializeExercisePartEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase, selectedLanguage]);

  return null;
};

export default LoadExercisePartsSystem;
