import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { OrderProps, Tags } from "@leanscope/ecs-models";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useSchoolSubjectEntities } from "../../../../hooks/useSchoolSubjectEntities";
import { useAppState } from "../../hooks/useAppState";

const StyledCellContainer = styled.div`
  ${tw`w-1/2  cursor-pointer md:p-1.5  md:w-1/3 lg:w-1/4 2xl:w-1/5`}
`;

const StyledCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw` p-2.5 w-full flex     items-end  text-7xl hover:text-8xl hover:scale-105  transition-all h-40`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTitle = styled.p`
  ${tw`mt-2 font-black  `}
`;

const SchoolSubjectCell = (props: TitleProps & OrderProps & EntityProps) => {
  const { title, entity, orderIndex } = props;
  const { isSidebarVisible } = useAppState();
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);

  const handleOpenSchoolSubject = () => {
    if (!isSidebarVisible) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledCellContainer>
      <StyledCellWrapper
        backgroundColor={backgroundColor}
        color={color}
        onClick={handleOpenSchoolSubject}
      >
        <StyledTitle>{title.slice(0, 2)}</StyledTitle>
      </StyledCellWrapper>
    </StyledCellContainer>
  );
};

export default SchoolSubjectCell;
