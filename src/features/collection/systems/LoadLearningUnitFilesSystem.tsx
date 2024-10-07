import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { FilePathFacet, TitleFacet } from '../../../base/additionalFacets';
import { DataType, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useSelectedLearningUnit } from '../../../common/hooks/useSelectedLearningUnit';
import supabaseClient from '../../../lib/supabase';

const fetchFilesForLearningUnit = async (parentId: string) => {
  const { data: files, error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNIT_FILES)
    .select('id, file_path, title')
    .eq('parent_id', parentId);

  if (error) {
    console.error('Error fetching files:', error);
  }

  return files || [];
};

const LoadLearningUnitFilesSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLearningUnitId } = useSelectedLearningUnit();
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      if (selectedLearningUnitId) {
        const files = isUsingMockupData
          ? []
          : isUsingSupabaseData
            ? await fetchFilesForLearningUnit(selectedLearningUnitId)
            : [];

        files.forEach((file) => {
          const isExisting = lsc.engine.entities.some(
            (e) => e.get(IdentifierFacet)?.props.guid === file.id && e.hasTag(DataType.FILE),
          );

          if (!isExisting) {
            const fileEntity = new Entity();
            lsc.engine.addEntity(fileEntity);
            fileEntity.add(new IdentifierFacet({ guid: file.id }));
            fileEntity.add(new TitleFacet({ title: file.title }));
            fileEntity.add(new FilePathFacet({ filePath: file.file_path }));
            fileEntity.add(new ParentFacet({ parentId: selectedLearningUnitId }));
            fileEntity.addTag(DataType.FILE);
          }
        });
      }
    };

    initializeFlashcardEntities();
  }, [selectedLearningUnitId, isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadLearningUnitFilesSystem;
