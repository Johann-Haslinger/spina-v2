import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { OrderProps, Tags } from "@leanscope/ecs-models";
import tw from "twin.macro";
import { TitleProps } from "../../../../app/additionalFacets";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useAppState } from "../../hooks/useAppState";

const StyledCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw` p-2.5 w-full flex  text-[#F5F5F5]   cursor-pointer  items-end  text-7xl md:hover:text-8xl md:hover:scale-105  transition-all h-40`}
  background-color: ${({ backgroundColor }) => backgroundColor + "90"};
  color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledTitle = styled.p`
  ${tw`mt-2 font-black  `}
`;

const SchoolSubjectCell = (props: TitleProps & OrderProps & EntityProps) => {
  const { title, entity } = props;
  const { isSidebarVisible } = useAppState();
  const { color, accentColor } = useSchoolSubjectColors(props.entity);

  const handleOpenSchoolSubject = () => {
    if (!isSidebarVisible) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledCellWrapper backgroundColor={accentColor} color={color   || ""} onClick={handleOpenSchoolSubject}>
      <StyledTitle>{title.slice(0, 2)}</StyledTitle>
    </StyledCellWrapper>
  );
};

export default SchoolSubjectCell;
