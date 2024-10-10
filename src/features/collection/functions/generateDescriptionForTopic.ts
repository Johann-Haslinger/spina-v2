import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../app/additionalFacets';
import { AdditionalTag, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';
import { getCompletion } from '../../../utils/getCompletion';
import { ILeanScopeClient } from '@leanscope/api-client';

export const generateDescriptionForTopic = async (lsc: ILeanScopeClient, entity: Entity) => {
  const description = entity.get(DescriptionFacet)?.props.description;
  // const image = entity?.get(ImageFacet)?.props.imageSrc;
  const title = entity?.get(TitleFacet)?.props.title;
  const id = entity.get(IdentifierFacet)?.props.guid;
  let topicDescription = description;
  // let topicImage = image;

  const generatingDescriptionPrompt = 'Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:' + title;
  // const imageContentPrompt = `Beschreibe kurz und präzise ein passendes Bild zu '${title}', damit es einfach nachgemalt werden kann. Verwende wenige Wörter und wähle ein reales Motiv.`;
  entity.addTag(AdditionalTag.GENERATING);
  if (!description) {
    topicDescription = await getCompletion(lsc, generatingDescriptionPrompt);
    entity.add(new DescriptionFacet({ description: topicDescription }));

    const { error } = await supabaseClient
      .from(SupabaseTable.TOPICS)
      .update({
        description: topicDescription,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating topic:', error);
    }
  }
  // if (!image || regenerate) {
  //   const imageContent = await getCompletion(imageContentPrompt);
  //   console.log('imageContent', imageContent);

  //   const generatingImagePrompt = `${imageContent},e`;

  //   topicImage = await getImageFromText(generatingImagePrompt);
  //   console.log('topicImage', topicImage);
  //   entity.add(new ImageFacet({ imageSrc: topicImage }));
  // }

  entity.remove(AdditionalTag.GENERATING);
};
