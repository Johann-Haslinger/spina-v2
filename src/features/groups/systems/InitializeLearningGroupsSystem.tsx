import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { ColorFacet, DescriptionFacet, IdentifierFacet, OrderFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { dummyLearningGroups } from '../../../common/types/dummy';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';
import supabaseClient from '../../../lib/supabase';

const fetchLearningGroups = async () => {
  const { data: learningGroups, error } = await supabaseClient
    .from('learning_groups')
    .select('title, id, color, description');

  if (error) {
    console.error('Error fetching learning groups:', error);
    return [];
  }

  return learningGroups || [];
};

const InitializeLearningGroupsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeLearningGroupEntities = async () => {
      const LearningGroups = mockupData
        ? dummyLearningGroups
        : shouldFetchFromSupabase
          ? await fetchLearningGroups()
          : [];

      LearningGroups.forEach((learningGroup, idx) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === learningGroup.id && dataTypeQuery(e, DataType.LEARNING_GROUP),
        );

        if (!isExisting) {
          const learningGroupEntity = new Entity();
          lsc.engine.addEntity(learningGroupEntity);
          learningGroupEntity.add(new TitleFacet({ title: learningGroup.title }));
          learningGroupEntity.add(new IdentifierFacet({ guid: learningGroup.id }));
          learningGroupEntity.add(new OrderFacet({ orderIndex: idx }));
          learningGroupEntity.add(new ColorFacet({ colorName: learningGroup.color }));
          learningGroupEntity.add(new DescriptionFacet({ description: learningGroup.description }));
          learningGroupEntity.addTag(DataType.LEARNING_GROUP);
        }
      });
    };

    initializeLearningGroupEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeLearningGroupsSystem;
