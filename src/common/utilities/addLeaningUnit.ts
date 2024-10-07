import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DateAddedFacet, LearningUnitTypeFacet, TitleFacet } from '../../base/additionalFacets';
import { LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../base/enums';
import supabaseClient from '../../lib/supabase';

export const addLearningUnit = async (lsc: ILeanScopeClient, learningUnitEntity: Entity, userId: string) => {
  lsc.engine.addEntity(learningUnitEntity);

  const id = learningUnitEntity.get(IdentifierFacet)?.props.guid;
  const parent_id = learningUnitEntity.get(ParentFacet)?.props.parentId;
  const title = learningUnitEntity.get(TitleFacet)?.props.title;
  const type = learningUnitEntity.get(LearningUnitTypeFacet)?.props.type;
  const date_added = learningUnitEntity.get(DateAddedFacet)?.props.dateAdded;

  const { error } = await supabaseClient.from(SupabaseTable.LEARNING_UNITS).insert([
    {
      user_id: userId,
      id,
      parent_id,
      date_added,
      title,
      type: LearningUnitType[type as LearningUnitType],
      priority: LearningUnitPriority[LearningUnitPriority.ACTIVE],
    },
  ]);

  if (error) {
    console.error('Error inserting learning unit', error);
  }
};
