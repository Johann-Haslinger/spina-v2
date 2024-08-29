import { TextFacet } from '@leanscope/ecs-models';
import { useEffect } from 'react';
import { dummyText } from '../../../base/dummy';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { useSelectedNote } from '../hooks/useSelectedNote';

const fetchNoteText = async (noteId: string, userId: string) => {
  const { data: noteTextData, error } = await supabaseClient
    .from(SupabaseTable.NOTES)
    .select('text')
    .eq(SupabaseColumn.ID, noteId);

  if (error) {
    console.error('error fetching note text', error);
    return;
  }

  const { error: error2 } = await supabaseClient
    .from(SupabaseTable.NOTES)
    .update({ old_note_version: false, new_note_version: true, text: '' })
    .eq(SupabaseColumn.ID, noteId);

  if (error2) {
    console.error('error updating note to newNoteVersion', error2);
  }

  const noteText = noteTextData[0]?.text;

  const { error: error3 } = await supabaseClient
    .from(SupabaseTable.TEXTS)
    .upsert([{ text: noteText, parent_id: noteId, user_id: userId }]);

  if (error3) {
    console.error('error inserting text', error3);
  }

  return noteText;
};

const fetchNoteVersion = async (noteId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTable.NOTES)
    .select('old_note_version, new_note_version')
    .eq(SupabaseColumn.ID, noteId)
    .single();

  if (error) {
    console.error('error fetching note version', error);
  }

  const isOldNoteVersion = noteVersionData?.old_note_version;
  const isNewNoteVersion = noteVersionData?.new_note_version;

  return isOldNoteVersion ? 'old-version' : isNewNoteVersion ? 'new-version' : 'blocks-version';
};

const LoadNoteTextSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const { selectedNoteEntity, selectedNoteId } = useSelectedNote();
  const { userId } = useUserData();

  useEffect(() => {
    const loadNoteText = async () => {
      if (selectedNoteId) {
        const noteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedNoteId));

        if (noteVersion == 'old-version') {
          const noteText = mockupData
            ? dummyText
            : shouldFetchFromSupabase && (await fetchNoteText(selectedNoteId, userId));
          selectedNoteEntity?.add(new TextFacet({ text: noteText }));
        } else if (noteVersion == 'blocks-version') {
          const { data: blocks, error } = await supabaseClient
            .from(SupabaseTable.BLOCKS)
            .select('content')
            .eq(SupabaseColumn.PARENT_ID, selectedNoteId);

          if (error) {
            console.error('error fetching blocks', error);
          }

          const text = blocks?.map((block) => block.content).join('\n');

          selectedNoteEntity?.add(new TextFacet({ text: text || '' }));

          const { error: error2 } = await supabaseClient
            .from(SupabaseTable.TEXTS)
            .upsert([{ text, parent_id: selectedNoteId, user_id: userId }]);

          if (error2) {
            console.error('error inserting text', error2);
          }

          const { error: error3 } = await supabaseClient
            .from(SupabaseTable.NOTES)
            .update({ old_note_version: false, new_note_version: true })
            .eq(SupabaseColumn.ID, selectedNoteId);

          if (error3) {
            console.error('error updating note to newNoteVersion', error3);
          }

          const { error: error4 } = await supabaseClient
            .from(SupabaseTable.BLOCKS)
            .delete()
            .eq(SupabaseColumn.PARENT_ID, selectedNoteId);

          if (error4) {
            console.error('error deleting blocks', error4);
          }
        }
      }
    };

    loadNoteText();
  }, [selectedNoteEntity, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadNoteTextSystem;
