import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { TitleFacet, DateAddedFacet } from "../../../app/additionalFacets";
import { SupabaseTables, DataTypes } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayAlertTexts } from "../../../utils/displayText";
import { useSelectedTopic } from "../hooks/useSelectedTopic";
import { dummyExercises } from "../../../base/dummy";

const fetchExercisesForTopic = async (topicId: string) => {
  const { data: exercises, error } = await supabaseClient
    .from(SupabaseTables.EXERCISES)
    .select("title, id, date_added")
    .eq("parent_id", topicId);

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return exercises || [];
};

const LoadExercisesSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    const initializeexerciseEntities = async () => {
      if (selectedTopicId) {
        const exercises = mockupData
          ? dummyExercises
          : shouldFetchFromSupabase
            ? await fetchExercisesForTopic(selectedTopicId)
            : [];

        exercises.forEach((exercise) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === exercise.id && e.hasTag(DataTypes.EXERCISE)
          );

          if (!isExisting) {
            const exerciseEntity = new Entity();
            lsc.engine.addEntity(exerciseEntity);
            exerciseEntity.add(
              new TitleFacet({ title: exercise.title || displayAlertTexts(selectedLanguage).noTitle })
            );
            exerciseEntity.add(new IdentifierFacet({ guid: exercise.id }));
            exerciseEntity.add(new DateAddedFacet({ dateAdded: exercise.date_added }));
            exerciseEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            exerciseEntity.addTag(DataTypes.EXERCISE);
          }
        });
      }
    };

    initializeexerciseEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase, selectedLanguage]);

  return null;
};

export default LoadExercisesSystem;
