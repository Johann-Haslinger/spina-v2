import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import supabaseClient from '../../lib/supabase';
import { TypeFacet, ValueFacet } from '../types/additionalFacets';
import { SupabaseTable } from '../types/enums';
import { addNotificationEntity } from './addNotificationEntity';

export const addGrade = async (lsc: ILeanScopeClient, gradeEntity: Entity, userId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.GRADES).insert([
    {
      value: gradeEntity?.get(ValueFacet)?.props.value,
      type_id: gradeEntity.get(TypeFacet)?.props.type,
      parent_id: gradeEntity.get(ParentFacet)?.props.parentId,
      id: gradeEntity.get(IdentifierFacet)?.props.guid,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error('Error adding grade', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Hinzufügen deiner Note',
      message: error.message,
      type: 'error',
    });
    return;
  }

  lsc.engine.addEntity(gradeEntity);
};
