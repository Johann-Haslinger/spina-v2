import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { DateAddedFacet, RelationshipFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { dummyHomeworks } from '../../../common/types/dummy';
import { DataType, Story, SupabaseTable } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';
import supabaseClient from '../../../lib/supabase';

const fetchHomeworksForArchive = async () => {
  const { data, error } = await supabaseClient
    .from(SupabaseTable.HOMEWORKS)
    .select('title, id, parent_id, related_subject, date_added');

  if (error) {
    console.error('Error fetching homeworks for archive:', error);
    return [];
  }

  return data || [];
};

const InitializeHomeworksForArchiveSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isHomeworkArchiveVisible = useIsStoryCurrent(Story.OBSERVING_HOMEWORKS_ARCHIVE_STORY);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeHomeworksForArchive = async () => {
      const homeworks = isUsingMockupData
        ? dummyHomeworks
        : isUsingSupabaseData
          ? await fetchHomeworksForArchive()
          : [];

      homeworks.forEach((homework) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === homework.id && dataTypeQuery(e, DataType.HOMEWORK),
        );

        if (!isExisting) {
          const homeworkEntity = new Entity();
          lsc.engine.addEntity(homeworkEntity);
          homeworkEntity.add(new TitleFacet({ title: homework.title }));
          homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
          homeworkEntity.add(new ParentFacet({ parentId: homework.parent_id }));
          homeworkEntity.add(new RelationshipFacet({ relationship: homework.related_subject }));
          homeworkEntity.add(new DateAddedFacet({ dateAdded: homework.date_added }));
          homeworkEntity.addTag(DataType.HOMEWORK);
        }
      });
    };

    if (isHomeworkArchiveVisible) {
      initializeHomeworksForArchive();
    }
  }, [isHomeworkArchiveVisible, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default InitializeHomeworksForArchiveSystem;
