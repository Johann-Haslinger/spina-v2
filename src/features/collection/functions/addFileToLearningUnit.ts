import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { FilePathFacet, TitleFacet, TypeFacet } from '../../../app/additionalFacets';
import { DataType, SupabaseStorageBucket, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: string;
}

export const addFileToLearningUnit = async (
  lsc: ILeanScopeClient,
  entity: Entity,
  uploaded: UploadedFile,
  userId: string,
) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const id = v4();
  const cleanedFileName = uploaded.file.name.replace(/\s+/g, '_');
  console.log('cleanedFileName', cleanedFileName);
  const path = `learning_unit_${parentId}/${cleanedFileName}`;

  if (!parentId) return;

  const newFileEntity = new Entity();
  lsc.engine.addEntity(newFileEntity);
  newFileEntity.add(new IdentifierFacet({ guid: id }));
  newFileEntity.add(new ParentFacet({ parentId: parentId }));
  newFileEntity.add(new TypeFacet({ type: uploaded.type }));
  newFileEntity.add(new TitleFacet({ title: cleanedFileName }));
  newFileEntity.add(new FilePathFacet({ filePath: path }));
  newFileEntity.add(DataType.FILE);

  const { error: insertError } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNIT_FILES)
    .insert([{ file_path: path, parent_id: parentId, id, user_id: userId, title: cleanedFileName }]);

  if (insertError) {
    console.error('Error saving file metadata:', insertError);
    return;
  }

  const { data, error } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .upload(path, uploaded.file);

  console.log('data', data);

  if (error) {
    console.error('Upload failed:', error);
    return;
  }
};
