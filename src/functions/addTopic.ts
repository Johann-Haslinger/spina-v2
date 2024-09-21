import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../app/additionalFacets';
import { SupabaseTable } from '../base/enums';
import supabaseClient from '../lib/supabase';

export const addTopic = async (lsc: ILeanScopeClient, topicEntity: Entity, userId: string) => {
  lsc.engine.addEntity(topicEntity);

  const topicId = topicEntity.get(IdentifierFacet)?.props.guid;
  const parentId = topicEntity.get(ParentFacet)?.props.parentId;
  const title = topicEntity.get(TitleFacet)?.props.title;
  const topicImage = topicEntity.get(ImageFacet)?.props.imageSrc;
  const topicDescription = topicEntity.get(DescriptionFacet)?.props.description;

  const { error } = await supabaseClient.from(SupabaseTable.TOPICS).insert([
    {
      id: topicId,
      parent_id: parentId,
      title: title,
      user_id: userId,
      description: topicDescription,
      image_url: topicImage,
    },
  ]);

  if (error) {
    console.error('Error adding topic', error);
  }
};
