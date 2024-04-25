import { useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import  { useEffect } from "react";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import { dummyText } from "../../../base/dummy";
import supabase from "../../../lib/supabase";

const LoadNoteTextSystem = (props: { mockupData?: boolean }) => {
  const {  mockupData } = props;
  const [selectedNoteEntity] = useEntity(
    (e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataTypes.NOTE)
  );
 
  const selectedNoteText = selectedNoteEntity?.get(TextFacet) 
  const selectedNoteId = selectedNoteEntity?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const loadNoteText = async () => {
      let noteText;
      if (mockupData) {
        noteText = dummyText;
      } else {
        const { data: noteTextData, error } = await supabase
          .from("notes")
          .select("text")
          .eq("id", selectedNoteId)
          .single();

        if (error) {
          console.error("error fetching note text", error);
          return;
        }
        noteText = noteTextData?.text;
      }

      selectedNoteEntity?.add(new TextFacet({ text: noteText }));
    };

    if (selectedNoteEntity && !selectedNoteText) {
      loadNoteText();
    }
  }, [selectedNoteEntity]);

  return null;
};

export default LoadNoteTextSystem;
