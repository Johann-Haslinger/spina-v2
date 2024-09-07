import { Entity } from '@leanscope/ecs-engine';
import { useState } from 'react';
import { AdditionalTag } from '../../base/enums';

export const useIsBookmarked = (entity: Entity) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    entity.add(AdditionalTag.BOOKMARKED);
  };

  return { isBookmarked, toggleBookmark };
};
