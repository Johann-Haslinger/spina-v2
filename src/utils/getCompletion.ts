import supabaseClient from "../lib/supabase";

export async function getCompletion(prompt: string): Promise<string> {
  const session = await supabaseClient.auth.getSession();

  if (session) {
    const { data: completion, error } = await supabaseClient.functions.invoke(
      "getCompletion",
      {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: { query: prompt },
      }
    );

    if (error) {
      console.error("error generating completion:", error);
      return `error generating completion:` + error.message;
    }

    console.log("completion generated:", completion);

    return completion;
  } else {
    return "no session";
  }
}
