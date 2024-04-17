import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { OrderProps, Tags } from "@leanscope/ecs-models";

import tw from "twin.macro";
import styled from "@emotion/styled";
import { LuLibrary } from "react-icons/lu";
import { COLOR_ITEMS } from "../../../../base/constants";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useSchoolSubjectEntities } from "../../../../hooks/useSchoolSubjectEntities";

const StyledCellContainer = styled.div`
  ${tw`w-full md:w-1/3 p-1.5 lg:w-1/4 2xl:w-1/5`}
`;

const StyledCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw` p-2 w-full flex  items-end  text-7xl hover:text-8xl hover:scale-105  transition-all h-40`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTitle = styled.p`
  ${tw`mt-2 font-black  `}
`;

const SchoolSubjectCell = (props: TitleProps & OrderProps & EntityProps) => {
  const { title, entity, orderIndex } = props;
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);

  const selectSubject = () => {
    schoolSubjectEntities.forEach((e) => e.removeTag(Tags.SELECTED));
    entity.addTag(Tags.SELECTED);
  };

  return (
    <StyledCellContainer>
      <StyledCellWrapper
        backgroundColor={backgroundColor}
        color={color}
        onClick={selectSubject}
      >
        <StyledTitle>{title.slice(0, 2)}</StyledTitle>
      </StyledCellWrapper>
    </StyledCellContainer>
  );
};

export default SchoolSubjectCell;
