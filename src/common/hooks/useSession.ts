import { useEffect, useState } from 'react';
import supabaseClient from '../../lib/supabase';

export const useSession = () => {
  const [session, setSession] = useState<unknown>();
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabaseClient.auth.getSession();

      setSession(data.session || false);
      setIsLoggedIn(!!data.session || false);
    };

    supabaseClient?.auth.onAuthStateChange((_event, session) => {
      setSession(session || false);
      setIsLoggedIn(!!session || false);
    });

    fetchSession();
  }, []);

  return {
    session,
    isLoggedIn,
  };
};
