import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export const useUserData =  () => {
  const [userId, setUserId] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await supabase.auth.getUser();
      const userEmail =  user.data.user?.email
      const userId = user.data.user?.id
      setUserEmail(userEmail);
      setUserId(userId);
    };

    fetchUserData();
  }, []);

  return { userId: userId || "No User Signed In", userEmail: userEmail || "No User Signed In"};
};
