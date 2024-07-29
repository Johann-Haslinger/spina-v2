import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import {
  AdditionalTags,
  Stories,
  SupabaseColumns,
  SupabaseTables,
} from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedNote } from "../../hooks/useSelectedNote";

const DeleteNoteAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_NOTE_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedNoteId, selectedNoteEntity } = useSelectedNote();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteNote = async () => {
    navigateBack();
    selectedNoteEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedNoteEntity) {
        lsc.engine.removeEntity(selectedNoteEntity);

        const { error } = await supabaseClient
          .from(SupabaseTables.NOTES)
          .delete()
          .eq(SupabaseColumns.ID, selectedNoteId);

        if (error) {
          console.error("Error deleting note", error);
        }

        const { error: error2 } = await supabaseClient
          .from(SupabaseTables.BLOCKS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedNoteId);

        if (error2) {
          console.error("Error deleting blocks", error2);
        }

        const { error: error3 } = await supabaseClient
          .from(SupabaseTables.PODCASTS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedNoteId);

        if (error3) {
          console.error("Error deleting podcasts", error3);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteNote} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteNoteAlert;
