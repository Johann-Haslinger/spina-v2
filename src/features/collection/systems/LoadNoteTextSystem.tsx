import { TextFacet } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { dummyText } from "../../../base/dummy";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";
import { useSelectedNote } from "../hooks/useSelectedNote";

const fetchNoteText = async (noteId: string) => {
  const { data: noteTextData, error } = await supabaseClient.from("notes").select("text").eq("id", noteId).single();

  if (error) {
    console.error("error fetching note text", error);
    return;
  }
  return noteTextData?.text;
};

const LoadNoteTextSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const { selectedNoteEntity, selectedNoteId } = useSelectedNote();

  useEffect(() => {
    const loadNoteText = async () => {
      if (selectedNoteId) {
        const noteText = mockupData ? dummyText : shouldFetchFromSupabase && (await fetchNoteText(selectedNoteId));
        selectedNoteEntity?.add(new TextFacet({ text: noteText }));
      }
    };

    loadNoteText();
  }, [selectedNoteEntity, mockupData,shouldFetchFromSupabase]);

  return null;
};

export default LoadNoteTextSystem;
