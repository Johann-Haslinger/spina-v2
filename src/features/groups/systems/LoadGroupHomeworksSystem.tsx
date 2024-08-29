import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { dummyHomeworks } from '../../../base/dummy';
import { DataType, SupabaseColumn } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useSelectedGroupTopic } from '../hooks/useSelectedGroupTopic';

const fetchGroupHomeworksForTopic = async (topicId: string) => {
  const { data: groupHomeworks, error } = await supabaseClient
    .from('group_homeworks')
    .select('title, id, date_added, dueDate')
    .eq(SupabaseColumn.PARENT_ID, topicId);

  if (error) {
    console.error('Error fetching group homeworks:', error);
    return [];
  }

  return groupHomeworks || [];
};

const LoadGroupHomeworksSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedGroupTopicId } = useSelectedGroupTopic();

  useEffect(() => {
    const initializeGroupHomeworkEntities = async () => {
      if (selectedGroupTopicId) {
        const GroupHomeworks = mockupData
          ? dummyHomeworks
          : shouldFetchFromSupabase
            ? await fetchGroupHomeworksForTopic(selectedGroupTopicId)
            : [];

        GroupHomeworks.forEach((GroupHomework) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === GroupHomework.id && e.hasTag(DataType.GROUP_HOMEWORK),
          );

          if (!isExisting) {
            const GroupHomeworkEntity = new Entity();
            lsc.engine.addEntity(GroupHomeworkEntity);
            GroupHomeworkEntity.add(new TitleFacet({ title: GroupHomework.title }));
            GroupHomeworkEntity.add(new IdentifierFacet({ guid: GroupHomework.id }));
            GroupHomeworkEntity.add(new DateAddedFacet({ dateAdded: GroupHomework.date_added }));

            GroupHomeworkEntity.add(new ParentFacet({ parentId: selectedGroupTopicId }));
            GroupHomeworkEntity.add(new DueDateFacet({ dueDate: GroupHomework.date_added }));
            GroupHomeworkEntity.addTag(DataType.GROUP_HOMEWORK);
          }
        });
      }
    };

    initializeGroupHomeworkEntities();
  }, [selectedGroupTopicId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadGroupHomeworksSystem;
