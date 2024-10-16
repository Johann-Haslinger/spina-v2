import { Entity } from '@leanscope/ecs-engine';
import { AdditionalTag } from '../../../common/types/enums';

export const useIsPodcastPlaying = (entity: Entity) => {
  return entity.has(AdditionalTag.PLAYING);
};
