import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { AdditionalTag, SupabaseTable } from '../../../common/types/enums';
import { getCompletion } from '../../../common/utilities/getCompletion';
import { loadImagesFromUnsplash } from '../../../common/utilities/loadImagesFromUnsplash';
import supabaseClient from '../../../lib/supabase';

export const generateDescriptionForTopic = async (lsc: ILeanScopeClient, entity: Entity) => {
  const description = entity.get(DescriptionFacet)?.props.description;
  const title = entity?.get(TitleFacet)?.props.title;
  const id = entity.get(IdentifierFacet)?.props.guid;
  let topicDescription = description;

  const generatingDescriptionPrompt = 'Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:' + title;

  if (!description) {
    topicDescription = await getCompletion(lsc, generatingDescriptionPrompt);
    entity.add(new DescriptionFacet({ description: topicDescription }));

    const searchQueryPrompt = `Erstelle eine Unsplash-Suchanfrage für das um ein passendes Bild für das Thema "${title}" zu finden. Die Anfrage soll nicht länger als 3 Wörter sein und auf Unsplash vorhandene Bilder liefern.`;
    const searchQuery = await getCompletion(lsc, searchQueryPrompt);
    console.log('searchQuery', searchQuery);
    const images = await loadImagesFromUnsplash(lsc, searchQuery);
    console.log('images', images);
    console.log(images[0].url);
    const firstImage = JSON.parse(images)[0] && JSON.parse(images)[0];
    entity.add(new ImageFacet({ imageSrc: (firstImage && firstImage.url) || '' }));

    const { error } = await supabaseClient
      .from(SupabaseTable.TOPICS)
      .update({
        description: topicDescription,
        image_url: firstImage.url,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating topic:', error);
    }
  }

  entity.remove(AdditionalTag.GENERATING);
};
