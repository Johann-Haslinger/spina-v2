import { useEffect, useState } from 'react';
import { SupabaseColumn, SupabaseTable } from '../base/enums';
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
        .from(SupabaseTable.TOPICS)
        .select('title, id')
        .eq(SupabaseColumn.PARENT_ID, schoolSubjectId)
        .eq('is_archived', false);

      if (error) {
        console.error('Error fetching topics:', error);
      }
      if (topics) {
        setSchoolSubjectTopics(
          topics.map((topic: { id: string; title: string }) => ({
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
