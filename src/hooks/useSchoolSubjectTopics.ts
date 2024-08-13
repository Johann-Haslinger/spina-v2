import { useEffect, useState } from 'react';
import { SupabaseColumns, SupabaseTables } from '../base/enums';
import supabaseClient from '../lib/supabase';

interface Topic {
  title: string;
  id: string;
}

export const useSchoolSubjectTopics = (schoolSubjectId: string) => {
  const [schoolSubjectTopics, setSchoolSubjectTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchSchoolSubjectTopics = async () => {
      const { data: topics, error } = await supabaseClient
        .from(SupabaseTables.TOPICS)
        .select('title, id')
        .eq(SupabaseColumns.PARENT_ID, schoolSubjectId);

      if (error) {
        console.error('Error fetching topics:', error);
      }
      if (topics) {
        setSchoolSubjectTopics(
          topics.map((topic: {id: string; title: string}) => ({
            title: topic.title,
            id: topic.id,
          })) as Topic[],
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
    setSchoolSubjectTopics,
  };
};
