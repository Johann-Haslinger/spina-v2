import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { addNotificationEntity } from '.';
import supabaseClient from '../../lib/supabase';
import { SupabaseTable } from '../types/enums';

export const addText = async (lsc: ILeanScopeClient, textEntity: Entity, userId: string) => {
  const parentId = textEntity.get(ParentFacet)?.props.parentId;
  const text = textEntity.get(TextFacet)?.props.text;

  const { error } = await supabaseClient.from(SupabaseTable.TEXTS).insert([
    {
      parent_id: parentId,
      text: text,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error('Error adding text', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Hinzufügen des Textes',
      message: error.message,
      type: 'error',
    });
  }
};
