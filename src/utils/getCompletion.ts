import supabaseClient from "../lib/supabase";

export const getCompletion = async (prompt: string): Promise<string> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke("get-completion", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: prompt },
    });

    if (error) {
      console.error("error generating completion:", error.message);
      return `error generating completion:` + error.message;
    }

    return completion;
  } else {
    return "User must be signed in to call this function";
  }
};

export const getJSONCompletion = async (prompt: string): Promise<string> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke("get-json-completion", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: prompt },
    });

    if (error) {
      console.error("error generating completion:", error.message);
      return `error generating completion:` + error.message;
    }

    return completion;
  } else {
    return "User must be signed in to call this function";
  }
};

export async function getAudioFromText(text: string): Promise<string | undefined> {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: mp3Blob, error } = await supabaseClient.functions.invoke("get-audio-from-text", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { query: text },
    });

    if (error) {
      console.error("Fehler bei der Anfrage:", error.message);
      return "Fehler bei der Ausführung der Funktion";
    }

    return mp3Blob;
  } else {
    return "Benutzer muss angemeldet sein, um diese Funktion aufzurufen";
  }
}

export const getImageFromText = async (text: string): Promise<string | undefined> => {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: image, error } = await supabaseClient.functions.invoke("get-image-from-text", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { prompt: text },
    });

    if (error) {
      console.error("error generating image:", error.message);
      return `error generating image:` + error.message;
    }

    return image;
  } else {
    return "User must be signed in to call this function";
  }
};
