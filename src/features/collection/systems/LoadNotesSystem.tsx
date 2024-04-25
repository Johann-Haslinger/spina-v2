import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { dummyNotes } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchNotesForTopic = async (topicId: string) => {
  const { data: notes, error } = await supabase
    .from("notes")
    .select("title, id, date_added")
    .eq("parentId", topicId);

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return notes || [];
};

const LoadNotesSystem = (props: { mockupData?: boolean }) => {
  const { mockupData } = props;
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeNoteEntities = async () => {
      if (selectedTopicId) {
        const notes = mockupData
          ? dummyNotes
          : await fetchNotesForTopic(selectedTopicId);

        notes.forEach((note) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === note.id &&
              e.hasTag(DataTypes.NOTE)
          );

          if (!isExisting) {
            const noteEntity = new Entity();
            lsc.engine.addEntity(noteEntity);
            noteEntity.add(new TitleFacet({ title: note.title }));
            noteEntity.add(new IdentifierFacet({ guid: note.id }));
            noteEntity.add(new DateAddedFacet({ dateAdded: note.date_added }));

            noteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            noteEntity.addTag(DataTypes.NOTE);
          }
        });
      }
    };

    initializeNoteEntities();
  }, [selectedTopicId]);

  return null;
};

export default LoadNotesSystem;
