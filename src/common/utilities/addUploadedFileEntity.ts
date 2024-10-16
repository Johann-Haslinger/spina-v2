import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { FileFacet } from '../../common/types/additionalFacets';
import { AdditionalTag } from '../types/enums';
import { UploadedFile } from '../types/types';

export const addUploadedFileEntity = (lsc: ILeanScopeClient, file: UploadedFile, onEntityAdded?: () => void) => {
  lsc.engine.entities
    .filter((entity) => entity.has(AdditionalTag.UPLOADED_FILE))
    .forEach((e) => lsc.engine.removeEntity(e));

  const fileEntity = new Entity();
  lsc.engine.addEntity(fileEntity);
  fileEntity.add(new FileFacet({ file: file.file }));
  fileEntity.add(new IdentifierFacet({ guid: v4() }));
  fileEntity.add(AdditionalTag.UPLOADED_FILE);

  if (onEntityAdded) {
    onEntityAdded();
  }
};
