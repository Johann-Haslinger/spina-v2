import { TextFacet } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { dummyText } from "../../../base/dummy";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";
import { useSelectedNote } from "../hooks/useSelectedNote";
import { SupabaseTables } from "../../../base/enums";

const fetchNoteText = async (noteId: string) => {
  const { data: noteTextData, error } = await supabaseClient.from(SupabaseTables.NOTES).select("text").eq("id", noteId).single();

  if (error) {
    console.error("error fetching note text", error);
    return;
  }

  const { error: error2 } = await supabaseClient.from(SupabaseTables.NOTES).update({ old_note_version: false}).eq("id", noteId);

  if (error2) {
    console.error("error updating note to oldNoteVersion", error2);
  }

  return noteTextData?.text;
};

const fetchNoteVersion = async (noteId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTables.NOTES)
    .select("old_note_version")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("error fetching note version", error);
    return;
  }
  return noteVersionData?.old_note_version;
};

const LoadNoteTextSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { selectedNoteEntity, selectedNoteId } = useSelectedNote();

  useEffect(() => {
    const loadNoteText = async () => {
      if (selectedNoteId) {
        const isOldNoteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedNoteId));

        if (isOldNoteVersion) {
          const noteText = mockupData ? dummyText : shouldFetchFromSupabase && (await fetchNoteText(selectedNoteId));
          selectedNoteEntity?.add(new TextFacet({ text: noteText }));
        }
      }
    };

    loadNoteText();
  }, [selectedNoteEntity, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadNoteTextSystem;
