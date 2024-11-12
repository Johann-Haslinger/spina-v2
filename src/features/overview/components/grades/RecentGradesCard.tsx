import styled from '@emotion/styled';
import { EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, ParentProps, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { IoSchool } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useLoadingIndicator } from '../../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import {
  DateAddedFacet,
  TitleFacet,
  TypeFacet,
  TypeProps,
  ValueFacet,
  ValueProps,
} from '../../../../common/types/additionalFacets';
import { DataType } from '../../../../common/types/enums';
import { dataTypeQuery } from '../../../../common/utilities/queries';
import { sortEntitiesByDateAdded } from '../../../../common/utilities/sortEntitiesByTime';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit md:h-[28rem] overflow-y-scroll pr-0 p-4  rounded-2xl bg-[#FFCC00] bg-opacity-15 dark:bg-opacity-[0.12]`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 text-[#FFCC00] mb-2 dark:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledInfoText = styled.div`
  ${tw` font-medium `}
`;

const RecentGradesCard = () => {
  const hasGrades = useHasGrades();
  const threeWeeksAgo = useThreeWeeksAgo();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoSchool />
        <StyledText>Neue Noten</StyledText>
      </StyledFlexContainer>
      {!isLoadingIndicatorVisible ? (
        <div>
          {' '}
          {!hasGrades && <StyledInfoText>Du hast in den letzten Tagen keine neuen Noten hinzugefügt.</StyledInfoText>}
          <EntityPropsMapper
            query={(e) =>
              new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= threeWeeksAgo &&
              dataTypeQuery(e, DataType.GRADE)
            }
            get={[[ParentFacet, DateAddedFacet, ValueFacet, TypeFacet], []]}
            sort={sortEntitiesByDateAdded}
            onMatch={NewGradeRow}
          />
        </div>
      ) : (
        <div tw="dark:opacity-10 transition-all">
          <NewGradeRowSkeleton />
          <NewGradeRowSkeleton />
          <NewGradeRowSkeleton />
        </div>
      )}
    </StyledCardWrapper>
  );
};

export default RecentGradesCard;

const useThreeWeeksAgo = () => {
  const threeWeeksAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 21);
    return date;
  }, []);
  return threeWeeksAgo;
};

const useHasGrades = () => {
  const threeWeeksAgo = useThreeWeeksAgo();
  const [gradeEntities] = useEntities(
    (e) => dataTypeQuery(e, DataType.GRADE) && new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= threeWeeksAgo,
  );

  return gradeEntities.length > 0;
};

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 w-full items-center pl-2 justify-between py-1.5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2 text-primary dark:text-primary-text-dark`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-secondary-text`}
`;

const NewGradeRow = (props: ValueProps & ParentProps & TypeProps & EntityProps) => {
  const { value, parentId, entity } = props;
  const relatedSchoolSubjectTitle = useRelatedSchoolSubjectTitle(parentId);
  const [isHovered, setIsHovered] = useState(false);

  const openGrade = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        onClick={openGrade}
      >
        <StyledTitle>
          {value} in {relatedSchoolSubjectTitle}
        </StyledTitle>
        <StyledDueDate>{relatedSchoolSubjectTitle}</StyledDueDate>
      </motion.div>
    </StyledRowWrapper>
  );
};

const useRelatedSchoolSubjectTitle = (parentId: string) => {
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const relatedSchoolSubject = schoolSubjectEntities.find(
    (subject) => subject.get(IdentifierFacet)?.props.guid === parentId,
  );
  return relatedSchoolSubject?.get(TitleFacet)?.props.title || '';
};

const NewGradeRowSkeleton = () => (
  <StyledRowWrapper>
    <div tw="w-full">
      <Skeleton baseColor="#F9E07C" highlightColor="#F7E6A6" borderRadius={4} tw="w-1/2 h-3" />
      <Skeleton baseColor="#F7E6A6" highlightColor="#F6EABA" borderRadius={4} tw="w-2/3 h-3" />
    </div>
  </StyledRowWrapper>
);
