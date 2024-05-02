import { useEffect, useState } from "react";
import supabaseClient from "../lib/supabase";

export const useSession = () => {
  const [session, setSession] = useState<any>();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabaseClient.auth.getSession();

      setSession(session.data.session);
    };

    supabaseClient?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSession();
  }, []);

  return {
    session,
  };
};
