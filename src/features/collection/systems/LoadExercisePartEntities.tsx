import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { dummyExerciseParts } from '../../../common/types/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { displayAlertTexts } from '../../../common/utilities/displayText';
import supabaseClient from '../../../lib/supabase';
import { useSelectedTopic } from '../hooks/useSelectedTopic';

const fetchExercisePartsForTopic = async (topicId: string) => {
  const { data: ExerciseParts, error } = await supabaseClient
    .from(SupabaseTable.EXERCISE_PARTS)
    .select('title, id, date_added')
    .eq(SupabaseColumn.PARENT_ID, topicId);

  if (error) {
    console.error('Error fetching ExerciseParts:', error);
    return [];
  }

  return ExerciseParts || [];
};

const LoadExercisePartsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
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
            (e) => e.get(IdentifierFacet)?.props.guid === exercisePart.id && e.hasTag(DataType.EXERCISE_PART),
          );

          if (!isExisting) {
            const exercisePartEntity = new Entity();
            lsc.engine.addEntity(exercisePartEntity);
            exercisePartEntity.add(
              new TitleFacet({
                title: exercisePart.title || displayAlertTexts(selectedLanguage).noTitle,
              }),
            );
            exercisePartEntity.add(new IdentifierFacet({ guid: exercisePart.id }));

            exercisePartEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            exercisePartEntity.addTag(DataType.EXERCISE_PART);
          }
        });
      }
    };

    initializeExercisePartEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase, selectedLanguage]);

  return null;
};

export default LoadExercisePartsSystem;
