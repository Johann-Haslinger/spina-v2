import { Entity } from '@leanscope/ecs-engine';
import { AdditionalTags } from '../../../base/enums';

export const useIsPodcastPlaying = (entity: Entity) => {
  return entity.has(AdditionalTags.PLAYING);
};
