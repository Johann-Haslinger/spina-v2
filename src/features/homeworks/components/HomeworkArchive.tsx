import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { IoChevronForward, IoHomeOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { RelationshipFacet, TitleFacet, TitleProps } from '../../../base/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../common/utilities/displayText';
import { dataTypeQuery } from '../../../common/utilities/queries';
import { sortEntitiesByDateAdded } from '../../../common/utilities/sortEntitiesByTime';
import { BackButton, NavigationBar, SecondaryText, Spacer, Title, View } from '../../../components';
import { useFormattedDateAdded } from '../../collection/hooks/useFormattedDateAdded';
import InitializeHomeworksForArchiveSystem from '../systems/InitializeHomeworksForArchiveSystem';

const HomeworkArchive = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_HOMEWORKS_ARCHIVE_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_HOMEWORKS_STORY);

  return (
    <div>
      <InitializeHomeworksForArchiveSystem />

      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack} />
        <Title>{displayHeaderTexts(selectedLanguage).homeworksArchive}</Title>
        <Spacer />
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT)}
          get={[[TitleFacet, IdentifierFacet], []]}
          onMatch={SchoolSubjectHomeworksSection}
        />
      </View>
    </div>
  );
};

export default HomeworkArchive;

const StyledSchoolSubjectSectionWrapper = styled.div`
  ${tw` pb-10 `}
`;

const StyledSchoolSubjectTitle = styled.h2`
  ${tw`text-xl font-semibold`}
`;

const SchoolSubjectHomeworksSection = (props: TitleProps & IdentifierProps) => {
  const { title, guid } = props;
  const childHomeworksCount = useChildHomeworksCount(guid);

  return (
    <StyledSchoolSubjectSectionWrapper>
      <StyledSchoolSubjectTitle>{title}</StyledSchoolSubjectTitle>
      <Spacer size={2} />
      {childHomeworksCount == 0 && <SecondaryText>Noch keine Hausaufgaben hinzugefügt.</SecondaryText>}
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.get(RelationshipFacet)?.props.relationship === guid}
        get={[[TitleFacet, IdentifierFacet], []]}
        sort={sortEntitiesByDateAdded}
        onMatch={ArchivedHomeworkCell}
      />
    </StyledSchoolSubjectSectionWrapper>
  );
};

const useChildHomeworksCount = (parentGuid: string) => {
  const [childHomeworkEntities] = useEntities(
    (e) => e.get(RelationshipFacet)?.props.relationship === parentGuid && dataTypeQuery(e, DataType.HOMEWORK),
  );
  return childHomeworkEntities.length;
};

const StyledHomeworkContainer = styled.div`
  ${tw`flex cursor-pointer justify-between w-full py-2 items-center`}
`;

const StyledMotionContainer = styled(motion.div)`
  ${tw`flex items-center space-x-4`}
`;

const StyledIconContainer = styled.div`
  ${tw`text-xl text-primary-color`}
`;

const StyledTitleContainer = styled.div``;

const StyledDateText = styled.p`
  ${tw`text-secondary-text`}
`;

const StyledForwardIcon = styled.div`
  ${tw`text-xl text-secondary-text opacity-70`}
`;

const ArchivedHomeworkCell = (props: EntityProps & TitleProps) => {
  const { entity, title } = props;
  const formattedDateAdded = useFormattedDateAdded(entity);
  const [isHovered, setIsHovered] = useState(false);

  const openHomework = () => entity.add(Tags.SELECTED);

  return (
    <StyledHomeworkContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openHomework}
    >
      <StyledMotionContainer
        animate={{
          x: isHovered ? 15 : 0,
        }}
      >
        <StyledIconContainer>
          <IoHomeOutline />
        </StyledIconContainer>
        <StyledTitleContainer>
          <p>{title}</p>
          <StyledDateText>{formattedDateAdded}</StyledDateText>
        </StyledTitleContainer>
      </StyledMotionContainer>

      <StyledForwardIcon>
        <IoChevronForward />
      </StyledForwardIcon>
    </StyledHomeworkContainer>
  );
};
