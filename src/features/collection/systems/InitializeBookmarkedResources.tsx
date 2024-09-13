import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, LearningUnitTypeFacet, PriorityFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyLearningUnits } from '../../../base/dummy';
import { AdditionalTag, DataType, LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const fetchBookmarkedLearningUnits = async () => {
  const { data, error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .select('id, parent_id, title, priority, type, date_added')
    .eq('is_bookmarked', true);

  if (error) {
    console.error('Error fetching bookmarked learning units:', error);
  }

  return data || [];
};

const InitializeBookmarkedResources = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeBookmarkedLearningUnits = async () => {
      const learningUnits = isUsingMockupData
        ? dummyLearningUnits
        : isUsingSupabaseData
          ? await fetchBookmarkedLearningUnits()
          : [];

      learningUnits.forEach((learningUnit) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === learningUnit.id && e.hasTag(DataType.LEARNING_UNIT),
        );

        if (isExisting) return;

        const newLearningUnitEntity = new Entity();
        lsc.engine.addEntity(newLearningUnitEntity);
        newLearningUnitEntity.add(new TitleFacet({ title: learningUnit.title }));
        newLearningUnitEntity.add(new IdentifierFacet({ guid: learningUnit.id }));
        newLearningUnitEntity.add(new ParentFacet({ parentId: learningUnit.parent_id }));
        newLearningUnitEntity.add(new DateAddedFacet({ dateAdded: learningUnit.date_added }));
        newLearningUnitEntity.add(
          new PriorityFacet({
            priority: LearningUnitPriority[learningUnit.priority as keyof typeof LearningUnitPriority],
          }),
        );
        newLearningUnitEntity.add(
          new LearningUnitTypeFacet({ type: LearningUnitType[learningUnit.type as keyof typeof LearningUnitType] }),
        );
        newLearningUnitEntity.add(DataType.LEARNING_UNIT);
        newLearningUnitEntity.add(AdditionalTag.BOOKMARKED);
      });
    };

    initializeBookmarkedLearningUnits();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default InitializeBookmarkedResources;
