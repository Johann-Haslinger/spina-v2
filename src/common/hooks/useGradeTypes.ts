import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useState, useEffect } from "react";
import supabaseClient from "../../lib/supabase";
import { DEFAULT_GRADS_TYPES } from "../types/constants";
import { Story, SupabaseTable } from "../types/enums";
import { useUserData } from "./useUserData";
import { v4 as uuid } from "uuid";

export const useGradeTypes = () => {
  const isVisible = useIsStoryCurrent(Story.AddING_GRADE_STORY);
  const [gradeTypes, setGradeTypes] = useState<{ id: string; title: string, weight: number }[]>([]);
  const { userId } = useUserData();

  useEffect(() => {
    const fetchGradeTypes = async () => {
      const { data: gradeTypes, error } = await supabaseClient.from(SupabaseTable.GRADE_TYPES).select('title, id, weight');

      if (error) {
        console.error('Error fetching grade types', error);
        return;
      }

      if (gradeTypes.length == 0) {
        const newGradeTypes = DEFAULT_GRADS_TYPES.map((type) => ({
          id: uuid(),
          title: type.title,
          weight: type.weight,
          user_id: userId,
        }));

        const { error } = await supabaseClient.from(SupabaseTable.GRADE_TYPES).insert(newGradeTypes);

        if (error) {
          console.error('Error inserting new grade types', error);
          return;
        }

        setGradeTypes(newGradeTypes);
      } else {
        setGradeTypes(gradeTypes);
      }
    };

    if (isVisible) {
      fetchGradeTypes();
    }
  }, [isVisible]);

  return gradeTypes;
};
