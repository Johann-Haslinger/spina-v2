import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { SupabaseTables } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addTopic = async (lsc: ILeanScopeClient, topicEntity: Entity, userId: string) => {
  lsc.engine.addEntity(topicEntity);

  const topicId = topicEntity.get(IdentifierFacet)?.props.guid;
  const parentId = topicEntity.get(ParentFacet)?.props.parentId;
  const title = topicEntity.get(TitleFacet)?.props.title;

  const { error } = await supabaseClient.from(SupabaseTables.TOPICS).insert([
    {
      id: topicId,
      parent_id: parentId,
      title: title,
      user_id: userId,
      description: topicEntity.get(DescriptionFacet)?.props.description,
      image_url: topicEntity.get(ImageFacet)?.props.imageSrc,
    },
  ]);

  if (error) {
    console.error('Error adding topic', error);
  }
};
