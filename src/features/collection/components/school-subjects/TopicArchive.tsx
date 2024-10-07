import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { IoBookOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, DateAddedProps, TitleFacet, TitleProps } from '../../../../base/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../base/enums';
import { ShowMoreButton } from '../../../../common/components/buttons';
import { isChildOfQuery } from '../../../../common/utilities/queries';
import { sortEntitiesByDateAdded } from '../../../../common/utilities/sortEntitiesByTime';
import { BackButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from '../../../../components';
import { useSelectedSchoolSubject } from '../../hooks/useSelectedSchoolSubject';
import LoadArchivedTopicsSystem from '../../systems/LoadArchivedTopicsSystem';

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
        <Spacer />
        {!hasArchivedTopics && <NoContentAddedHint />}
        <div>
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
        </div>
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

const StyledArchivedTopicCell = styled.div`
  ${tw`flex cursor-pointer justify-between w-full py-2 items-center`}
`;

const StyledMotionDiv = styled(motion.div)`
  ${tw`flex items-center space-x-4`}
`;

const StyledIconWrapper = styled.div`
  ${tw`text-xl text-primary-color`}
`;

const StyledDateText = styled.p`
  ${tw`text-secondary-text`}
`;

const ArchivedTopicCell = (props: TitleProps & EntityProps & DateAddedProps) => {
  const { title, entity, dateAdded } = props;
  const [isHovered, setIsHovered] = useState(false);

  const formattedDateAdded = new Date(dateAdded).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const openTopic = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledArchivedTopicCell
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openTopic}
    >
      <StyledMotionDiv
        animate={{
          x: isHovered ? 15 : 0,
        }}
      >
        <StyledIconWrapper>
          <IoBookOutline />
        </StyledIconWrapper>
        <div>
          <p>{title}</p>
          <StyledDateText>{formattedDateAdded}</StyledDateText>
        </div>
      </StyledMotionDiv>

      <ShowMoreButton />
    </StyledArchivedTopicCell>
  );
};
