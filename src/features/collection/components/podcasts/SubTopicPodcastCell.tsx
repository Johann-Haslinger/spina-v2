import styled from "@emotion/styled/macro";
import { DateAddedProps, TitleProps } from "../../../../app/AdditionalFacets";
import tw from "twin.macro";
import { IoHeadset } from "react-icons/io5";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";

const StyledPodcastCellWrapper = styled.div`
  ${tw`flex space-x-4 items-center pb-16 pt-6 w-full h-16 `}
`;
const StyledPodcastIconWrapper = styled.div<{ backgroundColor: string }>`
  ${tw`size-11 hover:scale-110 transition-all flex items-center justify-center rounded text-xl text-white text-opacity-40`}
  background-color: ${(props) => props.backgroundColor};
`;

const StyledPodcastTitle = styled.p`
  ${tw` dark:text-white text-primatyText font-semibold line-clamp-2`}
`;

const StyledPodcastSubtitle = styled.p`
  ${tw`text-seconderyText line-clamp-2 `}
`;

const SubTopicPodcastCell = (props: TitleProps & DateAddedProps & EntityProps) => {
  const { title, dateAdded, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openPodcast = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledPodcastCellWrapper>
      <StyledPodcastIconWrapper onClick={openPodcast} backgroundColor={backgroundColor}>
        <IoHeadset />
      </StyledPodcastIconWrapper>
      <div>
        <StyledPodcastTitle>{title}</StyledPodcastTitle>
        <StyledPodcastSubtitle>{new Date(dateAdded).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</StyledPodcastSubtitle>
      </div>
    </StyledPodcastCellWrapper>
  );
};

export default SubTopicPodcastCell;
