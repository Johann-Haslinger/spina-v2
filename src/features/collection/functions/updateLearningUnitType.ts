import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { LearningUnitTypeFacet } from '../../../app/additionalFacets';
import { LearningUnitPriority, LearningUnitType, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

export const updateLearningUnitType = async (entity: Entity, userId: string, type: LearningUnitType) => {
  entity.add(new LearningUnitTypeFacet({ type }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .update({
      type: LearningUnitType[type],
      user_id: userId,
      priority: LearningUnitPriority[LearningUnitPriority.ACTIVE],
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating learning unit type', error);
  }
};
