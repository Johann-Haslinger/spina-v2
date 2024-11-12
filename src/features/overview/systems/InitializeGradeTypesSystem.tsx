import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useUserData } from '../../../common/hooks/useUserData';
import { TitleFacet, WeightFacet } from '../../../common/types/additionalFacets';
import { DEFAULT_GRADS_TYPES } from '../../../common/types/constants';
import { DataType, SupabaseTable } from '../../../common/types/enums';
import supabaseClient from '../../../lib/supabase';

const fetchGradeTypes = async (userId: string) => {
  const { data: gradeTypes, error } = await supabaseClient.from(SupabaseTable.GRADE_TYPES).select('title, id, weight');

  if (error) {
    console.error('Error fetching grade types', error);
    return;
  }

  if (gradeTypes.length == 0) {
    const newGradeTypes = DEFAULT_GRADS_TYPES.map((type) => ({
      id: uuid(),
      title: type.title,
      weight: type.weight,
      user_id: userId,
    }));

    const { error } = await supabaseClient.from(SupabaseTable.GRADE_TYPES).insert(newGradeTypes);

    if (error) {
      console.error('Error inserting new grade types', error);
      return;
    }

    return newGradeTypes;
  } else {
    return gradeTypes;
  }
};

const InitializeGradeTypesSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { userId } = useUserData();

  useEffect(() => {
    const initializeGradeTypes = async () => {
      const gradeTypes = await fetchGradeTypes(userId);

      gradeTypes?.forEach((gradeType) => {
        const isGradeTypeDuplicate = lsc.engine.entities.some(
          (entity) => entity.get(IdentifierFacet)?.props.guid === gradeType.id,
        );

        if (isGradeTypeDuplicate) return;

        const newGradeEntity = new Entity();
        lsc.engine.addEntity(newGradeEntity);
        newGradeEntity.add(new IdentifierFacet({ guid: gradeType.id }));
        newGradeEntity.add(new TitleFacet({ title: gradeType.title }));
        newGradeEntity.add(new WeightFacet({ weight: gradeType.weight }));
        newGradeEntity.add(DataType.GRADE_TYPE);
      });
    };

    initializeGradeTypes();
  }, [userId]);

  return null;
};

export default InitializeGradeTypesSystem;
