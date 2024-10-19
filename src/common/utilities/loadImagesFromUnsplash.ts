import { ILeanScopeClient } from '@leanscope/api-client';
import { addNotificationEntity } from '.';
import supabaseClient from '../../lib/supabase';

export const loadImagesFromUnsplash = async (lsc: ILeanScopeClient, query: string) => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: images, error } = await supabaseClient.functions.invoke('get-images-by-search-query', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query },
    });

    if (error) {
      console.error('error loading images from unsplash:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Laden von Bildern',
        message: error.message,
        type: 'error',
      });
      return [];
    }

    return images;
  } else {
    return 'User must be signed in to call this function';
  }
};
