import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummySubtopics } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupTopic } from '../hooks/useSelectedGroupTopic';

const fetchGroupSubtopicsForSchoolSubject = async (subjectId: string) => {
  const { data: groupSubtopics, error } = await supabaseClient
    .from(SupabaseTable.GROUP_SUBTOPICS)
    .select('title, id, date_added')
    .eq(SupabaseColumn.PARENT_ID, subjectId);

  if (error) {
    console.error('Error fetching group subtopics:', error);
    return [];
  }
  return groupSubtopics || [];
};

const LoadGroupGroupSubtopicsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupTopicId } = useSelectedGroupTopic();

  useEffect(() => {
    const initializeGroupSubtopicEntities = async () => {
      if (selectedGroupTopicId) {
        const groupSubtopics = mockupData
          ? dummySubtopics
          : shouldFetchFromSupabase
            ? await fetchGroupSubtopicsForSchoolSubject(selectedGroupTopicId)
            : [];

        groupSubtopics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataType.GROUP_SUBTOPIC),
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.title }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));

            topicEntity.add(new ParentFacet({ parentId: selectedGroupTopicId }));
            topicEntity.addTag(DataType.GROUP_SUBTOPIC);
          }
        });
      }
    };

    initializeGroupSubtopicEntities();
  }, [selectedGroupTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupGroupSubtopicsSystem;
