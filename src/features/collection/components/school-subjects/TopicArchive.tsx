import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { IoBookOutline, IoChevronForward } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, DateAddedProps, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../base/enums';
import { BackButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from '../../../../components';
import { isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import { useSelectedSchoolSubject } from '../../hooks/useSelectedSchoolSubject';
import LoadArchivedTopicsSystem from '../../systems/LoadArchivedTopicsSystem';

const StyledTopicsWrapper = styled.div`
  /* ${tw`divide-y divide-primary-border dark:divide-primary-border-dark`} */
`;

const TopicArchive = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_TOPIC_ARCHIVE_STORY);
  const { hasArchivedTopics } = useArchivedTopics();
  const { selectedSchoolSubjectEntity } = useSelectedSchoolSubject();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SCHOOL_SUBJECT_STORY);

  return (
    <div>
      <LoadArchivedTopicsSystem />

      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack} />
        <Title>Archiv</Title>
        <Spacer size={6} />
        {!hasArchivedTopics && <NoContentAddedHint />}
        <StyledTopicsWrapper>
          <EntityPropsMapper
            query={(e) =>
              e.hasTag(DataType.TOPIC) &&
              e.hasTag(AdditionalTag.ARCHIVED) &&
              isChildOfQuery(e, selectedSchoolSubjectEntity)
            }
            get={[[TitleFacet, DateAddedFacet], []]}
            sort={sortEntitiesByDateAdded}
            onMatch={ArchivedTopicCell}
          />
        </StyledTopicsWrapper>
      </View>
    </div>
  );
};

export default TopicArchive;

const useArchivedTopics = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedSchoolSubjectEntity } = useSelectedSchoolSubject();
  const archivedTopicEntities = lsc.engine.entities.filter(
    (e) =>
      e.hasTag(DataType.TOPIC) && e.hasTag(AdditionalTag.ARCHIVED) && isChildOfQuery(e, selectedSchoolSubjectEntity),
  );

  const hasArchivedTopics = archivedTopicEntities.length > 0;

  return { archivedTopicEntities, hasArchivedTopics };
};

const ArchivedTopicCell = (props: TitleProps & EntityProps & DateAddedProps) => {
  const { title, entity, dateAdded } = props;
  const [isHovered, setIsHovered] = useState(false);

  const forattedDatedAdded = new Date(dateAdded).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const openTopic = () => entity.addTag(Tags.SELECTED);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tw="flex cursor-pointer justify-between w-full py-2 items-center"
      onClick={openTopic}
    >
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        tw="flex items-center space-x-4 "
      >
        <div tw="text-xl text-primary-color">
          <IoBookOutline />
        </div>
        <div>
          <p>{title}</p>
          <p tw="text-secondary-text">{forattedDatedAdded}</p>
        </div>
      </motion.div>

      <div tw="text-xl text-secondary-text opacity-70">
        <IoChevronForward />
      </div>
    </div>
  );
};
