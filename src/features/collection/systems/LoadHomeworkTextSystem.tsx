import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useUserData } from '../../../common/hooks/useUserData';
import { dummyText } from '../../../common/types/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';

const fetchHomeworkText = async (homeworkId: string) => {
  const { data: text, error } = await supabaseClient
    .from(SupabaseTable.HOMEWORKS)
    .select('text')
    .eq(SupabaseColumn.ID, homeworkId)
    .single();

  if (error) {
    console.error('Error fetching homework text:', error);
    return [];
  }

  return text?.text;
};

const LoadHomeworkTextSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const { userId } = useUserData();
  const [selectedHomework] = useEntity((e) => e.hasTag(DataType.HOMEWORK) && e.hasTag(Tags.SELECTED));
  const selectedHomeworkId = selectedHomework?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const loadHomeworkText = async () => {
      if (selectedHomeworkId) {
        const homeworkText = mockupData
          ? dummyText
          : shouldFetchFromSupabase && (await fetchHomeworkText(selectedHomeworkId));

        if (homeworkText) {
          selectedHomework?.add(new TextFacet({ text: homeworkText }));
        }
      }
    };

    if (selectedHomework) {
      loadHomeworkText();
    }
  }, [selectedHomework, mockupData, shouldFetchFromSupabase, userId]);

  return null;
};

export default LoadHomeworkTextSystem;
