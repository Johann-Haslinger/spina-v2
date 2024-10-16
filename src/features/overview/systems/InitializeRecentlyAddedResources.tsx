import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import {
  DateAddedFacet,
  LearningUnitTypeFacet,
  PriorityFacet,
  TitleFacet,
} from '../../../common/types/additionalFacets';
import { DataType, LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';

const fetchRecentlyLearningUnits = async () => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: subtopics, error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .select('title, id, date_added, parent_id, type, priority')
    .gte('date_added', sevenDaysAgo);

  if (error) {
    console.error('Error fetching recently added subtopics: ', error);
  }

  return subtopics || [];
};

const InitializeRecentlyAddedResources = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeRecentlyAddedResources = async () => {
      const recentlyAddedResources = isUsingSupabaseData ? await fetchRecentlyLearningUnits() : [];

      recentlyAddedResources.forEach((resource) => {
        const isExisting = lsc.engine.entities.some((e) => e.get(IdentifierFacet)?.props.guid === resource.id);

        if (!isExisting) {
          const newResourceEntity = new Entity();
          lsc.engine.addEntity(newResourceEntity);
          newResourceEntity.add(new IdentifierFacet({ guid: resource.id }));
          newResourceEntity.add(new TitleFacet({ title: resource.title }));
          newResourceEntity.add(new DateAddedFacet({ dateAdded: resource.date_added }));
          newResourceEntity.add(new ParentFacet({ parentId: resource.parent_id }));
          newResourceEntity.add(
            new PriorityFacet({
              priority: LearningUnitPriority[resource.priority as keyof typeof LearningUnitPriority],
            }),
          );
          newResourceEntity.add(
            new LearningUnitTypeFacet({ type: LearningUnitType[resource.type as keyof typeof LearningUnitType] }),
          );
          newResourceEntity.addTag(DataType.LEARNING_UNIT);
        }
      });
    };

    initializeRecentlyAddedResources();
  }, [isUsingSupabaseData]);

  return null;
};

export default InitializeRecentlyAddedResources;
