import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, useEntities, useEntityHasTags } from '@leanscope/ecs-engine';
import { Tags, TextProps } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, IconProps, TitleProps } from '../../../common/types/additionalFacets';
import { useOutsideClick } from '../../hooks';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { AdditionalTag, Story } from '../../types/enums';

const useOrderOfNotification = (entity: Entity) => {
  const [order, setOrder] = useState(0);
  const [notificationEntities] = useEntities((e) => e.has(Tags.CURRENT) && e.has(AdditionalTag.NOTIFICATION));

  useEffect(() => {
    const index = [...notificationEntities]
      .sort((a, b) =>
        (a?.get(DateAddedFacet)?.props.dateAdded ?? '') > (b?.get(DateAddedFacet)?.props.dateAdded ?? '') ? -1 : 1,
      )
      .slice(0, 3)
      .findIndex((e) => e === entity);
    setOrder(index);
  }, [entity, notificationEntities.length]);

  return order;
};

const StyledNotificationIconContainer = styled(motion.div)`
  ${tw` bg-opacity-10 text-3xl flex justify-center items-center size-16 rounded-xl`}
`;

const StyledNotificationLargeIcon = styled.div`
  ${tw`pt-6 pb-3 text-5xl`}
`;

const StyledNotificationFirstName = styled(motion.p)`
  ${tw`font-semibold dark:opacity-90 line-clamp-1`}
`;

const StyledNotificationProgressBar = styled(motion.div)`
  ${tw` bg-opacity-30 bg-secondary-text dark:bg-white dark:bg-opacity-20 rounded-full h-0.5 opacity-50`}
`;

const StyledNotificationCell = styled(motion.div)<{ isSelected: boolean }>`
  ${tw`dark:bg-opacity-5  dark:text-white md:left-1/4 transform -translate-x-1/2 md:w-1/2 xl:left-1/3 xl:w-1/3 select-none absolute cursor-pointer overflow-hidden flex flex-col justify-between shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] h-24 bg-white w-[95%] left-[2.5%] rounded-2xl bg-opacity-70 backdrop-blur dark:backdrop-blur-lg`}
  ${({ isSelected }) => isSelected && tw`dark:backdrop-blur-xl dark:bg-opacity-10 backdrop-blur-lg`}
`;

const StyledText = styled(motion.p)<{ isSelected: boolean }>`
  ${tw` text-secondary-text `}
  ${({ isSelected }) => (isSelected ? tw`text-lg mt-2` : tw`line-clamp-2 text-sm mt-0.5`)}
`;

const Z_INDEX_DEFAULT = 100;
const Z_INDEX_SELECTED = 400;
const TOP_DISTANCE_MOBILE = 64;
const TOP_DISTANCE_DESKTOP = 32;
const NOTIFICATION_HEIGHT_MOBILE = 104;

const NotificationCell = (props: TextProps & EntityProps & TitleProps & IconProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, text, title, icon } = props;
  const [isNotificationDisplayed] = useEntityHasTags(entity, Tags.CURRENT);
  const notificationOrder = useOrderOfNotification(entity);
  const [isNotificationSelected] = useEntityHasTags(entity, Tags.SELECTED);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowDimensions();
  const isDismissProgressVisible = !isNotificationSelected;

  const deleteNotification = () => {
    lsc.stories.transitTo(Story.ANY);
    entity.removeTag(Tags.CURRENT);

    setTimeout(() => {
      lsc.engine.removeEntity(entity);
    }, 300);
  };

  const handleOutsideClick = () => {
    entity.removeTag(Tags.SELECTED);
    lsc.stories.transitTo(Story.ANY);
  };

  const { dismissProgress, pause, resume } = useDismissProgress(deleteNotification);
  useOutsideClick(notificationRef, handleOutsideClick, isNotificationSelected);

  const handleNotificationClick = () => {
    lsc.stories.transitTo(Story.OBSERVING_NOTIFICATION_STORY);
    entity.addTag(Tags.SELECTED);
  };

  const zIndex = isNotificationSelected ? Z_INDEX_SELECTED : isNotificationDisplayed ? Z_INDEX_DEFAULT : 1;
  const topDistance = isMobile
    ? TOP_DISTANCE_MOBILE + notificationOrder * NOTIFICATION_HEIGHT_MOBILE
    : TOP_DISTANCE_DESKTOP + notificationOrder * NOTIFICATION_HEIGHT_MOBILE;
  const isDisplayedLarge = isNotificationSelected && !isMobile;

  return (
    <div>
      <StyledNotificationCell
        isSelected={isNotificationSelected}
        ref={notificationRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        initial={{
          y: -20,
          opacity: 0.5,
          scale: 0,
        }}
        animate={{
          width: isDisplayedLarge ? '40%' : '',
          left: isDisplayedLarge ? '30%' : '',
          height: isNotificationSelected ? '60%' : '',
          y: isNotificationDisplayed ? 0 : -20,
          opacity: isNotificationDisplayed ? 1 : 0.5,
          scale: isNotificationDisplayed ? 1 : 0,
          top: topDistance,
          zIndex: zIndex,
        }}
        whileHover={{ scale: isNotificationSelected ? 1 : 1.05 }}
        transition={{ duration: 0.9, type: 'spring', bounce: 0.25 }}
      >
        <CloseButton entity={entity} />
        <motion.div onClick={handleNotificationClick} tw="flex space-x-5 p-3 pr-5">
          <div tw="flex items-center">
            <StyledNotificationIconContainer
              initial={{
                display: 'flex',
              }}
              animate={{
                display: !isNotificationSelected ? 'flex' : 'none',
                width: !isNotificationSelected ? '4rem' : '0rem',
                opacity: !isNotificationSelected ? 1 : 0,
              }}
            >
              {icon}
            </StyledNotificationIconContainer>
          </div>
          <div>
            <motion.div
              initial={{
                height: '0rem',
                opacity: 0,
              }}
              animate={{
                height: isNotificationSelected ? 'auto' : '0rem',
                opacity: isNotificationSelected ? 1 : 0,
              }}
            >
              <StyledNotificationLargeIcon>{icon}</StyledNotificationLargeIcon>
            </motion.div>
            <StyledNotificationFirstName
              initial={{
                fontSize: '1rem',
              }}
              animate={{
                fontSize: isNotificationSelected ? '1.8rem' : '1rem',
              }}
            >
              {title}
            </StyledNotificationFirstName>
            <StyledText isSelected={isNotificationSelected}>{text}</StyledText>
          </div>
        </motion.div>
        <StyledNotificationProgressBar
          animate={{ width: dismissProgress + '%', opacity: isDismissProgressVisible ? 1 : 0 }}
        />
      </StyledNotificationCell>
    </div>
  );
};

export default NotificationCell;

const useDismissProgress = (onComplete: () => void) => {
  const [dismissProgress, setDismissProgress] = useState(0);
  const isObservingNotification = useIsStoryCurrent(Story.OBSERVING_NOTIFICATION_STORY);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isObservingNotification) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  }, [isObservingNotification]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDismissProgress((prev) => {
        const nextProgress = (prev + 1) % 100;
        if (nextProgress === 0) {
          onComplete();
        }
        return nextProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const pause = () => setIsRunning(false);
  const resume = () => !isObservingNotification && setIsRunning(true);

  return { dismissProgress: dismissProgress, pause, resume };
};

const StyledCloseButtonWrapper = styled(motion.div)`
  ${tw`absolute bg-black text-secondary-text bg-opacity-5 dark:bg-white dark:bg-opacity-5 rounded-full p-1 right-0 top-0`}
`;

const StyledCloseIcon = styled(IoClose)`
  ${tw`dark:text-white`}
`;

const CloseButton = (props: EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity } = props;
  const [isSelected] = useEntityHasTags(entity, Tags.SELECTED);

  const deleteNotification = () => {
    lsc.stories.transitTo(Story.ANY);
    entity.removeTag(Tags.SELECTED);
    entity.removeTag(Tags.CURRENT);

    setTimeout(() => {
      lsc.engine.removeEntity(entity);
    }, 300);
  };

  return (
    <StyledCloseButtonWrapper
      onClick={deleteNotification}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: isSelected ? 1.2 : 1, margin: isSelected ? 12 : 8 }}
      whileHover={{ scale: isSelected ? 1.4 : 1.2 }}
    >
      <StyledCloseIcon />
    </StyledCloseButtonWrapper>
  );
};
