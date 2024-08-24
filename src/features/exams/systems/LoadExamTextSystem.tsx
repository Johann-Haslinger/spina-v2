import { TextFacet } from '@leanscope/ecs-models';
import { useEffect } from 'react';
import { dummyText } from '../../../base/dummy';
import { SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedExam } from '../hooks/useSelectedExam';

const LoadExamTextSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const { selectedExamEntity, selectedExamId } = useSelectedExam();

  useEffect(() => {
    const loadExamText = async () => {
      let examText;
      if (mockupData) {
        examText = dummyText;
      } else if (shouldFetchFromSupabase) {
        const { data: examTextData, error } = await supabaseClient
          .from(SupabaseTables.EXAMS)
          .select('text')
          .eq(SupabaseColumns.ID, selectedExamId)
          .single();

        if (error) {
          console.error('error fetching exam text', error);
          return;
        }
        examText = examTextData?.text;
      }

      selectedExamEntity?.add(new TextFacet({ text: examText }));
    };

    if (selectedExamEntity) {
      loadExamText();
    }
  }, [selectedExamEntity, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadExamTextSystem;
