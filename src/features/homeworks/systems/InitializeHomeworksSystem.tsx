import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import {
  DateAddedFacet,
  DueDateFacet,
  RelationshipFacet,
  StatusFacet,
  TitleFacet,
} from '../../../app/additionalFacets';
import { dummyHomeworks } from '../../../base/dummy';
import { DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { dataTypeQuery } from '../../../utils/queries';

const fetchHomeworks = async () => {
  const sevenDaysAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: homeworks, error } = await supabaseClient
    .from(SupabaseTable.HOMEWORKS)
    .select('title, id, due_date, status, parent_id, related_subject')
    .gte('due_date', sevenDaysAgo);

  if (error) {
    console.error('Error fetching homeworks:', error);
    return [];
  }

  return homeworks || [];
};

const InitializeHomeworksSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      const homeworks = mockupData ? dummyHomeworks : shouldFetchFromSupabase ? await fetchHomeworks() : [];

      homeworks.forEach((homework) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === homework.id && dataTypeQuery(e, DataType.HOMEWORK),
        );

        if (!isExisting) {
          const homeworkEntity = new Entity();
          lsc.engine.addEntity(homeworkEntity);
          homeworkEntity.add(new TitleFacet({ title: homework.title || 'Kein Titel' }));
          homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
          homeworkEntity.add(new DueDateFacet({ dueDate: homework.due_date }));
          homeworkEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
          homeworkEntity.add(new StatusFacet({ status: homework.status }));
          homeworkEntity.add(new ParentFacet({ parentId: homework.parent_id }));
          homeworkEntity.add(new RelationshipFacet({ relationship: homework.related_subject }));
          homeworkEntity.addTag(DataType.HOMEWORK);
        }
      });
    };

    initializeHomeworkEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null;
};

export default InitializeHomeworksSystem;
