import { useEffect, useState } from "react";
import supabaseClient from "../lib/supabase";

export const useUserData = () => {
  const [userId, setUserId] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [session, setSession] = useState<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await supabaseClient.auth.getUser();
      const session = await supabaseClient.auth.getSession();
      const userEmail = user.data.user?.email;
      const userId = user.data.user?.id;
      setUserEmail(userEmail);
      setUserId(userId);
      setSession(session.data.session);
    };

    supabaseClient?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchUserData();
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  };

  return {
    userId: userId || "No User Signed In",
    userEmail: userEmail || "No User Signed In",
    signedIn: userId ? true : false,
    session,
    signOut,
  };
};
