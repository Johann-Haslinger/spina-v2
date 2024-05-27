import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummyNotes } from "../../../base/dummy";
import { DataTypes, SupabaseTables } from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../utils/displayText";

const fetchNotesForTopic = async (topicId: string) => {
  const { data: notes, error } = await supabaseClient
    .from(SupabaseTables.NOTES)
    .select("title, id, date_added")
    .eq("parent_id", topicId);

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return notes || [];
};

const LoadNotesSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const {selectedLanguage} = useSelectedLanguage()

  useEffect(() => {
    const initializeNoteEntities = async () => {
      if (selectedTopicId) {
        const notes = mockupData
          ? dummyNotes
          : shouldFetchFromSupabase
          ? await fetchNotesForTopic(selectedTopicId)
          : [];

        notes.forEach((note) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === note.id && e.hasTag(DataTypes.NOTE)
          );

          if (!isExisting) {
            const noteEntity = new Entity();
            lsc.engine.addEntity(noteEntity);
            noteEntity.add(new TitleFacet({ title: note.title || displayAlertTexts(selectedLanguage).noTitle }));
            noteEntity.add(new IdentifierFacet({ guid: note.id }));
            noteEntity.add(new DateAddedFacet({ dateAdded: note.date_added }));
            noteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            noteEntity.addTag(DataTypes.NOTE);
          }
        });
      }
    };

    initializeNoteEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase, selectedLanguage]);

  return null;
};

export default LoadNotesSystem;
