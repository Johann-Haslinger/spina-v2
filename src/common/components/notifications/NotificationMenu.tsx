import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

import styled from '@emotion/styled';
import tw from 'twin.macro';
import { DateAddedFacet, IconFacet, TitleFacet } from '../../../app/additionalFacets';
import { AdditionalTag, Story } from '../../../base/enums';
import NotificationCell from './NotificationCell';

const StyledBackgroundOverlay = styled(motion.div)`
  ${tw` fixed left-0 top-0 right-0 bottom-0 w-full h-full bg-black z-[100]`}
`;

const NotificationMenu = () => {
  const [notificationEntities] = useEntities((e) => e.has(AdditionalTag.NOTIFICATION));
  const isObservingNotification = useIsStoryCurrent(Story.OBSERVING_NOTIFICATION_STORY);
  const recentThreeNotificationEntities = useMemo(() => {
    return [...notificationEntities]
      .filter((e) => e.has(IdentifierFacet) && e.get(IdentifierFacet)?.props.guid)
      .sort((a, b) =>
        (a?.get(DateAddedFacet)?.props.dateAdded ?? '') > (b?.get(DateAddedFacet)?.props.dateAdded ?? '') ? -1 : 1,
      )
      .slice(0, 3);
  }, [notificationEntities.length]);

  useEffect(() => {
    console.log('NotificationMenu rendered', notificationEntities.length, recentThreeNotificationEntities);
  }, [notificationEntities.length]);

  return (
    <div>
      <StyledBackgroundOverlay
        initial={{ opacity: 0 }}
        animate={{
          opacity: isObservingNotification ? 0.2 : 0,
          visibility: isObservingNotification ? 'visible' : 'hidden',
        }}
        transition={{ duration: 0.2 }}
      />
      {recentThreeNotificationEntities.map((entity) => (
        <NotificationCell
          key={entity?.get(IdentifierFacet)?.props?.guid ?? ''}
          entity={entity}
          text={entity?.get(TextFacet)?.props.text || ''}
          title={entity?.get(TitleFacet)?.props.title || ''}
          icon={entity?.get(IconFacet)?.props.icon || ''}
        />
      ))}
    </div>
  );
};

export default NotificationMenu;
