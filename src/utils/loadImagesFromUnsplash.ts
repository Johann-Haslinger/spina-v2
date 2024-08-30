import supabaseClient from '../lib/supabase';

export const loadImagesFromUnsplash = async (query: string) => {
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
      return [];
    }

    return images;
  } else {
    return 'User must be signed in to call this function';
  }
};
