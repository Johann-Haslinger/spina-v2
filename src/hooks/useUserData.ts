import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export const useUserData = () => {
  const [userId, setUserId] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [session, setSession] = useState<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      const userEmail = user.data.user?.email;
      const userId = user.data.user?.id;
      setUserEmail(userEmail);
      setUserId(userId);
      setSession(session.data.session);
    };

    supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchUserData();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    console.log("Signed Out");
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
