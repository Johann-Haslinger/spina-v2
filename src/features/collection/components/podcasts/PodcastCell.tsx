import styled from "@emotion/styled/macro";
import { DateAddedProps, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../../utils/displayText";
import { IoEllipsisHorizontal, IoHeadset } from "react-icons/io5";
import { FlexBox } from "../../../../components";

const StyledPodcastCellWrapper = styled.div`
  ${tw`hover:bg-tertiary items-center flex space-x-4 rounded-lg transition-all  hover:dark:bg-tertiaryDark p-2`}
`;

const StyledPodcastIcon = styled.div`
  ${tw`size-10 rounded  text-white  bg-blue-800 flex items-center justify-center`}
`;
const StyledPodcastTitle = styled.p`
  ${tw`font-semibold line-clamp-1`}
`;
const StyledPodcastSubtitle = styled.p`
  ${tw`text-sm text-seconderyText dark:text-seconderyTextDark line-clamp-1`}
`;
const StyledPodcastActionsWrapper = styled.div`
  ${tw`flex space-x-2 pr-2`}
`;

const PodcastCell = (props: TitleProps & DateAddedProps & EntityProps) => {
  const { title, dateAdded, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const openPodcast = () => entity.add(Tags.SELECTED);

  return (
    <StyledPodcastCellWrapper onClick={openPodcast}>
      <StyledPodcastIcon>
        <IoHeadset />
      </StyledPodcastIcon>
      <FlexBox>
        <div>
          <StyledPodcastTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledPodcastTitle>
          <StyledPodcastSubtitle>
            {" "}
            {new Date(dateAdded).toLocaleDateString("de", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </StyledPodcastSubtitle>
        </div>
        <StyledPodcastActionsWrapper>
          <IoEllipsisHorizontal />
        </StyledPodcastActionsWrapper>
      </FlexBox>
    </StyledPodcastCellWrapper>
  );
};

export default PodcastCell;
