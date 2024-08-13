import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useEffect } from 'react';
import { dummyText } from '../../../base/dummy';
import { DataTypes, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';

const fetchHomeworkText = async (homeworkId: string, userId: string) => {
  const { data: text, error } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .select('text')
    .eq(SupabaseColumns.ID, homeworkId)
    .single();

  if (error) {
    console.error('Error fetching homework text:', error);
    return [];
  }

  const { error: error2 } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .update({ old_note_version: false, new_note_version: true, text: '' })
    .eq(SupabaseColumns.ID, homeworkId);

  if (error2) {
    console.error('error updating homework to oldNoteVersion', error2);
  }

  const homeworkText = text?.text;

  const { error: error3 } = await supabaseClient
    .from(SupabaseTables.TEXTS)
    .upsert([{ text: homeworkText, parent_id: homeworkId, user_id: userId }]);

  if (error3) {
    console.error('error inserting text', error3);
  }

  return homeworkText || [];
};

const fetchNoteVersion = async (homeworkId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .select('old_note_version')
    .eq(SupabaseColumns.ID, homeworkId)
    .single();

  if (error) {
    console.error('error fetching homework version', error);
    return;
  }

  return noteVersionData?.old_note_version;
};

const LoadHomeworkTextSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const { userId } = useUserData();
  const [selectedHomework] = useEntity((e) => e.hasTag(DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED));
  const selectedHomeworkId = selectedHomework?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const loadHomeworkText = async () => {
      if (selectedHomeworkId) {
        const isOldNoteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedHomeworkId));

        if (isOldNoteVersion) {
          const homeworkText = mockupData
            ? dummyText
            : shouldFetchFromSupabase && (await fetchHomeworkText(selectedHomeworkId, userId));

          if (homeworkText) {
            selectedHomework?.add(new TextFacet({ text: homeworkText }));
          }
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
