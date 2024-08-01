import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/additionalFacets";
import { dummyNotes } from "../../../base/dummy";
import {
  DataTypes,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { useSelectedGroupTopic } from "../hooks/useSelectedGroupTopic";

const fetchGroupNotesForTopic = async (topicId: string) => {
  const { data: groupNotes, error } = await supabaseClient
    .from(SupabaseTables.GROUP_NOTES)
    .select("title, id, date_added")
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error("Error fetching group notes:", error);
    return [];
  }

  return groupNotes || [];
};

const LoadGroupGroupNotesSystem = () => {
  const {
    isUsingMockupData: mockupData,
    isUsingSupabaseData: shouldFetchFromSupabase,
  } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupTopicId } = useSelectedGroupTopic();

  useEffect(() => {
    const initializeGroupNoteEntities = async () => {
      if (selectedGroupTopicId) {
        const groupNotes = mockupData
          ? dummyNotes
          : shouldFetchFromSupabase
            ? await fetchGroupNotesForTopic(selectedGroupTopicId)
            : [];

        groupNotes.forEach((note) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === note.id &&
              e.hasTag(DataTypes.GROUP_NOTE),
          );

          if (!isExisting) {
            const groupNoteEntity = new Entity();
            lsc.engine.addEntity(groupNoteEntity);
            groupNoteEntity.add(new TitleFacet({ title: note.title }));
            groupNoteEntity.add(new IdentifierFacet({ guid: note.id }));
            groupNoteEntity.add(
              new DateAddedFacet({ dateAdded: note.date_added }),
            );
            groupNoteEntity.add(
              new ParentFacet({ parentId: selectedGroupTopicId }),
            );
            groupNoteEntity.addTag(DataTypes.GROUP_NOTE);
          }
        });
      }
    };

    initializeGroupNoteEntities();
  }, [selectedGroupTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupGroupNotesSystem;
