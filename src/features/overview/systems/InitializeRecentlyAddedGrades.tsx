import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { DateAddedFacet, TypeFacet, ValueFacet } from '../../../common/types/additionalFacets';
import { DataType, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';

const InitializeRecentlyAddedGrades = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const fetchRecentlyAddedGrades = async () => {
      const { data: grades, error } = await supabaseClient
        .from(SupabaseTable.GRADES)
        .select('id, value, parent_id, date_added, type_id');

      if (error) {
        console.error('Error fetching recently added grades', error);
        return;
      }

      grades.forEach((grade) => {
        const isGradeAlreadyAdded = lsc.engine.entities.some((e) => e.get(IdentifierFacet)?.props.guid === grade.id);
        if (isGradeAlreadyAdded) return;

        const newGradeEntity = new Entity();
        lsc.engine.addEntity(newGradeEntity);
        newGradeEntity.add(new IdentifierFacet({ guid: grade.id }));
        newGradeEntity.add(new ValueFacet({ value: grade.value }));
        newGradeEntity.add(new ParentFacet({ parentId: grade.parent_id }));
        newGradeEntity.add(new DateAddedFacet({ dateAdded: grade.date_added }));
        newGradeEntity.add(new TypeFacet({ type: grade.type_id }));
        newGradeEntity.add(DataType.GRADE);
      });
    };

    fetchRecentlyAddedGrades();
  }, []);

  return null;
};

export default InitializeRecentlyAddedGrades;
