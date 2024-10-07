import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { TitleFacet } from '../../base/additionalFacets';
import { dummySchoolSubjects } from '../../base/dummy';
import { DataType, SupabaseTable } from '../../base/enums';
import supabaseClient from '../../lib/supabase';
import { useLoadingIndicator } from '../hooks';
import { useCurrentDataSource } from '../hooks/useCurrentDataSource';
import { dataTypeQuery } from '../utilities/queries';

const fetchSchoolSubjects = async () => {
  const { data: schoolSubjects, error } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).select('title, id');

  if (error) {
    console.error('Error fetching school subjects:', error);
    return [];
  }

  return schoolSubjects || [];
};

const InitializeSchoolSubjectsSystem = () => {
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const lsc = useContext(LeanScopeClientContext);
  const { loadingIndicatorEntity } = useLoadingIndicator();

  useEffect(() => {
    const initializeSchoolSubjectEntities = async () => {
      loadingIndicatorEntity?.add(Tags.CURRENT);
      if (!isUsingMockupData && !isUsingSupabaseData) return;

      const schoolSubjects = isUsingMockupData
        ? dummySchoolSubjects
        : isUsingSupabaseData
          ? await fetchSchoolSubjects()
          : [];

      schoolSubjects.forEach((schoolSubject, idx) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === schoolSubject.id && dataTypeQuery(e, DataType.SCHOOL_SUBJECT),
        );

        if (!isExisting) {
          const schoolSubjectEntity = new Entity();
          lsc.engine.addEntity(schoolSubjectEntity);
          schoolSubjectEntity.add(new TitleFacet({ title: schoolSubject.title }));
          schoolSubjectEntity.add(new IdentifierFacet({ guid: schoolSubject.id }));
          schoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));
          schoolSubjectEntity.addTag(DataType.SCHOOL_SUBJECT);
        }
      });
      if (schoolSubjects.length > 0) {
        const timeoutId = setTimeout(() => {
          loadingIndicatorEntity?.remove(Tags.CURRENT);
        }, 300);

        return () => {
          clearTimeout(timeoutId);
          lsc.engine.entities
            .filter((e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT))
            .forEach((e) => lsc.engine.removeEntity(e));
        };
      }
    };

    initializeSchoolSubjectEntities();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default InitializeSchoolSubjectsSystem;
