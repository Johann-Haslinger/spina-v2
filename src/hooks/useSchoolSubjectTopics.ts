import { useEffect, useState } from "react";
import supabaseClient from "../lib/supabase";

interface Topic {
  title: string;
  id: string;
}

export const useSchoolSubjectTopics = (schoolSubjectId: string) => {
  const [schoolSubjectTopics, setSchoolSubjectTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchSchoolSubjectTopics = async () => {
      const { data: topics, error } = await supabaseClient
        .from("topics")
        .select("topicName, id")
        .eq("parentId", schoolSubjectId);

      if (error) {
        console.error("Error fetching topics:", error);
      }
      if (topics) {
        setSchoolSubjectTopics(
          topics.map((topic: any) => ({
            title: topic.topicName,
            id: topic.id,
          })) as unknown as Topic[]
        );
      }
    };

    if (schoolSubjectId && schoolSubjectId.length > 0) {
      fetchSchoolSubjectTopics();
    }
  }, [schoolSubjectId]);

  return {
    schoolSubjectTopics: schoolSubjectTopics || [],
    hasSchoolSubjectTopics: schoolSubjectTopics.length > 0,
  };
};
