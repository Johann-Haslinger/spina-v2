import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyNotes } from '../../../base/dummy';
import { DataTypes, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../lib/supabase';
import { displayAlertTexts } from '../../../utils/displayText';
import { useSelectedTopic } from '../hooks/useSelectedTopic';

const fetchNotesForTopic = async (topicId: string) => {
  const { data: notes, error } = await supabaseClient
    .from(SupabaseTables.NOTES)
    .select('title, id, date_added')
    .eq(SupabaseColumns.PARENT_ID, topicId);

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return notes || [];
};

const LoadNotesSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();

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
            (e) => e.get(IdentifierFacet)?.props.guid === note.id && e.hasTag(DataTypes.NOTE),
          );

          if (!isExisting) {
            const noteEntity = new Entity();
            lsc.engine.addEntity(noteEntity);
            noteEntity.add(
              new TitleFacet({
                title: note.title || displayAlertTexts(selectedLanguage).noTitle,
              }),
            );
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
