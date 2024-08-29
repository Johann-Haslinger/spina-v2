import { Entity } from '@leanscope/ecs-engine';
import { AdditionalTag } from '../../../base/enums';

export const useIsPodcastPlaying = (entity: Entity) => {
  return entity.has(AdditionalTag.PLAYING);
};
