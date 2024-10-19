import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { dummyGroupSchoolSubjects } from '../../../common/types/dummy';
import { DataType, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';
import { useSelectedLearningGroup } from '../hooks/useSelectedLearningGroup';

const fetchSchoolSubjectsForLearningGroup = async (learningGroupId: string) => {
  const { data: SchoolSubjects, error } = await supabaseClient
    .from(SupabaseTable.GROUP_SCHOOL_SUBJECTS)
    .select('title, id')
    .eq('group_id', learningGroupId);

  if (error) {
    console.error('Error fetching schoolSubjects:', error);
    return [];
  }

  return SchoolSubjects || [];
};

const LoadLearningGroupSchoolSubjectsSystem = () => {
  const { isUsingMockupData: mockupData, isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLearningGroupId } = useSelectedLearningGroup();

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      if (selectedLearningGroupId) {
        const schoolSubjects = mockupData
          ? dummyGroupSchoolSubjects
          : shouldFetchFromSupabase
            ? await fetchSchoolSubjectsForLearningGroup(selectedLearningGroupId)
            : [];

        schoolSubjects.forEach((schoolSubject, idx) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id && e.hasTag(DataType.GROUP_SCHOOL_SUBJECT),
          );

          if (!isExisting) {
            const schoolSubjectEntity = new Entity();
            lsc.engine.addEntity(schoolSubjectEntity);
            schoolSubjectEntity.add(new TitleFacet({ title: schoolSubject.title }));
            schoolSubjectEntity.add(new IdentifierFacet({ guid: schoolSubject.id }));
            schoolSubjectEntity.add(new ParentFacet({ parentId: selectedLearningGroupId }));
            schoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));
            schoolSubjectEntity.addTag(DataType.GROUP_SCHOOL_SUBJECT);
          }
        });
      }
    };

    initializeSchoolSubjectEntities();
  }, [selectedLearningGroupId, mockupData, shouldFetchFromSupabase]);

  return null;
};

export default LoadLearningGroupSchoolSubjectsSystem;
