import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export const useUserId =  () => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await supabase.auth.getUser();
      setUserId(userId.data.user?.id);
    };

    fetchUserId();
  }, []);

  return { userId: userId || "No User Signe In" };
};
