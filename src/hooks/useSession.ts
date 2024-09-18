import { useEffect, useState } from 'react';
import supabaseClient from '../lib/supabase';

export const useSession = () => {
  const [session, setSession] = useState<unknown>();
  const [isLoggedIn, setIsLoggedIn] = useState<null| Boolean>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabaseClient.auth.getSession();

      setSession(data.session);
      setIsLoggedIn(!!data.session);
    };

    supabaseClient?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session); 
    });

    fetchSession();
  }, []);

  return {
    session,
    isLoggedIn,
  };
};
