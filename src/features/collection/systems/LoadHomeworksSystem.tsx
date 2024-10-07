import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, DueDateFacet, TitleFacet } from '../../../base/additionalFacets';
import { dummyHomeworks } from '../../../base/dummy';
import { DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedTopic } from '../hooks/useSelectedTopic';

const fetchHomeworksForTopic = async (topicId: string) => {
  const { data: homeworks, error } = await supabaseClient
    .from(SupabaseTable.HOMEWORKS)
    .select('title, id, date_added, due_date')
    .eq(SupabaseColumn.PARENT_ID, topicId);

  if (error) {
    console.error('Error fetching homeworks:', error);
    return [];
  }

  return homeworks || [];
};

const LoadHomeworksSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      if (selectedTopicId) {
        const homeworks = mockupData
          ? dummyHomeworks
          : shouldFetchFromSupabase
            ? await fetchHomeworksForTopic(selectedTopicId)
            : [];

        homeworks.forEach((homework) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === homework.id && e.hasTag(DataType.HOMEWORK),
          );

          if (!isExisting) {
            const homeworkEntity = new Entity();
            lsc.engine.addEntity(homeworkEntity);
            homeworkEntity.add(new TitleFacet({ title: homework.title }));
            homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
            homeworkEntity.add(new DateAddedFacet({ dateAdded: homework.date_added }));

            homeworkEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            homeworkEntity.add(new DueDateFacet({ dueDate: homework.due_date }));
            homeworkEntity.addTag(DataType.HOMEWORK);
          }
        });
      }
    };

    initializeHomeworkEntities();
  }, [selectedTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadHomeworksSystem;
