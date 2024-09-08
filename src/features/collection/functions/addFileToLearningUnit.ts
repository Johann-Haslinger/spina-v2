import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, UrlFacet } from '@leanscope/ecs-models';
import { FileFacet, TitleFacet, TypeFacet } from '../../../app/additionalFacets';
import { v4 } from 'uuid';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: string;
}

export const addFileToLearningUnit = async (lsc: ILeanScopeClient, entity: Entity, file: UploadedFile) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const id = v4();

  if (!parentId) return;

  const newFileEntity = new Entity();
  lsc.engine.addEntity(newFileEntity);
  newFileEntity.add(new IdentifierFacet({ guid: id }));
  newFileEntity.add(new ParentFacet({ parentId: parentId }));
  newFileEntity.add(new TypeFacet({ type: file.type }));
  newFileEntity.add(new UrlFacet({ url: file.url }));
  newFileEntity.add(new FileFacet({ file: file.file }));
  newFileEntity.add(new TitleFacet({ title: file.file.name }));
};
