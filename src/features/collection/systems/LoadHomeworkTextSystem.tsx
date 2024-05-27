import { useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { dummyText } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchHomeworkText = async (homeworkId: string) => {
  const { data: text, error } = await supabaseClient.from(SupabaseTables.HOMEWORKS).select("text").eq("id", homeworkId).single();

  if (error) {
    console.error("Error fetching homework text:", error);
    return [];
  }

  const { error: error2 } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .update({ old_note_version: false })
    .eq("id", homeworkId);

  if (error2) {
    console.error("error updating homework to oldNoteVersion", error2);
  }

  return text.text || [];
};

const fetchNoteVersion = async (homeworkId: string) => {
  const { data: noteVersionData, error } = await supabaseClient
    .from(SupabaseTables.HOMEWORKS)
    .select("old_note_version")
    .eq("id", homeworkId)
    .single();

  if (error) {
    console.error("error fetching homework version", error);
    return;
  }
  return noteVersionData?.old_note_version;
};

const LoadHomeworkTextSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();

  const [selectedHomework] = useEntity((e) => e.hasTag(DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED));
  const selectedHomeworkId = selectedHomework?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const loadHomeworkText = async () => {
      if (selectedHomeworkId) {
        const isOldNoteVersion = shouldFetchFromSupabase && (await fetchNoteVersion(selectedHomeworkId));

        if (isOldNoteVersion) {
          const homeworkText = mockupData
            ? dummyText
            : shouldFetchFromSupabase && (await fetchHomeworkText(selectedHomeworkId));

          if (homeworkText) {
            selectedHomework?.add(new TextFacet({ text: homeworkText }));
          }
        }
      }
    };

    if (selectedHomework) {
      loadHomeworkText();
    }
  }, [selectedHomework, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadHomeworkTextSystem;
