import { IdentifierFacet, TextFacet } from '@leanscope/ecs-models';
import { SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';
import { useSelectedHomework } from './useSelectedHomework';
import { useSelectedNote } from './useSelectedNote';
import { useSelectedSubtopic } from './useSelectedSubtopic';

export const useVisibleText = () => {
  const { selectedNoteText, selectedNoteEntity } = useSelectedNote();
  const { selectedSubtopicText, selectedSubtopicEntity } = useSelectedSubtopic();
  const { selectedHomeworkText, selectedHomeworkEntity } = useSelectedHomework();

  const visibleText = selectedNoteText || selectedSubtopicText || selectedHomeworkText || '';
  const visibletextEntity = selectedNoteEntity || selectedSubtopicEntity || selectedHomeworkEntity;

  const setVisibleText = async (newText: string) => {
    if (visibletextEntity) {
      visibletextEntity.add(new TextFacet({ text: newText }));

      const textEntityId = visibletextEntity.get(IdentifierFacet)?.props.guid;

      const { error } = await supabaseClient
        .from(SupabaseTable.TEXTS)
        .update({ parent_id: textEntityId, text: newText });

      if (error) {
        console.error('Error updating text', error);
      }
    }
  };

  return { visibleText, setVisibleText };
};
