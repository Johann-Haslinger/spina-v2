import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, LearningUnitTypeFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyLearningUnits } from '../../../base/dummy';
import { DataType, LearningUnitType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedTopic } from '../hooks/useSelectedTopic';

const fetchLearningUnitsForTopic = async (topicId: string) => {
  const { data: learningUnits, error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .select('title, id, date_added, type')
    .eq('parent_id', topicId);

  if (error) {
    console.error('Error fetching learning units:', error);
    return [];
  }

  return learningUnits || [];
};

const LoadLearningUnitsSystm = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeLearningUnitEntities = async () => {
      if (selectedTopicId) {
        const learningUnits = isUsingMockupData
          ? dummyLearningUnits
          : isUsingSupabaseData
            ? await fetchLearningUnitsForTopic(selectedTopicId)
            : [];

        learningUnits.forEach((learningUnit) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === learningUnit.id && e.hasTag(DataType.LEARNING_UNIT),
          );

          if (!isExisting) {
            const learningUnitEntity = new Entity();
            lsc.engine.addEntity(learningUnitEntity);
            learningUnitEntity.add(new TitleFacet({ title: learningUnit.title || '' }));
            learningUnitEntity.add(new IdentifierFacet({ guid: learningUnit.id }));
            learningUnitEntity.add(new DateAddedFacet({ dateAdded: learningUnit.date_added }));
            learningUnitEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            learningUnitEntity.add(
              new LearningUnitTypeFacet({ type: LearningUnitType[learningUnit.type as keyof typeof LearningUnitType] }),
            );
            learningUnitEntity.add(DataType.LEARNING_UNIT);

            console.log('Learning Unit Entity:', learningUnitEntity);
          }
        });
      }
    };

    initializeLearningUnitEntities();
  }, [selectedTopicId, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadLearningUnitsSystm;
