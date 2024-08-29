import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyGroupTopics } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupSchoolSubject } from '../hooks/useSelectedGroupSchoolSubject';

const fetchGroupTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: GroupTopics, error } = await supabaseClient
    .from(SupabaseTable.GROUP_TOPICS)
    .select('title, id, date_added, description')
    .eq(SupabaseColumn.PARENT_ID, subjectId);

  if (error) {
    console.error('Error fetching learning group topics:', error);
    return [];
  }

  return GroupTopics || [];
};

const LoadGroupTopicsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupSchoolSubjectId } = useSelectedGroupSchoolSubject();

  useEffect(() => {
    const initializeGroupTopicEntities = async () => {
      if (selectedGroupSchoolSubjectId) {
        const learningGroupTopics = mockupData
          ? dummyGroupTopics
          : shouldFetchFromSupabase
            ? await fetchGroupTopicsForSchoolSubject(selectedGroupSchoolSubjectId)
            : [];

        learningGroupTopics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataType.GROUP_TOPIC),
          );

          if (!isExisting) {
            const learningGroupTopicEntity = new Entity();
            lsc.engine.addEntity(learningGroupTopicEntity);
            learningGroupTopicEntity.add(new TitleFacet({ title: topic.title }));
            learningGroupTopicEntity.add(new IdentifierFacet({ guid: topic.id }));
            learningGroupTopicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));
            learningGroupTopicEntity.add(new DescriptionFacet({ description: topic.description }));
            learningGroupTopicEntity.add(new ParentFacet({ parentId: selectedGroupSchoolSubjectId }));
            learningGroupTopicEntity.addTag(DataType.GROUP_TOPIC);
          }
        });
      }
    };

    initializeGroupTopicEntities();
  }, [selectedGroupSchoolSubjectId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupTopicsSystem;
