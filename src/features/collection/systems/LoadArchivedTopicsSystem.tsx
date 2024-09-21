import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyTopics } from '../../../base/dummy';
import { AdditionalTag, DataType, Story, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSchoolSubjectTopicEntities } from '../hooks/useSchoolSubjectTopicEntities';
import { useSelectedSchoolSubject } from '../hooks/useSelectedSchoolSubject';

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from(SupabaseTable.TOPICS)
    .select('title, id, date_added, description')
    .eq('is_archived', true)
    .eq(SupabaseColumn.PARENT_ID, subjectId);

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }

  return topics || [];
};

const LoadArchivedTopicsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const isObservingTopicArchiveStory = useIsStoryCurrent(Story.OBSERVING_TOPIC_ARCHIVE_STORY);
  const { selectedSchoolSubjectEntity, selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const { hasTopics } = useSchoolSubjectTopicEntities(selectedSchoolSubjectEntity);

  useEffect(() => {
    const initializeTopicEntities = async () => {
      if (selectedSchoolSubjectId && !hasTopics) {
        const topics = mockupData
          ? dummyTopics
          : shouldFetchFromSupabase
            ? await fetchTopicsForSchoolSubject(selectedSchoolSubjectId)
            : [];

        topics.forEach((topic) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === topic.id && e.hasTag(DataType.TOPIC),
          );

          if (!isExisting) {
            const topicEntity = new Entity();
            lsc.engine.addEntity(topicEntity);
            topicEntity.add(new TitleFacet({ title: topic.title }));
            topicEntity.add(new IdentifierFacet({ guid: topic.id }));
            topicEntity.add(new DateAddedFacet({ dateAdded: topic.date_added }));
            +topicEntity.add(new DescriptionFacet({ description: topic.description }));
            topicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
            topicEntity.addTag(DataType.TOPIC);
            topicEntity.addTag(AdditionalTag.ARCHIVED);
          }
        });
      }
    };

    if (isObservingTopicArchiveStory) initializeTopicEntities();
  }, [selectedSchoolSubjectId, mockupData, shouldFetchFromSupabase, isObservingTopicArchiveStory]);

  return null;
};

export default LoadArchivedTopicsSystem;
