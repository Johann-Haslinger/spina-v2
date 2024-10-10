import { ILeanScopeClient } from '@leanscope/api-client';
import { addNotificationEntity } from '../common/utilities';
import supabaseClient from '../lib/supabase';

export const getCompletion = async (lsc: ILeanScopeClient, prompt: string): Promise<string> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke('get-completion', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: prompt },
    });

    if (error) {
      console.error('error generating completion:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Generieren einer Antwort.',
        message: error.message,
        type: 'error',
      });
      return `error generating completion:` + error.message;
    }

    return completion;
  } else {
    return 'User must be signed in to call this function';
  }
};

export const getJSONCompletion = async (lsc: ILeanScopeClient, prompt: string): Promise<string> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke('get-json-completion', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: prompt },
    });

    if (error) {
      console.error('error generating completion:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Generieren einer Antwort.',
        message: error.message,
        type: 'error',
      });
      return `error generating completion:` + error.message;
    }

    return completion;
  } else {
    return 'User must be signed in to call this function';
  }
};

export async function getAudioFromText(lsc: ILeanScopeClient, text: string): Promise<string | undefined> {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: mp3Blob, error } = await supabaseClient.functions.invoke('get-audio-from-text', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: text },
    });

    if (error) {
      console.error('Fehler bei der Anfrage:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Generieren einer Antwort.',
        message: error.message,
        type: 'error',
      });
      return 'Fehler bei der Ausführung der Funktion';
    }

    return mp3Blob;
  } else {
    return 'Benutzer muss angemeldet sein, um diese Funktion aufzurufen';
  }
}

export const getImageFromText = async (lsc: ILeanScopeClient, text: string): Promise<string | undefined> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: image, error } = await supabaseClient.functions.invoke('get-image-from-text', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { prompt: text },
    });

    if (error) {
      console.error('error generating image:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Generieren eines Bildes.',
        message: error.message,
        type: 'error',
      });
      return `error generating image:` + error.message;
    }

    return image;
  } else {
    return 'User must be signed in to call this function';
  }
};
